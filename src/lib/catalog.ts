/**
 * The product catalogue — the single source of truth for every price we charge.
 *
 * Prices live here on the server only. The cart in the browser stores SKUs and
 * nothing else: amounts are always re-derived from this file before a Stripe
 * Checkout Session is created, so a tampered cart can't change what someone
 * pays. The pricing page and the bundle builder display these same numbers.
 */

export type ProductCategory = "website" | "branding" | "ads" | "care";

export type Product = {
  sku: string;
  name: string;
  category: ProductCategory;
  /** One-time project fee, in cents. */
  setupCents: number;
  /** Recurring monthly fee, in cents. 0 means no subscription. */
  monthlyCents: number;
  /** Short line shown under the name in the cart. */
  note: string;
  /** What the client actually gets — shown on the cart page. */
  includes: string[];
};

export const PRODUCTS: Product[] = [
  {
    sku: "website-business",
    name: "Business Website",
    category: "website",
    setupCents: 39900,
    monthlyCents: 0,
    note: "Up to 6 pages",
    includes: [
      "Up to 6 custom pages",
      "Mobile-first responsive build",
      "Contact forms and basic SEO",
      "Launch on your own domain",
    ],
  },
  {
    sku: "website-landing",
    name: "Landing Page",
    category: "website",
    setupCents: 39900,
    monthlyCents: 0,
    note: "Single conversion page",
    includes: [
      "One high-converting page",
      "Built for an ad or email campaign",
      "Lead capture wired to your inbox",
      "Launch on your own domain",
    ],
  },
  {
    sku: "website-booking",
    name: "Booking Website",
    category: "website",
    setupCents: 45900,
    monthlyCents: 0,
    note: "Scheduling + database",
    includes: [
      "Everything in a business website",
      "Online scheduling and availability",
      "Customer database",
      "Email confirmations",
    ],
  },
  {
    sku: "website-store",
    name: "Online Store",
    category: "website",
    setupCents: 54900,
    monthlyCents: 0,
    note: "Storefront + Shopify",
    includes: [
      "Full storefront build",
      "Shopify or Stripe checkout",
      "Product and inventory setup",
      "Payments and shipping configured",
    ],
  },

  {
    sku: "brand-standard",
    name: "Brand Standard",
    category: "branding",
    setupCents: 14900,
    monthlyCents: 0,
    note: "Logo, palette, fonts, guide",
    includes: [
      "Logo concepts to choose from",
      "Full colour palette with usage notes",
      "Font pairing with web embed code",
      "Delivered in your client portal",
    ],
  },
  {
    sku: "brand-pro",
    name: "Brand Pro",
    category: "branding",
    setupCents: 24900,
    monthlyCents: 0,
    note: "+ PDF guide, favicon, revisions",
    includes: [
      "Everything in Brand Standard",
      "Printable PDF brand guide",
      "Favicon and social avatar set",
      "Two rounds of revisions",
    ],
  },

  {
    sku: "ads-starter",
    name: "Ads Starter",
    category: "ads",
    setupCents: 34900,
    monthlyCents: 29900,
    note: "1 campaign, monthly reports",
    includes: [
      "Pixel and conversion tracking setup",
      "One campaign built and launched",
      "Creative written and designed",
      "Monthly performance report",
    ],
  },
  {
    sku: "ads-growth",
    name: "Ads Growth",
    category: "ads",
    setupCents: 49900,
    monthlyCents: 54900,
    note: "Full funnel, weekly reports",
    includes: [
      "Full-funnel campaign structure",
      "Retargeting and lookalike audiences",
      "Ongoing creative testing",
      "Weekly performance report",
    ],
  },

  {
    sku: "care-plan",
    name: "Care Plan",
    category: "care",
    setupCents: 0,
    monthlyCents: 15000,
    note: "Updates, backups, support",
    includes: [
      "Content and product updates",
      "Backups and security patches",
      "Uptime monitoring",
      "Priority email support",
    ],
  },
];

const BY_SKU = new Map(PRODUCTS.map((p) => [p.sku, p]));

export function findProduct(sku: string): Product | null {
  return BY_SKU.get(sku) ?? null;
}

/** Discards anything that isn't a real SKU, and keeps one item per category. */
export function resolveSkus(skus: unknown): Product[] {
  if (!Array.isArray(skus)) return [];
  const seen = new Set<ProductCategory>();
  const out: Product[] = [];
  for (const raw of skus) {
    const product = typeof raw === "string" ? findProduct(raw) : null;
    if (!product || seen.has(product.category)) continue;
    seen.add(product.category);
    out.push(product);
  }
  return out;
}

/**
 * Bundle savings, in cents. Discounts only ever apply against a website,
 * because the website is what the other services amplify — we don't discount
 * branding or ads bought on their own. Mirrors the bundle builder exactly.
 */
export function bundleDiscountCents(items: Product[]): number {
  const has = (c: ProductCategory) => items.some((i) => i.category === c);
  if (!has("website")) return 0;
  let saved = 0;
  if (has("branding")) saved += 5000;
  if (has("ads")) saved += 10000;
  if (has("branding") && has("ads")) saved += 5000;
  return saved;
}

export type PaymentChoice = "deposit" | "full";

export type Quote = {
  items: Product[];
  /** One-time total before the bundle discount. */
  subtotalCents: number;
  discountCents: number;
  /** One-time total after the discount. */
  oneTimeCents: number;
  /** Charged today against the one-time total. */
  dueTodayCents: number;
  /** Left to pay on delivery. 0 when paying in full. */
  balanceCents: number;
  /** Recurring monthly total — always billed in full, never halved. */
  monthlyCents: number;
  hasRecurring: boolean;
};

/** Deposits are half the one-time total, rounded up to a whole dollar. */
function depositOf(oneTimeCents: number): number {
  return Math.ceil(oneTimeCents / 2 / 100) * 100;
}

export function quote(items: Product[], payment: PaymentChoice): Quote {
  const subtotalCents = items.reduce((sum, i) => sum + i.setupCents, 0);
  const discountCents = Math.min(subtotalCents, bundleDiscountCents(items));
  const oneTimeCents = subtotalCents - discountCents;
  const monthlyCents = items.reduce((sum, i) => sum + i.monthlyCents, 0);

  // A deposit only makes sense when there's a one-time fee to split.
  const takeDeposit = payment === "deposit" && oneTimeCents > 0;
  const dueTodayCents = takeDeposit ? depositOf(oneTimeCents) : oneTimeCents;

  return {
    items,
    subtotalCents,
    discountCents,
    oneTimeCents,
    dueTodayCents,
    balanceCents: oneTimeCents - dueTodayCents,
    monthlyCents,
    hasRecurring: monthlyCents > 0,
  };
}

export function formatMoney(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars % 1 === 0 ? dollars.toLocaleString("en-US") : dollars.toFixed(2)}`;
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  website: "Website",
  branding: "Branding",
  ads: "Meta Ads",
  care: "Care Plan",
};
