/**
 * Stripe webhook — the only place an order's payment state ever changes.
 *
 * The success page can't be trusted for this: anyone can open that URL, and a
 * client who pays and then loses their connection never loads it at all. So
 * fulfilment is driven entirely from signature-verified Stripe events.
 *
 * Setup: in the Stripe Dashboard add an endpoint for
 *   https://launchboarding.com/api/webhooks/stripe
 * subscribed to exactly the events in HANDLED below, then put its signing
 * secret in STRIPE_WEBHOOK_SECRET. DEPLOYMENT.md has the full list.
 *
 * Events are resolved back to an order through Stripe's object graph —
 * subscription, invoice, or payment intent id — and fall back to metadata only
 * when the graph gives us nothing, so a renewal or dispute that arrives with
 * no session attached still finds its order.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe, stripeEnabled } from "@/lib/stripe";
import { formatMoney } from "@/lib/catalog";
import { notifyAdmin } from "@/lib/notify";
import type Stripe from "stripe";
import type { Order } from "@prisma/client";

// Signature verification needs the raw body, so this route must stay on Node.
export const runtime = "nodejs";

/**
 * The events this endpoint acts on — subscribe the Stripe endpoint to exactly
 * these and nothing more. Kept here as documentation beside the switch below;
 * DEPLOYMENT.md repeats the list for the Dashboard setup.
 */
const HANDLED = [
  // Checkout + delayed-notification payments
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
  // Billing lifecycle — renewals, dunning, cancellation
  "invoice.paid",
  "invoice.payment_failed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  // Risk — money already gone or at risk
  "charge.refunded",
  "charge.dispute.created",
  "radar.early_fraud_warning.created",
] as const;
void HANDLED;

type OrderItem = { sku: string; name: string; setupCents: number; monthlyCents: number };

const idOf = (v: string | { id: string } | null | undefined): string | null =>
  typeof v === "string" ? v : v?.id ?? null;

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeEnabled() || !secret) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    // Either a forged request or a mismatched signing secret — never trust it.
    console.error("[stripe-webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      // `completed` can arrive while a delayed-notification payment is still
      // unpaid, so paid-ness is read off the session rather than assumed.
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await handleCheckoutSession(event.data.object);
        break;

      case "checkout.session.async_payment_failed":
        await setStatusFromSession(event.data.object, "FAILED");
        break;
      case "checkout.session.expired":
        await setStatusFromSession(event.data.object, "CANCELLED");
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object);
        break;
      case "invoice.payment_failed":
        await handleInvoiceFailed(event.data.object);
        break;

      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(event.data.object);
        break;

      case "charge.refunded":
        await handleRefund(event.data.object);
        break;
      case "charge.dispute.created":
        await handleDispute(event.data.object);
        break;
      case "radar.early_fraud_warning.created":
        await handleFraudWarning(event.data.object);
        break;

      default:
        // Acknowledged and ignored — the endpoint shouldn't be subscribed to it.
        break;
    }
  } catch (err) {
    // A 500 makes Stripe retry, which is what we want for a transient DB blip.
    console.error(`[stripe-webhook] failed handling ${event.type}`, err);
    return NextResponse.json({ error: "Handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

/* ------------------------------------------------------------------ *
 * Resolving an event back to one of our orders
 * ------------------------------------------------------------------ */

async function orderBySubscription(subscriptionId: string | null): Promise<Order | null> {
  if (!subscriptionId) return null;
  return prisma.order.findFirst({ where: { stripeSubscriptionId: subscriptionId } });
}

async function orderByMetadata(metadata: Stripe.Metadata | null): Promise<Order | null> {
  const id = metadata?.orderId;
  if (!id) return null;
  return prisma.order.findUnique({ where: { id } });
}

/** The subscription an invoice belongs to, on this API version's object graph. */
function subscriptionOfInvoice(invoice: Stripe.Invoice): string | null {
  const details = invoice.parent?.subscription_details;
  return details ? idOf(details.subscription) : null;
}

async function orderForInvoice(invoice: Stripe.Invoice): Promise<Order | null> {
  return (
    (await orderBySubscription(subscriptionOfInvoice(invoice))) ??
    (invoice.id
      ? await prisma.order.findFirst({ where: { stripeInvoiceId: invoice.id } })
      : null) ??
    (await orderByMetadata(invoice.metadata))
  );
}

/**
 * Walks a charge back to an order: its payment intent for one-off work, or the
 * subscription behind its invoice for recurring work.
 */
async function orderForCharge(charge: Stripe.Charge): Promise<Order | null> {
  const paymentIntentId = idOf(charge.payment_intent);
  if (paymentIntentId) {
    const direct = await prisma.order.findFirst({
      where: { stripePaymentIntentId: paymentIntentId },
    });
    if (direct) return direct;
  }

  // Recurring charges hang off an invoice rather than one of our own payment
  // intents, so fall back to the customer and take their newest subscription
  // order — that's the one a renewal charge belongs to.
  const customerId = idOf(charge.customer);
  if (customerId) {
    const viaCustomer = await prisma.order.findFirst({
      where: { stripeCustomerId: customerId, stripeSubscriptionId: { not: null } },
      orderBy: { createdAt: "desc" },
    });
    if (viaCustomer) return viaCustomer;
  }

  return orderByMetadata(charge.metadata);
}

/* ------------------------------------------------------------------ *
 * Checkout
 * ------------------------------------------------------------------ */

async function handleCheckoutSession(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId || session.client_reference_id || null;
  if (!orderId) {
    console.error("[stripe-webhook] session carried no order id", session.id);
    return;
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    console.error("[stripe-webhook] no such order", orderId);
    return;
  }

  // Only fulfil once the money is actually there. With a delayed-notification
  // method `completed` fires while the session is still unpaid; the matching
  // async_payment_succeeded event brings us back here later.
  const paid =
    session.payment_status === "paid" || session.payment_status === "no_payment_required";

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: paid ? "PAID" : "PROCESSING",
      paidAt: paid ? order.paidAt ?? new Date() : null,
      stripeSessionId: session.id,
      stripeCustomerId: idOf(session.customer) ?? order.stripeCustomerId,
      stripePaymentIntentId: idOf(session.payment_intent) ?? order.stripePaymentIntentId,
      stripeSubscriptionId: idOf(session.subscription) ?? order.stripeSubscriptionId,
    },
  });

  if (!paid) return;
  // Stripe retries, and completed + async_payment_succeeded can both land.
  if (order.status === "PAID") return;

  await linkToUser(updated);
  await notifyPaid(updated);
}

