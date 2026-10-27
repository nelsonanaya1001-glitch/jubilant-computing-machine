/**
 * Starts a purchase: either a Stripe Checkout Session (pay by card now) or a
 * Stripe Invoice emailed to the client (pay on terms).
 *
 * The request body carries SKUs and contact details only. Every amount is
 * recomputed here from src/lib/catalog.ts, so prices can't be altered by
 * editing the cart in the browser.
 *
 * Note on payment methods: we never pass `payment_method_types`. Leaving it
 * out enables Stripe's dynamic payment methods, so whatever is switched on in
 * the Dashboard (cards, Link, Cash App, Klarna…) shows up without a code
 * change, ranked for conversion.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  INTEGRATION_IDENTIFIER,
  findOrCreateCustomer,
  getStripe,
  siteUrl,
  stripeEnabled,
} from "@/lib/stripe";
import { formatMoney, quote, resolveSkus, type PaymentChoice, type Quote } from "@/lib/catalog";
import { notifyAdmin } from "@/lib/notify";
import type Stripe from "stripe";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** How many days a client gets to pay an emailed invoice. */
const INVOICE_DUE_DAYS = 7;

function reference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `LB-${out}`;
}

const trim = (v: unknown, max: number): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const items = resolveSkus(body.skus);
  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const email = trim(body.email, 200).toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const name = trim(body.name, 120);
  if (!name) {
    return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  }

  const payment: PaymentChoice = body.payment === "deposit" ? "deposit" : "full";
  const q = quote(items, payment);

  if (q.dueTodayCents === 0 && q.monthlyCents === 0) {
    return NextResponse.json({ error: "Nothing to charge." }, { status: 400 });
  }

  // A recurring service has to be a subscription, which can't be collected on a
  // one-off emailed invoice, so card checkout is the only route for those.
  const wantsInvoice = body.method === "invoice" && !q.hasRecurring;

  const company = trim(body.company, 160) || null;
  const phone = trim(body.phone, 40) || null;

  const order = await prisma.order.create({
    data: {
      reference: reference(),
      email,
      name,
      company,
      phone,
      notes: trim(body.notes, 2000) || null,
      items: items.map((i) => ({
        sku: i.sku,
        name: i.name,
        setupCents: i.setupCents,
        monthlyCents: i.monthlyCents,
      })),
      paymentChoice: payment,
      subtotalCents: q.subtotalCents,
      discountCents: q.discountCents,
      dueTodayCents: q.dueTodayCents,
      balanceCents: q.balanceCents,
      monthlyCents: q.monthlyCents,
    },
  });

  // With Stripe not configured the order is still recorded, so nothing an
  // interested client fills in is lost — we just invoice them by hand.
  if (!stripeEnabled()) {
    await notifyAdmin(
      `Order ${order.reference} — payment not configured`,
      `<p><strong>${name}</strong> (${email}) wants to order but Stripe isn't set up yet.</p>
       <p>${items.map((i) => i.name).join(", ")}<br/>
       Due today: ${formatMoney(q.dueTodayCents)}${q.monthlyCents ? ` + ${formatMoney(q.monthlyCents)}/mo` : ""}</p>`
    );
    return NextResponse.json({
      manual: true,
      reference: order.reference,
      message:
        "Your order is saved. We'll email you an invoice shortly — online card payment is being switched on.",
    });
  }

  try {
    const customerId = await findOrCreateCustomer({ email, name, phone, company });

    if (wantsInvoice) {
      const url = await createInvoice({ order, q, customerId, items });
      return NextResponse.json({ invoice: true, url, reference: order.reference });
    }

    const url = await createCheckoutSession({ order, q, customerId, items, payment });
    return NextResponse.json({ url, reference: order.reference });
  } catch (err) {
    console.error("[checkout] Stripe call failed", err);
    await prisma.order.update({ where: { id: order.id }, data: { status: "FAILED" } });
    return NextResponse.json(
      { error: "We couldn't start the payment. Please try again or contact us." },
      { status: 502 }
    );
  }
}

