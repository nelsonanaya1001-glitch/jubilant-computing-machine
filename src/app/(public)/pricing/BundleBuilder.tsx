"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Globe, Palette, Megaphone } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import {
  PRODUCTS,
  formatMoney,
  type Product,
  type ProductCategory,
} from "@/lib/catalog";

// Prices and bundle discounts come from the catalogue, so this builder can
// never quote a number the checkout wouldn't actually charge.
const WEBSITES = PRODUCTS.filter((p) => p.category === "website");
const BRANDS = PRODUCTS.filter((p) => p.category === "branding");
const ADS = PRODUCTS.filter((p) => p.category === "ads");

function Column({
  title,
  icon: Icon,
  accent,
  options,
  selected,
  onSelect,
  onClear,
}: {
  title: string;
  icon: typeof Globe;
  accent: string;
  options: Product[];
  selected: Product | null;
  onSelect: (sku: string) => void;
  onClear: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <Icon className={`w-4 h-4 ${accent}`} />
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="space-y-2.5">
        {options.map((o) => {
          const active = selected?.sku === o.sku;
          return (
            <button
              key={o.sku}
              type="button"
              onClick={() => (active ? onClear() : onSelect(o.sku))}
              className={`w-full text-left rounded-xl border px-4 py-3.5 transition ${
                active
                  ? "border-violet-500/60 bg-violet-500/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/25"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white">{o.name}</div>
                  <div className="text-xs text-white/35 mt-0.5">{o.note}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-white">{formatMoney(o.setupCents)}</div>
                  {o.monthlyCents > 0 && (
                    <div className="text-[11px] text-white/40">
                      +{formatMoney(o.monthlyCents)}/mo
                    </div>
                  )}
                </div>
              </div>
              {active && (
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-violet-300">
                  <Check className="w-3 h-3" /> Added
                </div>
              )}
            </button>
          );
        })}
        <button
          type="button"
          onClick={onClear}
          className={`w-full text-left rounded-xl border border-dashed px-4 py-2.5 text-xs transition ${
            selected === null
              ? "border-white/25 text-white/50"
              : "border-white/10 text-white/30 hover:text-white/50 hover:border-white/20"
          }`}
        >
          Not needed
        </button>
      </div>
    </div>
  );
}

export function BundleBuilder() {
  const router = useRouter();
  const { items, inCategory, add, remove, quote: q, ready } = useCart();

  // The builder edits the real cart, so a bundle picked here carries straight
  // through to checkout instead of being re-chosen on the cart page.
  const clearCategory = (category: ProductCategory) => {
    const current = inCategory(category);
    if (current) remove(current.sku);
  };

  const website = inCategory("website");
  const brand = inCategory("branding");
  const ads = inCategory("ads");
  const picked = items.filter((i) => i.category !== "care");

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 md:p-9">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mb-8">
        <Column
          title="1 · Website"
          icon={Globe}
          accent="text-violet-400"
          options={WEBSITES}
          selected={website}
          onSelect={add}
          onClear={() => clearCategory("website")}
        />
        <Column
          title="2 · Branding"
          icon={Palette}
          accent="text-amber-400"
          options={BRANDS}
          selected={brand}
          onSelect={add}
          onClear={() => clearCategory("branding")}
        />
        <Column
          title="3 · Advertising"
          icon={Megaphone}
          accent="text-emerald-400"
          options={ADS}
          selected={ads}
          onSelect={add}
          onClear={() => clearCategory("ads")}
        />
      </div>

      {/* Summary */}
      <div className="border-t border-white/10 pt-7">
        {!ready || picked.length === 0 ? (
          <p className="text-center text-sm text-white/35 py-4">
            Pick at least one option above to see your total.
          </p>
        ) : (
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-7">
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                Your bundle
              </div>
              <ul className="space-y-1.5 mb-4">
                {picked.map((o) => (
                  <li key={o.sku} className="flex items-center justify-between text-sm max-w-md">
                    <span className="text-white/60">{o.name}</span>
                    <span className="text-white/80 font-medium">
                      {formatMoney(o.setupCents)}
                      {o.monthlyCents > 0 ? ` + ${formatMoney(o.monthlyCents)}/mo` : ""}
                    </span>
                  </li>
                ))}
                {q.discountCents > 0 && (
                  <li className="flex items-center justify-between text-sm max-w-md pt-1.5 border-t border-white/5">
                    <span className="text-emerald-400">Bundle discount</span>
                    <span className="text-emerald-400 font-medium">
                      −{formatMoney(q.discountCents)}
                    </span>
                  </li>
                )}
              </ul>
              {q.discountCents === 0 && picked.length > 1 && !website && (
                <p className="text-xs text-white/30 max-w-md">
                  Bundle discounts apply when you include a website — that&apos;s what branding and
                  ads amplify.
                </p>
              )}
              {ads && (
                <p className="text-xs text-white/30 max-w-md">
                  Ad spend is paid directly to Meta and is not included above.
                </p>
              )}
            </div>

            <div className="lg:text-right flex-shrink-0">
              {q.discountCents > 0 && (
                <div className="text-sm text-white/30 line-through mb-0.5">
                  {formatMoney(q.subtotalCents)}
                </div>
              )}
              <div className="flex items-baseline gap-1 lg:justify-end">
                <span className="text-xl font-medium text-white/40">$</span>
                <span className="text-5xl font-black text-white">
                  {(q.oneTimeCents / 100).toLocaleString("en-US")}
                </span>
                <span className="text-white/30 text-sm ml-1">one-time</span>
              </div>
              {q.monthlyCents > 0 && (
                <div className="text-sm text-white/50 mt-1">
                  plus{" "}
                  <span className="font-bold text-white">{formatMoney(q.monthlyCents)}</span>/month
                </div>
              )}
              {q.discountCents > 0 && (
                <div className="inline-block mt-3 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                  You save {formatMoney(q.discountCents)}
                </div>
              )}
              <div className="mt-5">
                <Button
                  size="lg"
                  onClick={() => router.push("/cart")}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 w-full lg:w-auto"
                >
                  Check out this bundle <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
