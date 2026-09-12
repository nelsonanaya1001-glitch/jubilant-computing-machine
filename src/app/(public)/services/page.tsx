import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, ShoppingCart, MousePointerClick, Calendar, Palette, Megaphone, Check, ArrowRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Service = {
  n: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  price: string;
  /** Set for recurring services (e.g. "/mo"); absent means a one-time fee. */
  priceSuffix?: string;
  timeline: string;
  accent: string;
  chip: string;
  href: string;
};

// Prices here are the single source of truth alongside /pricing — keep them in step.
const services: Service[] = [
  {
    n: "01",
    icon: Globe,
    title: "Business Websites",
    tagline: "Establish credibility. Generate leads.",
    description:
      "Your website is the first impression most customers get of your business. We build professional, fast, striking sites that communicate your value and turn visitors into leads.",
    features: [
      "Custom design aligned to your brand",
      "Mobile-first, fully responsive",
      "SEO-optimized structure",
      "Contact forms & lead capture",
      "Google Maps integration",
      "Performance optimization",
    ],
    price: "399",
    timeline: "3–5 business days",
    accent: "text-violet-400",
    chip: "bg-violet-500/10 border-violet-500/25",
    href: "/get-started",
  },
  {
    n: "02",
    icon: MousePointerClick,
    title: "Landing Pages",
    tagline: "Focus. Convert. Dominate.",
    description:
      "A high-performance page built around a single goal: converting visitors. Whether you're running ads or launching a product, we build pages engineered to maximize your return.",
    features: [
      "Single-purpose conversion design",
      "A/B testing ready",
      "Sub-2 second load speed",
      "Lead capture & CRM integration",
      "Pixel & analytics tracking",
      "Mobile and desktop optimized",
    ],
    price: "399",
    timeline: "3–5 business days",
    accent: "text-pink-400",
    chip: "bg-pink-500/10 border-pink-500/25",
    href: "/get-started",
  },
  {
    n: "03",
    icon: Calendar,
    title: "Booking Websites",
    tagline: "Fill your calendar. Cut no-shows.",
    description:
      "Built for service businesses — salons, consultants, healthcare, fitness studios and trades. Clients self-schedule around the clock, and automated reminders keep your calendar full.",
    features: [
      "Online appointment scheduling",
      "Automated confirmations & reminders",
      "Staff & resource management",
      "Payment collection at booking",
      "Calendar sync (Google, Outlook)",
      "Secure database included",
      "Client account portal",
    ],
    price: "459",
    timeline: "5–7 business days",
    accent: "text-sky-400",
    chip: "bg-sky-500/10 border-sky-500/25",
    href: "/get-started",
  },
  {
    n: "04",
    icon: ShoppingCart,
    title: "E-Commerce Stores",
    tagline: "Sell online. Scale revenue.",
    description:
      "High-converting online stores that make purchasing effortless. From product pages through to checkout, every element is designed to remove friction and maximize sales.",
    features: [
      "Custom storefront design",
      "Secure payment gateways",
      "Product & inventory management",
      "Checkout optimization",
      "Order management & emails",
      "Secure database included",
      "Shopify integration",
      "Mobile shopping experience",
    ],
    price: "549",
    timeline: "5–7 business days",
    accent: "text-fuchsia-400",
    chip: "bg-fuchsia-500/10 border-fuchsia-500/25",
    href: "/get-started",
  },
  {
    n: "05",
    icon: Palette,
    title: "Brand & Identity",
    tagline: "Look like you mean it.",
    description:
      "Don't have a logo yet? We build your visual identity from scratch — logo concepts, a full colour palette, a font system and a brand guide you can use everywhere.",
    features: [
      "Multiple vector logo concepts",
      "Full six-colour palette",
      "Heading & body font pairing",
      "One-page brand guide",
      "Editable SVG files you own",
      "Favicon & social avatar exports",
    ],
    price: "149",
    timeline: "2–3 business days",
    accent: "text-amber-400",
    chip: "bg-amber-500/10 border-amber-500/25",
    href: "/brand",
  },
  {
    n: "06",
    icon: Megaphone,
    title: "Meta Ads Management",
    tagline: "Reach the people who buy.",
    description:
      "Facebook and Instagram campaigns built around your offer, tracked properly and optimised every week. You keep the ad account and every piece of data in it.",
    features: [
      "Audience research & targeting",
      "Ad creative and copywriting",
      "Meta Pixel & Conversions API setup",
      "Full funnel incl. retargeting",
      "Ongoing A/B testing",
      "Regular performance reporting",
    ],
    price: "299",
    priceSuffix: "/mo",
    timeline: "plus one-time setup",
    accent: "text-emerald-400",
    chip: "bg-emerald-500/10 border-emerald-500/25",
    href: "/ads",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-[#080810] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-violet-600/15 rounded-full filter blur-[130px]" />
        <div className="absolute top-20 right-10 w-[350px] h-[350px] bg-fuchsia-600/10 rounded-full filter blur-[110px]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-40 pb-24">
          <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">What we do</div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 max-w-3xl leading-[0.95]">
            Built from scratch.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              Never templated.
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl leading-relaxed">
            Every project is custom-built for your business and your audience. Pick the service
            that fits — we&apos;ll handle the rest.
          </p>
        </div>
      </section>

      {/* Services — alternating asymmetric rows */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 divide-y divide-white/5">
          {services.map((s, i) => {
            const Icon = s.icon;
            const flip = i % 2 === 1;
            return (
              <div key={s.title} className="py-16">
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-start ${flip ? "lg:[direction:rtl]" : ""}`}>
                  {/* Copy */}
                  <div className={`lg:col-span-7 [direction:ltr]`}>
                    <div className="flex items-center gap-4 mb-5">
                      <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${s.chip}`}>
                        <Icon className={`w-5 h-5 ${s.accent}`} />
                      </div>
                      <span className="font-mono text-xs text-white/20">{s.n}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black mb-2">{s.title}</h2>
                    <p className={`text-sm font-semibold mb-4 ${s.accent}`}>{s.tagline}</p>
                    <p className="text-white/45 leading-relaxed max-w-xl mb-7">{s.description}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 max-w-xl">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                          <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${s.accent}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price card */}
                  <div className="lg:col-span-5 [direction:ltr]">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 lg:sticky lg:top-24">
                      <div className="text-xs text-white/30 mb-1">Starting at</div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-xl font-medium text-white/40">$</span>
                        <span className="text-5xl font-black text-white">{s.price}</span>
                        {s.priceSuffix && (
                          <span className="text-lg font-medium text-white/40">{s.priceSuffix}</span>
                        )}
                      </div>
                      <div className="text-sm text-white/30 mb-6">
                        {s.priceSuffix ? s.timeline : `one-time · ${s.timeline}`}
                      </div>
                      <Link href={s.href}>
                        <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white border-0">
                          Get started <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                      <Link
                        href="/pricing"
                        className="mt-3 block text-center text-xs text-white/30 hover:text-white/60 transition-colors"
                      >
                        Compare all pricing
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-fuchsia-900/10 to-pink-900/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/15 rounded-full filter blur-[90px]" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[0.95]">
            Not sure which
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">you need?</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-lg mx-auto">
            Tell us about your business and goals. We&apos;ll recommend the right fit — no pressure.
          </p>
          <Link href="/contact">
            <Button size="xl" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-2xl shadow-violet-900/50 group">
              Start the conversation
              <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