type CatalogItem = { sku: string; name: string; note: string; setupCents: number; monthlyCents: number };

/** Hosted Checkout — one-off, subscription, or a subscription plus setup fee. */
async function createCheckoutSession({
  order,
  q,
  customerId,
  items,
  payment,
}: {
  order: { id: string; reference: string };
  q: Quote;
  customerId: string;
  items: CatalogItem[];
  payment: PaymentChoice;
}): Promise<string> {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  if (q.dueTodayCents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: q.dueTodayCents,
        product_data: {
          name:
            payment === "deposit"
              ? `${items.map((i) => i.name).join(" + ")} — 50% deposit`
              : items.map((i) => i.name).join(" + "),
          description:
            payment === "deposit"
              ? `Deposit against ${formatMoney(q.oneTimeCents)}. Balance of ${formatMoney(q.balanceCents)} due on delivery.`
              : "Project fee, paid in full.",
        },
      },
    });
  }

  // Each recurring service gets its own line so the Dashboard and the client's
  // invoice name it, rather than lumping them into one "monthly" charge.
  for (const item of items) {
    if (item.monthlyCents <= 0) continue;
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: item.monthlyCents,
        recurring: { interval: "month" },
        product_data: { name: `${item.name} — monthly`, description: item.note },
      },
    });
  }

  const base = siteUrl();
  const metadata = { orderId: order.id, reference: order.reference };

  const session = await getStripe().checkout.sessions.create({
    mode: q.hasRecurring ? "subscription" : "payment",
    line_items: lineItems,
    customer: customerId,
    client_reference_id: order.id,
    integration_identifier: INTEGRATION_IDENTIFIER,
    metadata,
    allow_promotion_codes: true,
    success_url: `${base}/checkout/success?ref=${order.reference}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/checkout/cancelled?ref=${order.reference}`,
    // Carried onto the subscription/payment too, so risk events that arrive
    // without a session still resolve back to this order.
    ...(q.hasRecurring
      ? { subscription_data: { metadata } }
      : { payment_intent_data: { metadata } }),
  });

  if (!session.url) throw new Error("Stripe returned no checkout URL");

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id, stripeCustomerId: customerId },
  });

  return session.url;
}

/**
 * A real Stripe Invoice, emailed to the client with a hosted pay page.
 * Used when someone would rather be invoiced than pay by card on the spot.
 */
async function createInvoice({
  order,
  q,
  customerId,
  items,
}: {
  order: { id: string; reference: string };
  q: Quote;
  customerId: string;
  items: CatalogItem[];
}): Promise<string | null> {
  const stripe = getStripe();
  const metadata = { orderId: order.id, reference: order.reference };

  const invoice = await stripe.invoices.create({
    customer: customerId,
    collection_method: "send_invoice",
    days_until_due: INVOICE_DUE_DAYS,
    auto_advance: false,
    description:
      order.reference +
      (q.balanceCents > 0
        ? ` — 50% deposit. Balance of ${formatMoney(q.balanceCents)} due on delivery.`
        : ""),
    metadata,
  });

  // Invoice items must exist before the invoice is finalised.
  await stripe.invoiceItems.create({
    customer: customerId,
    invoice: invoice.id,
    currency: "usd",
    amount: q.dueTodayCents,
    description:
      q.balanceCents > 0
        ? `${items.map((i) => i.name).join(" + ")} — 50% deposit`
        : items.map((i) => i.name).join(" + "),
    metadata,
  });

  if (!invoice.id) throw new Error("Stripe returned no invoice id");

  const finalised = await stripe.invoices.finalizeInvoice(invoice.id);
  await stripe.invoices.sendInvoice(invoice.id);

  await prisma.order.update({
    where: { id: order.id },
    data: {
      status: "INVOICED",
      stripeInvoiceId: invoice.id,
      stripeCustomerId: customerId,
    },
  });

  return finalised.hosted_invoice_url ?? null;
}
