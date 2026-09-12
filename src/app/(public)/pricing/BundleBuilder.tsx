"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Globe, Palette, Megaphone } from "lucide-react";

type Option = {
  id: string;
  name: string;
  /** One-time cost in dollars. */
  once: number;
  /** Recurring monthly cost in dollars, if any. */
  monthly?: number;
  note?: string;
};

const WEBSITES: Option[] = [
  { id: "business", name: "Business Website", once: 399, note: "Up to 6 pages" },
  { id: "landing", name: "Landing Page", once: 399, note: "Single conversion page" },
  { id: "booking", name: "Booking Website", once: 459, note: "Scheduling + database" },
  { id: "store", name: "Online Store", once: 549, note: "Storefront + Shopify" },
];

const BRANDS: Option[] = [
  { id: "brand-standard", name: "Brand Standard", once: 149, note: "Logo, palette, fonts, guide" },
  { id: "brand-pro", name: "Brand Pro", once: 249, note: "+ PDF guide, favicon, revisions" },
];

const ADS: Option[] = [
  { id: "ads-starter", name: "Ads Starter", once: 349, monthly: 299, note: "1 campaign, monthly reports" },
  { id: "ads-growth", name: "Ads Growth", once: 499, monthly: 549, note: "Full funnel, weekly reports" },
];

/**
 * Bundle savings. Discounts only ever apply against a website, because the
 * website is what the other two services amplify — we don't discount branding
 * or ads bought on their own.
 */
function savingsFor(website: Option | null, brand: Option | null, ads: Option | null): number {
  if (!website) return 0;
  let saved = 0;
  if (brand) saved += 50;
  if (ads) saved += 100;
  if (brand && ads) saved += 50; // all three
  return saved;
}

function Column({
  title,
  icon: Icon,
  accent,
  options,
  selected,
  onSelect,
}: {
  title: string;
  icon: typeof Globe;
  accent: string;
  options: Option[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4">
        <Icon className={`w-4 h-4 ${accent}`} />
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="space-y-2.5">
        {options.map((o) => {
          const active = selected === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onSelect(active ? null : o.id)}
              className={`w-full text-left rounded-xl border px-4 py-3.5 transition ${
                active
                  ? "border-violet-500/60 bg-violet-500/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/25"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white">{o.name}</div>
                  {o.note && <div className="text-xs text-white/35 mt-0.5">{o.note}</div>}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-white">${o.once}</div>
                  {o.monthly && <div className="text-[11px] text-white/40">+${o.monthly}/mo</div>}
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
          onClick={() => onSelect(null)}
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
  const [website, setWebsite] = useState<string | null>("business");
  const [brand, setBrand] = useState<string | null>("brand-standard");
  const [ads, setAds] = useState<string | null>(null);

  const picked = useMemo(() => {
    const w = WEBSITES.find((o) => o.id === website) ?? null;
    const b = BRANDS.find((o) => o.id === brand) ?? null;
    const a = ADS.find((o) => o.id === ads) ?? null;
    const items = [w, b, a].filter(Boolean) as Option[];

    const onceBefore = items.reduce((sum, o) => sum + o.once, 0);
    const monthly = items.reduce((sum, o) => sum + (o.monthly ?? 0), 0);
    const saved = savingsFor(w, b, a);

    return { w, b, a, items, onceBefore, once: Math.max(0, onceBefore - saved), monthly, saved };
  }, [website, brand, ads]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 md:p-9">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mb-8">
        <Column title="1 · Website" icon={Globe} accent="text-violet-400" options={WEBSITES} selected={website} onSelect={setWebsite} />
        <Column title="2 · Branding" icon={Palette} accent="text-amber-400" options={BRANDS} selected={brand} onSelect={setBrand} />
        <Column title="3 · Advertising" icon={Megaphone} accent="text-emerald-400" options={ADS} selected={ads} onSelect={setAds} />
      </div>

      {/* Summary */}
      <div className="border-t border-white/10 pt-7">
        {picked.items.length === 0 ? (
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
                {picked.items.map((o) => (
                  <li key={o.id} className="flex items-center justify-between text-sm max-w-md">
                    <span className="text-white/60">{o.name}</span>
                    <span className="text-white/80 font-medium">
                      ${o.once}
                      {o.monthly ? ` + $${o.monthly}/mo` : ""}
                    </span>
                  </li>
                ))}
                {picked.saved > 0 && (
                  <li className="flex items-center justify-between text-sm max-w-md pt-1.5 border-t border-white/5">
                    <span className="text-emerald-400">Bundle discount</span>
                    <span className="text-emerald-400 font-medium">−${picked.saved}</span>
                  </li>
                )}
              </ul>
              {picked.saved === 0 && picked.items.length > 1 && !picked.w && (
                <p className="text-xs text-white/30 max-w-md">
                  Bundle discounts apply when you include a website — that&apos;s what branding and
                  ads amplify.
                </p>
              )}
              {picked.a && (
                <p className="text-xs text-white/30 max-w-md">
                  Ad spend is paid directly to Meta and is not included above.
                </p>
              )}
            </div>

            <div className="lg:text-right flex-shrink-0">
              {picked.saved > 0 && (
                <div className="text-sm text-white/30 line-through mb-0.5">${picked.onceBefore}</div>
              )}
              <div className="flex items-baseline gap-1 lg:justify-end">
                <span className="text-xl font-medium text-white/40">$</span>
                <span className="text-5xl font-black text-white">{picked.once}</span>
                <span className="text-white/30 text-sm ml-1">one-time</span>
              </div>
              {picked.monthly > 0 && (
                <div className="text-sm text-white/50 mt-1">
                  plus <span className="font-bold text-white">${picked.monthly}</span>/month
                </div>
              )}
              {picked.saved > 0 && (
                <div className="inline-block mt-3 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                  You save ${picked.saved}
                </div>
              )}
              <div className="mt-5">
                {/* Route to the intake that matches what they picked: a website
                    order covers everything, branding alone has its own flow, and
                    ads alone starts as a conversation. */}
                <Link href={picked.w ? "/get-started" : picked.b ? "/brand/start" : "/contact"}>
                  <Button size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 w-full lg:w-auto">
                    Start this bundle <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
