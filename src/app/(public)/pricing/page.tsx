import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, ArrowUpRight } from "lucide-react";

const plans = [
  {
    name: "Business Website",
    price: "399",
    tagline: "A professional multi-page site that builds trust and brings in leads.",
    features: [
      "Up to 6 pages",
      "Custom responsive design",
      "Contact form & lead capture",
      "Basic SEO setup",
      "Google Maps & analytics",
      "Launch in 3–5 business days",
    ],
    accent: "#4f46e5",
    popular: false,
  },
  {
    name: "Landing Page",
    price: "399",
    tagline: "A single high-converting page built around one clear goal.",
    features: [
      "Single conversion-focused page",
      "Custom responsive design",
      "Lead capture & CRM ready",
      "Fast load speed",
      "Pixel & analytics tracking",
      "Launch in 3–5 business days",
    ],
    accent: "#16a34a",
    popular: true,
  },
  {
    name: "Booking Website",
    price: "459",
    tagline: "Let clients book appointments online, 24/7, with zero back-and-forth.",
    features: [
      "Online appointment scheduling",
      "Automated confirmations & reminders",
      "Staff & service management",
      "Payment collection at booking",
      "Calendar sync (Google, Outlook)",
      "Secure database included",
      "$150/mo maintenance available",
      "Launch in 5–7 business days",
    ],
    accent: "#ea580c",
    popular: false,
  },
  {
    name: "Online Store",
    price: "549",
    tagline: "A complete e-commerce store designed to sell from day one.",
    features: [
      "Custom storefront design",
      "Secure payment processing",
      "Product & inventory management",
      "Cart & checkout optimization",
      "Order notifications",
      "Secure database included",
      "Shopify integration",
      "$150/mo maintenance available",
      "Launch in 5–7 business days",
    ],
    accent: "#db2777",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full filter blur-[120px]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-40 pb-24 text-center">
          <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">Pricing</div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[0.95]">
            Simple, honest
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">pricing.</span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            One flat fee per project. No surprises, no hidden costs. Optional maintenance keeps everything running smoothly after launch.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`group relative bg-white/[0.02] border rounded-2xl p-7 transition-colors overflow-hidden ${
                plan.popular ? "border-violet-500/40" : "border-white/5 hover:border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <div
                className="absolute -top-20 -right-20 w-48 h-48 rounded-full filter blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: plan.accent + "33" }}
              />
              <div className="relative">
                <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-white/40 mb-5 min-h-[40px]">{plan.tagline}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-xl font-medium text-white/40">$</span>
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-white/30 text-sm ml-1">one-time</span>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: plan.accent }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/get-started">
                  <Button
                    className={`w-full border-0 ${plan.popular ? "bg-violet-600 hover:bg-violet-500 text-white" : "bg-white/5 hover:bg-white/10 text-white"}`}
                  >
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Brand & Identity — its own category, sold with a site or on its own */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-20">
          <div className="text-center mb-10">
            <div className="text-xs font-semibold text-fuchsia-400 uppercase tracking-widest mb-3">
              Add-on category
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-3">Brand &amp; Identity</h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Logo, colour palette, fonts and a brand guide. Add it to any website above, or buy
              it on its own.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {[
              {
                name: "Brand Standard",
                solo: "149",
                bundled: "99",
                popular: false,
                features: [
                  "Up to 4 logo concepts",
                  "Full 6-colour palette",
                  "Heading + body font pairing",
                  "One-page web brand guide",
                  "Editable SVG logo files",
                ],
              },
              {
                name: "Brand Pro",
                solo: "249",
                bundled: "199",
                popular: true,
                features: [
                  "Everything in Standard",
                  "All 6 logo concepts",
                  "Favicon + social avatar exports",
                  "Downloadable PDF brand guide",
                  "One round of hand revisions",
                  "Usage do's and don'ts",
                ],
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`relative rounded-2xl border p-7 overflow-hidden ${
                  p.popular ? "border-violet-500/40 bg-violet-500/[0.04]" : "border-white/5 bg-white/[0.02]"
                }`}
              >
                {p.popular && (
                  <div className="absolute top-0 right-0 bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                    Best value
                  </div>
                )}
                <h3 className="text-lg font-bold mb-3">{p.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-xl font-medium text-white/40">$</span>
                  <span className="text-4xl font-black text-white">{p.bundled}</span>
                  <span className="text-white/30 text-sm ml-1">with a website</span>
                </div>
                <div className="text-sm text-white/30 mb-6">
                  <span className="line-through">${p.solo}</span> on its own — save $50 bundled
                </div>
                <ul className="space-y-2.5 mb-7">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-violet-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/brand/start">
                  <Button
                    className={`w-full border-0 ${
                      p.popular ? "bg-violet-600 hover:bg-violet-500 text-white" : "bg-white/5 hover:bg-white/10 text-white"
                    }`}
                  >
                    Start your brand <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-white/30 mt-8">
            Want the full picture?{" "}
            <Link href="/brand" className="text-violet-400 hover:text-violet-300">
              See everything in the Brand &amp; Identity package
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-center mb-12">Pricing questions</h2>
          <div className="space-y-2">
            {[
              { q: "How do payments work?", a: "We take a 50% deposit to begin, with the balance due at launch. Payment is simple and secure." },
              { q: "Are there any hidden fees?", a: "No. The price you see is the full project cost. Hosting and domain are yours to own directly, and maintenance is entirely optional." },
              { q: "Is the maintenance plan required?", a: "Not at all. Your site is yours once it launches. The $150/mo plan is there if you'd like us to keep it updated and supported." },
              { q: "Can I add features later?", a: "Yes. Many clients start simple and expand over time. We can scope additional pages or features whenever you're ready." },
              { q: "Do I need the Brand & Identity package?", a: "Only if you don't already have a logo and brand colours. If you do, send them over and we'll build your site around them at no extra cost. If you don't, the brand package gives you a logo, palette, fonts and a brand guide — and it's $50 cheaper bundled with a website." },
              { q: "Who owns the logo and brand files?", a: "You do, completely. You get editable vector files and a brand guide that are yours to use anywhere — signage, packaging, social media, print — with no ongoing licence or fee." },
            ].map((faq) => (
              <details key={faq.q} className="group bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-sm">
                  {faq.q}
                  <ArrowUpRight className="w-4 h-4 text-white/30 group-open:rotate-90 transition-transform flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 text-white/40 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[0.95]">
            Ready to get
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">started?</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-lg mx-auto">
            Fill out our quick intake form and we'll get back to you within one business day.
          </p>
          <Link href="/get-started">
            <Button size="xl" className="bg-violet-600 hover:bg-violet-500 text-white border-0 shadow-2xl shadow-violet-900/40 group">
              Start Your Project
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
