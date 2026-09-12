import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, MousePointerClick, Calendar, ShoppingCart, Check, Minus, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Websites | Launchboarding",
  description:
    "Business websites, landing pages, booking sites and online stores — custom built, launched in days, priced up front.",
};

const types = [
  {
    id: "business",
    icon: Globe,
    name: "Business Website",
    price: "399",
    timeline: "3–5 days",
    bestFor: "You want customers to find you, trust you, and get in touch.",
    accent: "text-violet-400",
    chip: "bg-violet-500/10 border-violet-500/25",
    points: ["Up to 6 pages", "Contact form & lead capture", "Basic SEO setup", "Google Maps & analytics"],
  },
  {
    id: "landing",
    icon: MousePointerClick,
    name: "Landing Page",
    price: "399",
    timeline: "3–5 days",
    bestFor: "You're running ads or launching one offer and need it to convert.",
    accent: "text-pink-400",
    chip: "bg-pink-500/10 border-pink-500/25",
    points: ["Single conversion-focused page", "Lead capture & CRM ready", "Sub-2 second load speed", "Pixel & analytics tracking"],
  },
  {
    id: "booking",
    icon: Calendar,
    name: "Booking Website",
    price: "459",
    timeline: "5–7 days",
    bestFor: "Your business runs on appointments and you're tired of phone tag.",
    accent: "text-sky-400",
    chip: "bg-sky-500/10 border-sky-500/25",
    points: ["24/7 online scheduling", "Automated reminders", "Payment at booking", "Calendar sync & database"],
  },
  {
    id: "store",
    icon: ShoppingCart,
    name: "Online Store",
    price: "549",
    timeline: "5–7 days",
    bestFor: "You sell products and need checkout, inventory and orders handled.",
    accent: "text-fuchsia-400",
    chip: "bg-fuchsia-500/10 border-fuchsia-500/25",
    points: ["Custom storefront", "Secure payments & checkout", "Product & inventory management", "Shopify integration"],
  },
];

// true = included, false = not included, string = qualified note
const matrix: { label: string; values: (boolean | string)[] }[] = [
  { label: "Custom responsive design", values: [true, true, true, true] },
  { label: "Mobile-first build", values: [true, true, true, true] },
  { label: "Contact / lead capture", values: [true, true, true, true] },
  { label: "SEO setup", values: [true, "Basic", true, true] },
  { label: "Multiple pages", values: ["Up to 6", "Single page", true, true] },
  { label: "Online scheduling", values: [false, false, true, false] },
  { label: "Take payments", values: [false, false, "At booking", true] },
  { label: "Product & inventory", values: [false, false, false, true] },
  { label: "Secure database", values: [false, false, true, true] },
  { label: "Maintenance available", values: [false, false, "$150/mo", "$150/mo"] },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-4 h-4 text-violet-400 mx-auto" />;
  if (value === false) return <Minus className="w-4 h-4 text-white/15 mx-auto" />;
  return <span className="text-xs text-white/60">{value}</span>;
}

export default function WebsitesPage() {
  return (
    <div className="bg-[#080810] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[400px] bg-violet-600/15 rounded-full filter blur-[130px]" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 pt-40 pb-20 text-center">
          <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">Websites</div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[0.95]">
            Just need a
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              website?
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            Four kinds of site, one flat price each, launched in days. No branding or ads
            required — pick what fits and we&apos;ll build it.
          </p>
        </div>
      </section>

      {/* Types */}
      <section className="py-20 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {types.map((t) => (
              <div key={t.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 hover:border-violet-500/30 transition-colors">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${t.chip}`}>
                    <t.icon className={`w-5 h-5 ${t.accent}`} />
                  </div>
                  <div className="text-right">
                    <div className="flex items-baseline gap-0.5 justify-end">
                      <span className="text-sm font-medium text-white/40">$</span>
                      <span className="text-3xl font-black text-white">{t.price}</span>
                    </div>
                    <div className="text-xs text-white/30">{t.timeline}</div>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{t.name}</h2>
                <p className={`text-sm mb-5 leading-relaxed ${t.accent}`}>{t.bestFor}</p>
                <ul className="space-y-2 mb-6">
                  {t.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-white/55">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${t.accent}`} />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link href="/get-started">
                  <Button className="w-full bg-white/5 hover:bg-white/10 text-white border-0">
                    Start this project <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black mb-3">Compare at a glance</h2>
            <p className="text-white/40">Not sure which one? This usually settles it.</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-white/[0.03]">
                  <th className="text-left text-xs font-semibold uppercase tracking-wide text-white/40 px-5 py-4">
                    Feature
                  </th>
                  {types.map((t) => (
                    <th key={t.id} className="px-5 py-4 text-center">
                      <div className="text-sm font-bold text-white">{t.name}</div>
                      <div className="text-xs text-white/30 mt-0.5">${t.price}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, i) => (
                  <tr key={row.label} className={i % 2 ? "bg-white/[0.015]" : ""}>
                    <td className="px-5 py-3.5 text-sm text-white/60 border-t border-white/5">{row.label}</td>
                    {row.values.map((v, j) => (
                      <td key={j} className="px-5 py-3.5 text-center border-t border-white/5">
                        <Cell value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-sm text-white/30 mt-8">
            Want branding or ads alongside it?{" "}
            <Link href="/pricing" className="text-violet-400 hover:text-violet-300">
              Build a bundle and save
            </Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-fuchsia-900/10 to-pink-900/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/15 rounded-full filter blur-[90px]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[0.95]">
            Let&apos;s build
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">your site.</span>
          </h2>
          <p className="text-white/40 text-lg mb-10">
            Our intake form takes about 10 minutes and gives us everything we need to start.
          </p>
          <Link href="/get-started">
            <Button size="xl" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-2xl shadow-violet-900/50">
              Start your project <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
