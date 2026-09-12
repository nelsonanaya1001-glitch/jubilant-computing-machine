"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { generateBrandKit } from "@/lib/brand";
import { ArrowRight, ArrowLeft, Check, Sparkles, CheckCircle2 } from "lucide-react";

const INDUSTRIES = [
  "Professional Services", "Retail & E-Commerce", "Food & Beverage", "Health & Wellness",
  "Beauty & Salon", "Construction & Trades", "Real Estate", "Logistics & Transport",
  "Technology", "Education", "Fitness", "Creative & Media", "Automotive", "Other",
];

const STYLES = [
  { key: "modern", label: "Modern & clean" },
  { key: "bold", label: "Bold & striking" },
  { key: "classic", label: "Classic & established" },
  { key: "elegant", label: "Elegant & refined" },
  { key: "luxury", label: "Luxury & premium" },
  { key: "playful", label: "Playful & fun" },
  { key: "friendly", label: "Friendly & approachable" },
  { key: "minimal", label: "Minimal & restrained" },
  { key: "technical", label: "Technical & precise" },
  { key: "corporate", label: "Corporate & professional" },
  { key: "natural", label: "Natural & organic" },
];

const PRESET_COLORS = [
  "#7c3aed", "#2563eb", "#0ea5e9", "#059669", "#65a30d", "#ca8a04",
  "#ea580c", "#dc2626", "#db2777", "#4f46e5", "#0f766e", "#1a2b4a",
];

const LOGO_PREFS = [
  { key: "no-preference", label: "No preference", hint: "Show me everything" },
  { key: "wordmark", label: "Wordmark", hint: "My name as the logo" },
  { key: "monogram", label: "Monogram", hint: "My initials in a shape" },
  { key: "icon-wordmark", label: "Icon + name", hint: "A symbol beside my name" },
];

const TOTAL_STEPS = 5;

type FormState = {
  businessName: string; tagline: string; industry: string; contactName: string;
  email: string; phone: string; targetAudience: string; businessDescription: string;
  stylePreferences: string[]; seedColors: string[]; colorNotes: string; avoidColors: string;
  logoTypePref: string; inspirationRefs: string; competitorNotes: string; tier: "standard" | "pro";
};

const initialState: FormState = {
  businessName: "", tagline: "", industry: "", contactName: "", email: "", phone: "",
  targetAudience: "", businessDescription: "", stylePreferences: [], seedColors: ["#7c3aed"],
  colorNotes: "", avoidColors: "", logoTypePref: "no-preference", inspirationRefs: "",
  competitorNotes: "", tier: "standard",
};

const inputCls =
  "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition";
const labelCls = "block text-sm font-medium text-white/70 mb-2";

