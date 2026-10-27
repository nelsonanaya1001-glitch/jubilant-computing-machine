/**
 * Creates a Stripe Checkout Session for whatever is in the client's cart.
 *
 * The request body carries SKUs and contact details only. Every amount is
 * recomputed here from src/lib/catalog.ts, so prices can't be altered by
 * editing the cart in the browser.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe, siteUrl, stripeEnabled } from "@/lib/stripe";
import { formatMoney, quote, resolveSkus, type PaymentChoice } from "@/lib/catalog";
import { notifyAdmin } from "@/lib/notify";
import type Stripe from "stripe";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

  const order = await prisma.order.create({
    data: {
      reference: reference(),
      email,
      name,
      company: trim(body.company, 160) || null,
      phone: trim(body.phone, 40) || null,
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

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  if (q.dueTodayCents > 0) {
    const oneTimeLabel =
      payment === "deposit"
        ? `${items.map((i) => i.name).join(" + ")} — 50% deposit`
        : items.map((i) => i.name).join(" + ");
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: q.dueTodayCents,
        product_data: {
          name: oneTimeLabel,
          description:
            payment === "deposit"
              ? `Deposit against ${formatMoney(q.oneTimeCents)}. Balance of ${formatMoney(q.balanceCents)} due on delivery.`
              : "Project fee, paid in full.",
        },
      },
    });
  }

  for (const item of items) {
    if (item.monthlyCents <= 0) continue;
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: item.monthlyCents,
        recurring: { interval: "month" },
        product_data: {
          name: `${item.name} — monthly`,
          description: item.note,
        },
      },
    });
  }

  const base = siteUrl();

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: q.hasRecurring ? "subscription" : "payment",
      line_items: lineItems,
      customer_email: email,
      client_reference_id: order.id,
      // The webhook is the source of truth, so everything it needs to reconcile
      // the payment lives on the session itself.
      metadata: { orderId: order.id, reference: order.reference },
      allow_promotion_codes: true,
      success_url: `${base}/checkout/success?ref=${order.reference}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout/cancelled?ref=${order.reference}`,
      ...(q.hasRecurring
        ? { subscription_data: { metadata: { orderId: order.id, reference: order.reference } } }
        : { payment_intent_data: { metadata: { orderId: order.id, reference: order.reference } } }),
    });

    if (!session.url) throw new Error("Stripe returned no checkout URL");

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url, reference: order.reference });
  } catch (err) {
    console.error("[checkout] Stripe session failed", err);
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    return NextResponse.json(
      { error: "We couldn't start the payment. Please try again or contact us." },
      { status: 502 }
    );
  }
}