async function setStatusFromSession(
  session: Stripe.Checkout.Session,
  status: "CANCELLED" | "FAILED"
) {
  const orderId = session.metadata?.orderId || session.client_reference_id || null;
  if (!orderId) return;
  // Never walk back an order that already paid.
  await prisma.order.updateMany({
    where: { id: orderId, status: { in: ["PENDING", "PROCESSING"] } },
    data: { status },
  });
}

/* ------------------------------------------------------------------ *
 * Billing lifecycle
 * ------------------------------------------------------------------ */

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const order = await orderForInvoice(invoice);
  if (!order) return;

  const firstPayment = order.status !== "PAID";

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "PAID",
      paidAt: order.paidAt ?? new Date(),
      lastInvoicePaidAt: new Date(),
      stripeCustomerId: idOf(invoice.customer) ?? order.stripeCustomerId,
      stripeSubscriptionId: subscriptionOfInvoice(invoice) ?? order.stripeSubscriptionId,
    },
  });

  // Renewals are routine; only shout about the first payment on an order, so
  // the inbox doesn't fill up every month with "a subscription renewed".
  if (firstPayment) {
    await linkToUser(updated);
    await notifyPaid(updated);
  }
}

async function handleInvoiceFailed(invoice: Stripe.Invoice) {
  const order = await orderForInvoice(invoice);
  if (!order) return;

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "PAST_DUE" },
  });

  await notifyAdmin(
    `Payment failed — ${order.reference} (${order.email})`,
    `<p>A ${formatMoney(invoice.amount_due)} invoice for <strong>${order.reference}</strong> failed.</p>
     <p>Stripe will retry automatically. If it keeps failing the subscription will cancel —
     worth a call to ${order.name ?? order.email}${order.phone ? ` on ${order.phone}` : ""}.</p>
     ${invoice.hosted_invoice_url ? `<p><a href="${invoice.hosted_invoice_url}">Invoice</a></p>` : ""}`
  );
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const order =
    (await orderBySubscription(subscription.id)) ?? (await orderByMetadata(subscription.metadata));
  if (!order) return;

  const ended = subscription.status === "canceled" || subscription.status === "incomplete_expired";

  await prisma.order.update({
    where: { id: order.id },
    data: {
      subscriptionStatus: subscription.status,
      // The one-time project work stays paid; only the recurring part stops.
      ...(ended ? { monthlyCents: 0 } : {}),
    },
  });

  if (ended) {
    await notifyAdmin(
      `Subscription cancelled — ${order.reference}`,
      `<p>${order.name ?? order.email} (${order.email}) is no longer being billed monthly
       on <strong>${order.reference}</strong>. Stripe status: ${subscription.status}.</p>`
    );
  }
}