export default function BrandIntakePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  };

  const toggleStyle = (key: string) => {
    setForm((f) => ({
      ...f,
      stylePreferences: f.stylePreferences.includes(key)
        ? f.stylePreferences.filter((s) => s !== key)
        : [...f.stylePreferences, key].slice(0, 3),
    }));
    setError("");
  };

  // The generator is pure TypeScript, so we can run it right here for a live
  // preview as the client picks — no server round-trip, no cost.
  const preview = useMemo(() => {
    if (!form.businessName.trim()) return null;
    try {
      return generateBrandKit({
        businessName: form.businessName,
        stylePreferences: form.stylePreferences,
        seedColors: form.seedColors,
        logoTypePref: form.logoTypePref,
      });
    } catch {
      return null;
    }
  }, [form.businessName, form.stylePreferences, form.seedColors, form.logoTypePref]);

  function validate(current: number): string {
    if (current === 1) {
      if (form.businessName.trim().length < 2) return "Please enter your business name";
      if (!form.industry) return "Please select an industry";
      if (form.contactName.trim().length < 2) return "Please enter your name";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Please enter a valid email address";
    }
    if (current === 2) {
      if (form.targetAudience.trim().length < 10) return "Please describe who your customers are";
      if (form.businessDescription.trim().length < 40)
        return "Please give us a bit more detail — at least 40 characters";
    }
    if (current === 3 && form.stylePreferences.length === 0)
      return "Pick at least one style direction";
    if (current === 4 && form.seedColors.length === 0) return "Choose at least one colour";
    return "";
  }

  function next() {
    const msg = validate(step);
    if (msg) return setError(msg);
    setError("");
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  function back() {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  }

  async function submit() {
    for (let s = 1; s <= TOTAL_STEPS; s++) {
      const msg = validate(s);
      if (msg) { setStep(s); return setError(msg); }
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="bg-[#080810] text-white min-h-screen flex items-center justify-center px-6 py-32">
        <div className="max-w-lg text-center">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-4xl font-black mb-4">Your brand kit is being prepared</h1>
          <p className="text-white/50 leading-relaxed mb-8">
            We&apos;ve generated your first round of logo concepts, a full colour palette and a
            font system from your answers. We&apos;ll review and refine them, then send your brand
            guide over — usually within 2–3 business days.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0">
                Back to home
              </Button>
            </Link>
            <Link href="/get-started">
              <Button size="lg" variant="ghost" className="text-white/60 hover:text-white border border-white/10">
                Order a website too
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#080810] text-white min-h-screen">
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/15 rounded-full filter blur-[120px]" />
        <div className="relative max-w-3xl mx-auto px-6 pt-32 pb-10 text-center">
          <div className="text-xs font-semibold text-fuchsia-400 uppercase tracking-widest mb-3">
            Brand &amp; Identity Package
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Let&apos;s build your brand</h1>
          <p className="text-white/50">Takes about 5 minutes. Your concepts generate instantly.</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i + 1 <= step ? "bg-gradient-to-r from-violet-500 to-fuchsia-500" : "bg-white/10"
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-white/30 mb-8 font-mono">
          Step {step} of {TOTAL_STEPS}
        </div>

        {/* Step 1 — Business basics */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold mb-6">About your business</h2>
            <div>
              <label className={labelCls}>Business name *</label>
              <input className={inputCls} value={form.businessName} placeholder="Founders Distribution"
                onChange={(e) => set("businessName", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Tagline <span className="text-white/25">(optional)</span></label>
              <input className={inputCls} value={form.tagline} placeholder="More reach. More growth."
                onChange={(e) => set("tagline", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Industry *</label>
              <select className={inputCls} value={form.industry} onChange={(e) => set("industry", e.target.value)}>
                <option value="" className="bg-zinc-900">Select an industry…</option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i} className="bg-zinc-900">{i}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Your name *</label>
                <input className={inputCls} value={form.contactName} placeholder="Jordan Smith"
                  onChange={(e) => set("contactName", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Email *</label>
                <input className={inputCls} type="email" value={form.email} placeholder="you@company.com"
                  onChange={(e) => set("email", e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Phone <span className="text-white/25">(optional)</span></label>
              <input className={inputCls} type="tel" value={form.phone} placeholder="+1 (786) 000-0000"
                onChange={(e) => set("phone", e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 2 — Audience */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-2xl font-bold mb-6">Who you serve</h2>
            <div>
              <label className={labelCls}>Who are your ideal customers? *</label>
              <textarea className={inputCls} rows={3} value={form.targetAudience}
                placeholder="Small retail shops across South Florida looking for reliable wholesale supply…"
                onChange={(e) => set("targetAudience", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>
                What does your business do? *
                <span className="text-white/25 ml-2 font-normal">
                  {form.businessDescription.trim().length}/40 characters
                </span>
              </label>
              <textarea className={inputCls} rows={5} value={form.businessDescription}
                placeholder="Tell us what you sell or offer, what makes you different, and the feeling you want customers to have…"
                onChange={(e) => set("businessDescription", e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 3 — Style */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Your style direction</h2>
            <p className="text-white/40 text-sm mb-6">Pick up to 3 that feel like your brand.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {STYLES.map((s) => {
                const active = form.stylePreferences.includes(s.key);
                return (
                  <button key={s.key} type="button" onClick={() => toggleStyle(s.key)}
                    className={`relative text-left rounded-xl border px-4 py-3.5 text-sm font-medium transition ${
                      active
                        ? "bg-violet-500/15 border-violet-500/50 text-white"
                        : "bg-white/[0.03] border-white/10 text-white/60 hover:border-white/20"
                    }`}>
                    {s.label}
                    {active && <Check className="w-4 h-4 text-violet-400 absolute top-2 right-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4 — Colours */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your colours</h2>
              <p className="text-white/40 text-sm mb-5">
                Pick a main colour — we&apos;ll build a full palette around it.
              </p>
              <div className="flex flex-wrap gap-2.5 mb-5">
                {PRESET_COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => set("seedColors", [c])}
                    aria-label={`Choose ${c}`}
                    className={`w-11 h-11 rounded-xl border-2 transition ${
                      form.seedColors[0]?.toLowerCase() === c ? "border-white scale-110" : "border-white/10 hover:border-white/40"
                    }`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
              <label className={labelCls}>Or pick an exact colour</label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.seedColors[0] || "#7c3aed"}
                  onChange={(e) => set("seedColors", [e.target.value])}
                  className="w-14 h-12 rounded-lg bg-transparent border border-white/10 cursor-pointer" />
                <input className={inputCls} value={form.seedColors[0] || ""}
                  onChange={(e) => set("seedColors", [e.target.value])} placeholder="#7c3aed" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Any colour notes? <span className="text-white/25">(optional)</span></label>
              <input className={inputCls} value={form.colorNotes} placeholder="Our trucks are navy, we'd like to stay close to that"
                onChange={(e) => set("colorNotes", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Colours to avoid <span className="text-white/25">(optional)</span></label>
              <input className={inputCls} value={form.avoidColors} placeholder="Nothing red — too close to our competitor"
                onChange={(e) => set("avoidColors", e.target.value)} />
            </div>
          </div>
        )}

        {/* Step 5 — Logo preference + inspiration */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Logo direction</h2>
              <p className="text-white/40 text-sm mb-5">What kind of logo are you drawn to?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LOGO_PREFS.map((p) => {
                  const active = form.logoTypePref === p.key;
                  return (
                    <button key={p.key} type="button" onClick={() => set("logoTypePref", p.key)}
                      className={`text-left rounded-xl border px-4 py-3.5 transition ${
                        active ? "bg-violet-500/15 border-violet-500/50" : "bg-white/[0.03] border-white/10 hover:border-white/20"
                      }`}>
                      <div className="text-sm font-semibold text-white">{p.label}</div>
                      <div className="text-xs text-white/40 mt-0.5">{p.hint}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className={labelCls}>Brands or logos you like <span className="text-white/25">(optional)</span></label>
              <textarea className={inputCls} rows={2} value={form.inspirationRefs}
                placeholder="Links or names — e.g. Stripe's simplicity, Patagonia's outdoorsy feel"
                onChange={(e) => set("inspirationRefs", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Competitors to look different from <span className="text-white/25">(optional)</span></label>
              <textarea className={inputCls} rows={2} value={form.competitorNotes}
                placeholder="Who else is in your space?"
                onChange={(e) => set("competitorNotes", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Package</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { key: "standard", name: "Standard", price: "$149", desc: "Logo, palette, fonts, brand guide" },
                  { key: "pro", name: "Pro", price: "$249", desc: "Everything + favicon, social avatar, PDF" },
                ] as const).map((t) => (
                  <button key={t.key} type="button" onClick={() => set("tier", t.key)}
                    className={`text-left rounded-xl border px-4 py-4 transition ${
                      form.tier === t.key ? "bg-violet-500/15 border-violet-500/50" : "bg-white/[0.03] border-white/10 hover:border-white/20"
                    }`}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-bold text-white">{t.name}</span>
                      <span className="text-lg font-black text-violet-400">{t.price}</span>
                    </div>
                    <div className="text-xs text-white/40 mt-1">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Live preview */}
        {preview && step >= 3 && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                Live preview
              </span>
            </div>
            <div
              className="rounded-xl bg-white p-6 flex items-center justify-center mb-5 min-h-[140px]"
              dangerouslySetInnerHTML={{ __html: preview.logos[0].svg.replace("<svg", '<svg style="max-height:110px;max-width:100%"') }}
            />
            <div className="flex flex-wrap gap-2 mb-4">
              {preview.palette.colors.map((c) => (
                <div key={c.role} className="flex-1 min-w-[72px]">
                  <div className="h-12 rounded-lg border border-white/10" style={{ backgroundColor: c.hex }} />
                  <div className="text-[10px] text-white/40 mt-1.5 font-mono">{c.hex}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-white/40">
              Fonts: <span className="text-white/70">{preview.fonts.heading}</span> for headings ·{" "}
              <span className="text-white/70">{preview.fonts.body}</span> for body text
            </p>
            <p className="text-[11px] text-white/25 mt-3">
              This is an automatic first draft — we refine it by hand before delivery.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Nav */}
        <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/5">
          <button type="button" onClick={back} disabled={step === 1}
            className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white disabled:opacity-0 transition">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {step < TOTAL_STEPS ? (
            <Button onClick={next} size="lg"
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0">
              Continue <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={submit} size="lg" disabled={loading}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0">
              {loading ? "Submitting…" : <>Submit brand brief <ArrowRight className="ml-2 w-4 h-4" /></>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
