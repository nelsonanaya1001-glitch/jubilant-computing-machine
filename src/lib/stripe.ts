/**
 * Stripe client.
 *
 * Deliberately lazy: the whole payment feature is optional, so the app builds
 * and runs with no Stripe keys configured at all. Pages check `stripeEnabled()`
 * and show a "contact us to pay" fallback instead of a broken checkout button.
 *
 * Required env vars once you're ready to take payments:
 *   STRIPE_SECRET_KEY      — sk_live_… (or sk_test_… while testing)
 *   STRIPE_WEBHOOK_SECRET  — whsec_… from the webhook endpoint you create
 *   NEXT_PUBLIC_SITE_URL   — e.g. https://launchboarding.com (for return URLs)
 */

import Stripe from "stripe";

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
