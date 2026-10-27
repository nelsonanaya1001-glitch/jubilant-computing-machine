/**
 * Stripe client and shared helpers.
 *
 * Deliberately lazy: the whole payment feature is optional, so the app builds
 * and runs with no Stripe keys configured at all. Pages check `stripeEnabled()`
 * and fall back to recording the order and invoicing by hand.
 *
 * Env vars (see DEPLOYMENT.md):
 *   STRIPE_SECRET_KEY      — prefer a restricted key (rk_live_…) over sk_live_…
 *   STRIPE_WEBHOOK_SECRET  — whsec_… from the webhook endpoint
 *   NEXT_PUBLIC_SITE_URL   — e.g. https://launchboarding.com (for return URLs)
 *
 * Never hard-code a key here, and never log one.
 */

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

let client: Stripe | null = null;

export function stripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** Throws if called without a key — callers must check `stripeEnabled()` first. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  // No apiVersion override: the SDK pins the version it was built against.
  if (!client) client = new Stripe(key);
  return client;
}

/** Absolute base URL for Stripe return URLs. */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/**
 * Labels our Checkout Sessions in the Stripe Dashboard so this flow can be
 * compared against any future one. The random suffix is fixed on purpose —
 * it has to stay stable to be useful for comparison.
 */
export const INTEGRATION_IDENTIFIER = "launchboarding-cart-ijwvehxv";

/**
 * One Stripe Customer per email address.
 *
 * Without this, every checkout would mint a new Customer, so a client with a
 * subscription and a later project would show up twice and the billing portal
 * would only ever see one of them.
 */
export async function findOrCreateCustomer(input: {
  email: string;
  name?: string | null;
  phone?: string | null;
  company?: string | null;
}): Promise<string> {
  const stripe = getStripe();
  const email = input.email.toLowerCase();

  // Our own record first — cheapest, and authoritative once set.
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, stripeCustomerId: true },
  });
  if (user?.stripeCustomerId) return user.stripeCustomerId;

  // Then any Customer Stripe already holds for this email.
  const existing = await stripe.customers.list({ email, limit: 1 });
  const found = existing.data[0];

  const customerId =
    found?.id ??
    (
      await stripe.customers.create({
        email,
        name: input.name ?? undefined,
        phone: input.phone ?? undefined,
        metadata: input.company ? { company: input.company } : undefined,
      })
    ).id;

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  return customerId;
}