/* ------------------------------------------------------------------ *
 * Risk
 * ------------------------------------------------------------------ */

async function handleRefund(charge: Stripe.Charge) {
  const order = await orderForCharge(charge);
  if (!order) return;

  const fullyRefunded = charge.amount_refunded >= charge.amount;

  await prisma.order.update({
    where: { id: order.id },
    data: {
      refundedCents: charge.amount_refunded,
      ...(fullyRefunded ? { status: "REFUNDED" } : {}),
    },
  });

  await notifyAdmin(
    `Refund ${fullyRefunded ? "(full)" : "(partial)"} — ${order.reference}`,
    `<p>${formatMoney(charge.amount_refunded)} refunded on <strong>${order.reference}</strong>
     (${order.email}).</p>`
  );
}

async function handleDispute(dispute: Stripe.Dispute) {
  const chargeId = idOf(dispute.charge);
  if (!chargeId) return;

  const charge = await getStripe().charges.retrieve(chargeId);
  const order = await orderForCharge(charge);
  if (!order) return;

  await prisma.order.update({
    where: { id: order.id },
    data: { status: "DISPUTED", disputedAt: new Date() },
  });

  // Disputes have a hard deadline, so this one is deliberately loud.
  await notifyAdmin(
    `⚠ DISPUTE — ${order.reference} (${formatMoney(dispute.amount)})`,
    `<p><strong>${order.name ?? order.email}</strong> (${order.email}) disputed
     ${formatMoney(dispute.amount)} on <strong>${order.reference}</strong>.</p>
     <p>Reason: ${dispute.reason}. Status: ${dispute.status}.</p>
     <p>Respond with evidence before the deadline in the Stripe Dashboard or the money is lost.</p>`
  );
}

async function handleFraudWarning(warning: Stripe.Radar.EarlyFraudWarning) {
  const chargeId = idOf(warning.charge);
  if (!chargeId) return;

  const charge = await getStripe().charges.retrieve(chargeId);
  const order = await orderForCharge(charge);
  if (!order) return;

  await prisma.order.update({
    where: { id: order.id },
    data: { fraudWarningAt: new Date() },
  });

  await notifyAdmin(
    `⚠ Fraud warning — ${order.reference}`,
    `<p>Stripe Radar flagged the charge on <strong>${order.reference}</strong>
     (${order.email}) as likely fraudulent${warning.fraud_type ? `: ${warning.fraud_type}` : ""}.</p>
     <p>Refunding now usually avoids a dispute. Don't start the work yet.</p>`
  );
}

/* ------------------------------------------------------------------ *
 * Shared side effects
 * ------------------------------------------------------------------ */

/** Attaches the order to the client's portal account when the email matches. */
async function linkToUser(order: Order) {
  if (order.userId) return;
  const user = await prisma.user.findUnique({ where: { email: order.email } });
  if (!user) return;

  await prisma.order.update({ where: { id: order.id }, data: { userId: user.id } });
  if (!user.stripeCustomerId && order.stripeCustomerId) {
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: order.stripeCustomerId },
    });
  }
}

async function notifyPaid(order: Order) {
  const items = (order.items as unknown as OrderItem[]) ?? [];
  await notifyAdmin(
    `Payment received — ${order.reference} (${formatMoney(order.dueTodayCents)})`,
    `<h2>${order.reference}</h2>
     <p><strong>${order.name ?? "Client"}</strong> &lt;${order.email}&gt;${
       order.company ? ` · ${order.company}` : ""
     }${order.phone ? ` · ${order.phone}` : ""}</p>
     <ul>${items.map((i) => `<li>${i.name}</li>`).join("")}</ul>
     <p>Paid today: <strong>${formatMoney(order.dueTodayCents)}</strong>${
       order.paymentChoice === "deposit"
         ? ` (deposit — ${formatMoney(order.balanceCents)} due on delivery)`
         : " (in full)"
     }</p>
     ${order.monthlyCents ? `<p>Monthly: <strong>${formatMoney(order.monthlyCents)}</strong></p>` : ""}
     ${order.notes ? `<p><em>${order.notes}</em></p>` : ""}`
  );
}
