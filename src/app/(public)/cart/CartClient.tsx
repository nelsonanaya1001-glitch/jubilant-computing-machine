"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Check,
  FileText,
  Lock,
  Loader2,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import {
  CATEGORY_LABELS,
  PRODUCTS,
  formatMoney,
  type ProductCategory,
} from "@/lib/catalog";

/** Categories the cart offers to fill in, in the order they're suggested. */
const SUGGEST_ORDER: ProductCategory[] = ["website", "branding", "ads", "care"];

const SUGGEST_COPY: Record<ProductCategory, string> = {
  website: "Start with the site itself — everything else works better with one.",
  branding: "Logo, palette and fonts so the site looks like a real company.",
  ads: "Put the site in front of people who are already searching.",
  care: "We keep it updated, backed up and monitored after launch.",
};

export function CartClient({ paymentsLive }: { paymentsLive: boolean }) {
  const { items, skus, remove, add, payment, setPayment, quote: q, ready, clear } = useCart();

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState<null | "card" | "invoice">(null);
  const [error, setError] = useState<string | null>(null);
  const [manual, setManual] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const missing = SUGGEST_ORDER.filter((c) => !items.some((i) => i.category === c));

  async function checkout(method: "card" | "invoice") {
    setError(null);
    setManual(null);
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      return setError("Please enter a valid email address.");

    setSubmitting(method);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skus, payment, method, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      if (data.manual) {
        // Stripe isn't switched on yet — the order is recorded and we invoice.
        setManual(data.message);
        clear();
        return;
      }
      if (data.invoice && !data.url) {
        // Invoice sent, but Stripe gave us no hosted page to send them to.
        setManual(
          `Invoice ${data.reference} is on its way to ${form.email.trim()}. It's payable online and due in 7 days.`
        );
        clear();
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("We couldn't reach the payment service. Please check your connection.");
    } finally {
      setSubmitting(null);
    }
  }

  if (manual) {
    return (
      <section className="max-w-2xl mx-auto px-6 lg:px-8 py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <Check className="w-7 h-7 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-black mb-4">Order received.</h2>
        <p className="text-white/50 leading-relaxed mb-8">{manual}</p>
        <Link href="/">
          <Button className="bg-violet-600 hover:bg-violet-500 border-0">Back to home</Button>
        </Link>
      </section>
    );
  }

  if (!ready) {
    return (
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-24 flex justify-center">
        <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="max-w-2xl mx-auto px-6 lg:px-8 py-24 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-6 h-6 text-white/30" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Your cart is empty.</h2>
        <p className="text-white/40 mb-8">
          Pick a website, branding package or ads plan and it&apos;ll show up here.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/pricing">
            <Button className="bg-violet-600 hover:bg-violet-500 border-0">
              Browse packages <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outlineDark">
              Talk to us first
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
      {/* Left: what's being bought + who's buying */}
      <div className="space-y-8">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] divide-y divide-white/5">
          {items.map((item) => (
            <div key={item.sku} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-violet-400/80 mb-1.5">
                    {CATEGORY_LABELS[item.category]}
                  </div>
                  <h3 className="font-bold text-white">{item.name}</h3>
                  <p className="text-xs text-white/35 mt-0.5">{item.note}</p>
                  <ul className="mt-3 space-y-1.5">
                    {item.includes.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-white/55">
                        <Check className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-right flex-shrink-0">
                  {item.setupCents > 0 && (
                    <div className="font-bold text-white">{formatMoney(item.setupCents)}</div>
                  )}
                  {item.monthlyCents > 0 && (
                    <div className="text-xs text-white/45 mt-0.5">
                      {formatMoney(item.monthlyCents)}/mo
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(item.sku)}
                    className="mt-3 inline-flex items-center gap-1 text-[11px] text-white/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upsells — one suggestion per empty category, discount shown where it applies */}
        {missing.length > 0 && (
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
              Add to this order
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {missing.map((category) => {
                const options = PRODUCTS.filter((p) => p.category === category);
                return (
                  <div
                    key={category}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
                  >
                    <div className="text-sm font-bold text-white mb-1">
                      {CATEGORY_LABELS[category]}
                    </div>
                    <p className="text-xs text-white/35 leading-relaxed mb-4">
                      {SUGGEST_COPY[category]}
                    </p>
                    <div className="space-y-2">
                      {options.map((o) => (
                        <button
                          key={o.sku}
                          type="button"
                          onClick={() => add(o.sku)}
                          className="w-full flex items-center justify-between gap-3 rounded-lg border border-white/10 px-3 py-2.5 text-left hover:border-violet-500/50 hover:bg-violet-500/5 transition"
                        >
                          <span className="text-xs font-medium text-white/80 min-w-0 truncate">
                            {o.name}
                          </span>
                          <span className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-white/45">
                              {o.setupCents > 0 ? formatMoney(o.setupCents) : `${formatMoney(o.monthlyCents)}/mo`}
                            </span>
                            <Plus className="w-3.5 h-3.5 text-violet-400" />
                          </span>
                        </button>
                      ))}
                    </div>
                    {category !== "website" && category !== "care" && !items.some((i) => i.category === "website") && (
                      <p className="text-[11px] text-white/25 mt-3">
                        Bundle discounts need a website in the order.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Who we're invoicing */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7">
          <h3 className="font-bold text-white mb-1">Your details</h3>
          <p className="text-xs text-white/35 mb-6">
            So we know who the project belongs to and where to send the receipt.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input tone="dark" id="cart-name" label="Full name *" value={form.name} onChange={set("name")} placeholder="Jane Doe" autoComplete="name" />
            <Input tone="dark" id="cart-email" label="Email *" type="email" value={form.email} onChange={set("email")} placeholder="jane@company.com" autoComplete="email" />
            <Input tone="dark" id="cart-company" label="Business name" value={form.company} onChange={set("company")} placeholder="Doe Logistics" autoComplete="organization" />
            <Input tone="dark" id="cart-phone" label="Phone" value={form.phone} onChange={set("phone")} placeholder="(786) 501-5600" autoComplete="tel" />
            <div className="sm:col-span-2">
              <Textarea tone="dark" id="cart-notes" label="Anything we should know?" value={form.notes} onChange={set("notes")} placeholder="Deadlines, a site you like, what the business does…" />
            </div>
          </div>
        </div>
      </div>

      {/* Right: the money */}
      <div className="lg:sticky lg:top-24 space-y-5">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
            Order summary
          </div>

          <ul className="space-y-2 mb-4">
            {items.map((i) => (
              <li key={i.sku} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-white/55 min-w-0">{i.name}</span>
                <span className="text-white/80 font-medium flex-shrink-0">
                  {i.setupCents > 0 ? formatMoney(i.setupCents) : `${formatMoney(i.monthlyCents)}/mo`}
                </span>
              </li>
            ))}
            {q.discountCents > 0 && (
              <li className="flex items-center justify-between text-sm pt-2 border-t border-white/5">
                <span className="text-emerald-400">Bundle discount</span>
                <span className="text-emerald-400 font-medium">
                  −{formatMoney(q.discountCents)}
                </span>
              </li>
            )}
          </ul>

          {/* Deposit or in full */}
          {q.oneTimeCents > 0 && (
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2.5">
                How you&apos;d like to pay
              </div>
              <div className="space-y-2">
                {(
                  [
                    {
                      key: "deposit" as const,
                      title: "50% deposit now",
                      sub: "Balance due when we hand the project over.",
                    },
                    {
                      key: "full" as const,
                      title: "Pay in full",
                      sub: "One payment, nothing left to settle later.",
                    },
                  ]
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setPayment(opt.key)}
                    className={`w-full text-left rounded-xl border px-4 py-3 transition ${
                      payment === opt.key
                        ? "border-violet-500/60 bg-violet-500/10"
                        : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-white">{opt.title}</span>
                      {payment === opt.key && <Check className="w-4 h-4 text-violet-400" />}
                    </div>
                    <div className="text-[11px] text-white/35 mt-0.5">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-white/10 pt-5">
            <div className="flex items-end justify-between gap-3">
              <span className="text-sm text-white/50">Due today</span>
              <span className="text-3xl font-black text-white">
                {formatMoney(q.dueTodayCents > 0 ? q.dueTodayCents : q.monthlyCents)}
              </span>
            </div>
            {q.balanceCents > 0 && (
              <div className="flex items-center justify-between text-xs text-white/35 mt-2">
                <span>Balance on delivery</span>
                <span>{formatMoney(q.balanceCents)}</span>
              </div>
            )}
            {q.monthlyCents > 0 && (
              <div className="flex items-center justify-between text-xs text-white/35 mt-1.5">
                <span>{q.dueTodayCents > 0 ? "Then monthly" : "Billed monthly"}</span>
                <span>{formatMoney(q.monthlyCents)}/mo</span>
              </div>
            )}
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            onClick={() => checkout("card")}
            disabled={submitting !== null}
            size="lg"
            className="w-full mt-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0"
          >
            {submitting === "card" ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Starting checkout…
              </>
            ) : (
              <>
                <Lock className="mr-2 w-4 h-4" /> Pay{" "}
                {q.dueTodayCents > 0
                  ? formatMoney(q.dueTodayCents)
                  : `${formatMoney(q.monthlyCents)}/mo`}
              </>
            )}
          </Button>

          {/* Invoicing. A monthly service has to be set up as a subscription,
              which can't be collected on a one-off invoice. */}
          {paymentsLive && !q.hasRecurring && (
            <button
              type="button"
              onClick={() => checkout("invoice")}
              disabled={submitting !== null}
              className="w-full mt-2.5 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-white/50 hover:text-white hover:border-white/25 transition disabled:opacity-50"
            >
              {submitting === "invoice" ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending invoice…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Email me an invoice instead
                </span>
              )}
            </button>
          )}

          <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-white/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            {paymentsLive
              ? "Secure card payment via Stripe"
              : "Card payments switching on — we'll invoice you"}
          </p>

          {q.monthlyCents > 0 && (
            <p className="mt-3 text-[11px] text-white/25 leading-relaxed">
              Monthly items start today and renew every month. Cancel any time — ad spend is paid
              straight to Meta and isn&apos;t included here.
            </p>
          )}
        </div>

        <Link href="/pricing" className="block text-center text-xs text-white/30 hover:text-white/60 transition-colors">
          ← Keep browsing packages
        </Link>
      </div>
    </section>
  );
}
