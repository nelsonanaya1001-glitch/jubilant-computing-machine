import Link from "next/link";
import { Button } from "@/components/ui/button";
import { generateBrandKit } from "@/lib/brand";
import { ArrowRight, Check, Palette, Type, Shapes, FileText } from "lucide-react";

export const metadata = {
  title: "Brand & Identity Package | Launchboarding",
  description:
    "Logo concepts, a full colour palette, a font system and a brand guide — built for your business in days, not weeks.",
};

// Rendered server-side from the same generator clients use, so this sample is
// genuinely representative of what gets delivered.
const sample = generateBrandKit({
  businessName: "Harbor & Oak",
  stylePreferences: ["elegant"],
  seedColors: ["#0f766e"],
  logoTypePref: "icon-wordmark",
});

const included = [
  { icon: Shapes, title: "Logo concepts", desc: "Multiple vector logo directions — wordmark, monogram and icon lockups — in editable SVG." },
  { icon: Palette, title: "Colour palette", desc: "Six defined brand colours with hex codes and clear guidance on where each one belongs." },
  { icon: Type, title: "Font system", desc: "A curated heading and body pairing, free for commercial use and ready to embed." },
  { icon: FileText, title: "Brand guide", desc: "A one-page guide with your logo, colours, fonts and usage notes — shareable and downloadable." },
];

const steps = [
  { n: "01", title: "Tell us about your brand", desc: "A short questionnaire covering your business, audience, style and colours. Around five minutes." },
  { n: "02", title: "Concepts generate instantly", desc: "You see your first logo concepts and palette the moment you submit — no waiting to find out the direction." },
  { n: "03", title: "We refine by hand", desc: "We review every concept, sharpen the details and make sure it holds up in the real world." },
  { n: "04", title: "You get your brand guide", desc: "Final logo files, colour codes, fonts and usage notes delivered in 2–3 business days." },
];

export default function BrandPage() {
  return (
    <div className="bg-[#080810] text-white">
      {/* ── Hero: split — copy left, live sample card right ── */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-violet-600/15 rounded-full filter blur-[130px]" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-fuchsia-600/10 rounded-full filter blur-[110px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-36 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs font-semibold text-fuchsia-400 uppercase tracking-widest mb-4">
                Brand &amp; Identity Package
              </div>
              <h1 className="text-5xl md:text-6xl font-black leading-[0.95] tracking-tight mb-6">
                A brand that looks
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
                  like it belongs.
                </span>
              </h1>
              <p className="text-lg text-white/50 leading-relaxed mb-8 max-w-lg">
                Logo, colours, fonts and a brand guide — built around your business, not pulled
                from a template. Add it to a website order or buy it on its own.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/brand/start">
                  <Button size="xl" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-2xl shadow-violet-900/50 group">
                    Start your brand
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
                <div className="text-sm text-white/40">
                  From <span className="text-white font-bold">$149</span> · 2–3 business days
                </div>
              </div>
            </div>

            {/* Live sample kit */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-4">
                Example output
              </div>
              <div
                className="rounded-2xl bg-white p-8 flex items-center justify-center mb-5 min-h-[150px]"
                dangerouslySetInnerHTML={{
                  __html: sample.logos[0].svg.replace("<svg", '<svg style="max-height:96px;max-width:100%"'),
                }}
              />
              <div className="flex gap-2 mb-5">
                {sample.palette.colors.map((c) => (
                  <div key={c.role} className="flex-1">
                    <div className="h-14 rounded-lg border border-white/10" style={{ backgroundColor: c.hex }} />
                    <div className="text-[10px] text-white/35 mt-1.5 font-mono">{c.hex}</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-white/40 border-t border-white/5 pt-4">
                <span className="text-white/70 font-medium">{sample.fonts.heading}</span> for headings ·{" "}
                <span className="text-white/70 font-medium">{sample.fonts.body}</span> for body
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What's included ── */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-black mb-3">What you get</h2>
          <p className="text-white/40 mb-12 max-w-xl">
            Everything you need to look consistent everywhere — your site, your socials, your
            invoices and your storefront.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {included.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-violet-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-black mb-12">How it works</h2>
          <div className="divide-y divide-white/5">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col sm:flex-row gap-6 py-7">
                <div className="text-xs font-mono text-violet-400 w-10 flex-shrink-0 pt-1">{s.n}</div>
                <div>
                  <h3 className="font-bold text-white mb-1.5">{s.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed max-w-2xl">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-black mb-3 text-center">Package pricing</h2>
          <p className="text-white/40 text-center mb-12">One-time fee. Yours to keep and use however you like.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                name: "Brand Standard", price: "149", popular: false,
                features: ["Up to 4 logo concepts", "Full 6-colour palette", "Heading + body font pairing", "One-page web brand guide", "Editable SVG logo files"],
              },
              {
                name: "Brand Pro", price: "249", popular: true,
                features: ["Everything in Standard", "All 6 logo concepts", "Favicon + social avatar exports", "Downloadable PDF brand guide", "One round of hand revisions", "Usage do's and don'ts"],
              },
            ].map((p) => (
              <div key={p.name} className={`relative rounded-2xl border p-7 ${p.popular ? "border-violet-500/40 bg-violet-500/[0.04]" : "border-white/10 bg-white/[0.02]"}`}>
                {p.popular && (
                  <div className="absolute top-0 right-0 bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg rounded-tr-2xl">
                    Best value
                  </div>
                )}
                <h3 className="text-lg font-bold mb-3">{p.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-xl font-medium text-white/40">$</span>
                  <span className="text-4xl font-black">{p.price}</span>
                  <span className="text-white/30 text-sm ml-1">one-time</span>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                      <Check className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/brand/start">
                  <Button className={`w-full border-0 ${p.popular ? "bg-violet-600 hover:bg-violet-500 text-white" : "bg-white/5 hover:bg-white/10 text-white"}`}>
                    Get started <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-white/30 mt-8">
            Ordering a website too?{" "}
            <Link href="/pricing" className="text-violet-400 hover:text-violet-300">
              Bundle and save $50
            </Link>
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-fuchsia-900/10 to-pink-900/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/15 rounded-full filter blur-[90px]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[0.95]">
            Ready to look
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">the part?</span>
          </h2>
          <p className="text-white/40 text-lg mb-10">
            Answer a few questions and watch your brand take shape in real time.
          </p>
          <Link href="/brand/start">
            <Button size="xl" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-2xl shadow-violet-900/50">
              Start your brand <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
