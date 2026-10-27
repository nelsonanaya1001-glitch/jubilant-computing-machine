/**
 * Stripe webhook — the only place an order is marked paid.
 *
 * The success page can't be trusted for this (anyone can open that URL), so
 * payment state comes from signature-verified Stripe events only.
 *
 * Setup: in the Stripe dashboard add an endpoint for
 *   https://launchboarding.com/api/webhooks/stripe
 * listening to checkout.session.completed, checkout.session.expired and
 * checkout.session.async_payment_failed, then put its signing secret in
 * STRIPE_WEBHOOK_SECRET.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe, stripeEnabled } from "@/lib/stripe";
import { formatMoney } from "@/lib/catalog";
import { notifyAdmin } from "@/lib/notify";
import type Stripe from "stripe";

// Signature verification needs the raw body, so this route must stay on Node.
export const runtime = "nodejs";

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
      case "checkout.session.completed":
        await handleCompleted(event.data.object);
        break;
      case "checkout.session.expired":
        await markStatus(event.data.object, "CANCELLED");
        break;
      case "checkout.session.async_payment_failed":
        await markStatus(event.data.object, "FAILED");
        break;
      default:
        // Anything else is acknowledged and ignored.
        break;
    }
  } catch (err) {
    // A 500 makes Stripe retry, which is what we want for a transient DB blip.
    console.error(`[stripe-webhook] failed handling ${event.type}`, err);
    return NextResponse.json({ error: "Handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

function orderIdOf(session: Stripe.Checkout.Session): string | null {
  return session.metadata?.orderId || session.client_reference_id || null;
}

async function handleCompleted(session: Stripe.Checkout.Session) {
  const orderId = orderIdOf(session);
  if (!orderId) {
    console.error("[stripe-webhook] completed session carried no order id", session.id);
    return;
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    console.error("[stripe-webhook] no such order", orderId);
    return;
  }
  // Stripe retries and can deliver the same event twice.
  if (order.status === "PAID") return;

  // A subscription checkout can complete before the first invoice settles.
  const paid = session.payment_status === "paid" || session.payment_status === "no_payment_required";

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: paid ? "PAID" : "PENDING",
      paidAt: paid ? new Date() : null,
      stripeSessionId: session.id,
      stripeCustomerId: idOf(session.customer),
      stripePaymentIntentId: idOf(session.payment_intent),
      stripeSubscriptionId: idOf(session.subscription),
    },
  });

  if (!paid) return;

  // Link the order to the client's portal account when the email matches one.
  if (!updated.userId) {
    const user = await prisma.user.findUnique({ where: { email: updated.email } });
    if (user) {
      await prisma.order.update({ where: { id: updated.id }, data: { userId: user.id } });
    }
  }

  const items = (updated.items as unknown as OrderItem[]) ?? [];
  await notifyAdmin(
    `Payment received — ${updated.reference} (${formatMoney(updated.dueTodayCents)})`,
    `<h2>${updated.reference}</h2>
     <p><strong>${updated.name ?? "Client"}</strong> &lt;${updated.email}&gt;${
       updated.company ? ` · ${updated.company}` : ""
     }${updated.phone ? ` · ${updated.phone}` : ""}</p>
     <ul>${items.map((i) => `<li>${i.name}</li>`).join("")}</ul>
     <p>Paid today: <strong>${formatMoney(updated.dueTodayCents)}</strong>${
       updated.paymentChoice === "deposit"
         ? ` (deposit — ${formatMoney(updated.balanceCents)} due on delivery)`
         : " (in full)"
     }</p>
     ${updated.monthlyCents ? `<p>Monthly: <strong>${formatMoney(updated.monthlyCents)}</strong></p>` : ""}
     ${updated.notes ? `<p><em>${updated.notes}</em></p>` : ""}`
  );
}

async function markStatus(session: Stripe.Checkout.Session, status: "CANCELLED" | "FAILED") {
  const orderId = orderIdOf(session);
  if (!orderId) return;
  // Never walk back an order that already paid.
  await prisma.order.updateMany({
    where: { id: orderId, status: "PENDING" },
    data: { status },
  });
}
