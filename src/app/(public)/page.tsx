import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, ChevronDown, Zap, ShoppingBag, MousePointerClick, Calendar, Palette, Megaphone } from "lucide-react";

const work: { title: string; cat: string; url: string }[] = [
  { title: "InvestingHouse", cat: "Landing Page · Logistics", url: "https://investinghouse.net" },
  { title: "El Barullo", cat: "Landing Page · Logistics", url: "https://elbarullo.com" },
  { title: "Motorland MIA", cat: "E-Commerce · Automotive", url: "https://motorlandmia.com" },
  { title: "Founders Distribution", cat: "Business Site · Distribution", url: "https://foundersdistribution.com" },
  { title: "Elevat8 Sourcing", cat: "Landing Page · Sourcing", url: "https://elevat8sourcing.com" },
];

const services = [
  { n: "01", icon: Zap, title: "Business Websites", desc: "Multi-page sites that establish authority and generate consistent inbound leads.", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", href: "/services" },
  { n: "02", icon: ShoppingBag, title: "E-Commerce Stores", desc: "Custom storefronts with conversion-optimized checkout and inventory management.", color: "text-fuchsia-400", bg: "bg-fuchsia-500/10 border-fuchsia-500/20", href: "/services" },
  { n: "03", icon: MousePointerClick, title: "Landing Pages", desc: "Single-purpose pages built around one goal — capturing leads or making sales.", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20", href: "/services" },
  { n: "04", icon: Calendar, title: "Booking Systems", desc: "Online scheduling that lets clients book 24/7 without emails or phone calls.", color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20", href: "/services" },
  { n: "05", icon: Palette, title: "Brand & Identity", desc: "Logo, colour palette, fonts and a brand guide — a complete identity built from scratch.", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", href: "/brand" },
  { n: "06", icon: Megaphone, title: "Meta Ads Management", desc: "Facebook and Instagram campaigns built, launched and optimised to bring you real customers.", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", href: "/ads" },
];

const faqs = [
  { q: "How long does a project take?", a: "Landing pages and business websites typically take 3–5 business days. Booking websites and online stores take 5–7 business days. We'll give you a firm timeline before we start." },
  { q: "What do you need from me to begin?", a: "Fill out our intake form — it covers your business, design preferences, and goals. It takes about 10 minutes. We handle the rest." },
  { q: "Do you offer maintenance after launch?", a: "Yes. We offer monthly plans covering security patches, content updates, performance monitoring, and priority support." },
  { q: "Will the site work on mobile?", a: "Every site we build is fully responsive and tested across devices and browsers. Mobile-first is standard, not optional." },
  { q: "Are there ongoing fees?", a: "Our quoted price is a one-time project fee. Hosting and domain costs are yours to own directly. Maintenance plans are optional add-ons." },
  { q: "Do you work with international clients?", a: "Yes — our entire workflow is remote-friendly. We have clients across North America, Europe, and Australia." },
];

function screenshotUrl(url: string) {
  // WordPress mShots — free, reliable, no API key. Renders a real screenshot of the live site.
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1200&h=900`;
}

export default function HomePage() {
  return (
    <div className="bg-[#080810] text-white">

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080810] via-transparent to-[#080810]" />
        {/* Multi-color glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-600/15 rounded-full filter blur-[130px]" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-pink-600/8 rounded-full filter blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24">
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight mb-8 max-w-5xl">
            Built for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              Businesses to Grow.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed mb-10">
            We build custom websites for businesses serious about growth.
            No templates. No shortcuts. Just results.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/get-started">
              <Button size="xl" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-2xl shadow-violet-900/50 group">
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="xl" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5 border border-white/10">
                See Our Work <ArrowUpRight className="ml-1.5 w-4 h-4" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* ── Services ─────────────────────────────── */}
      <section className="py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">What we do</div>
              <h2 className="text-4xl md:text-5xl font-black">Our services</h2>
            </div>
            <Link href="/services" className="text-sm text-white/40 hover:text-white flex items-center gap-1.5 transition-colors">
              View all services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((s) => (
              <Link
                key={s.n}
                href={s.href}
                className={`group relative rounded-2xl border p-7 hover:scale-[1.01] transition-all duration-200 block ${s.bg}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} border`}>
                    <s.icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <span className="text-xs font-mono text-white/20">{s.n}</span>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${s.color}`}>{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Work ─────────────────────────────────── */}
      {work.length > 0 && (
      <section className="py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="text-xs font-semibold text-fuchsia-400 uppercase tracking-widest mb-3">Portfolio</div>
              <h2 className="text-4xl md:text-5xl font-black">Selected work</h2>
            </div>
            <Link href="/portfolio" className="text-sm text-white/40 hover:text-white flex items-center gap-1.5 transition-colors">
              View all projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {work.map((p) => (
              <a
                key={p.title}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-900/20 transition-all duration-300 block"
              >
                <div className="relative w-full h-44 overflow-hidden bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screenshotUrl(p.url)}
                    alt={`${p.title} website preview`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-violet-400 font-medium mb-0.5">{p.cat}</div>
                    <div className="text-sm font-bold text-white">{p.title}</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-violet-400 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Process ──────────────────────────────── */}
      <section className="py-28 border-t border-white/5 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/5 rounded-full filter blur-[100px]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="text-xs font-semibold text-pink-400 uppercase tracking-widest mb-3">How we work</div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">Built around your results</h2>
              <p className="text-white/40 text-lg leading-relaxed">
                We don't hand you a template and call it done. Every project starts with
                understanding your business, your customers, and what success looks like for you.
              </p>
            </div>
            <div className="space-y-0 divide-y divide-white/5">
              {[
                { step: "01", title: "Discovery", desc: "We learn everything about your business, audience, and goals before writing a line of code.", color: "text-violet-400" },
                { step: "02", title: "Design", desc: "Custom design built around your brand — not a theme with your colors slapped on.", color: "text-fuchsia-400" },
                { step: "03", title: "Build", desc: "Fast, secure, and clean code. Tested across devices before it ever touches production.", color: "text-pink-400" },
                { step: "04", title: "Launch", desc: "Smooth go-live with full handoff, training, and ongoing support as needed.", color: "text-sky-400" },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 py-6 group">
                  <div className={`text-xs font-mono pt-1 w-6 flex-shrink-0 ${item.color}`}>{item.step}</div>
                  <div>
                    <h4 className={`font-bold mb-1 ${item.color}`}>{item.title}</h4>
                    <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────── */}
      <section className="py-28 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-widest mb-3">FAQ</div>
            <h2 className="text-4xl md:text-5xl font-black">Questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bg-white/[0.02] border border-white/5 rounded-xl hover:border-violet-500/30 transition-colors">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-white text-sm">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 text-white/30 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 text-white/40 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="py-28 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-fuchsia-900/10 to-pink-900/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-violet-600/15 rounded-full filter blur-[80px]" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-[0.9]">
            Ready to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              build?
            </span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
            Our intake form takes 10 minutes. We'll review your project and get back to you within one business day.
          </p>
          <Link href="/get-started">
            <Button size="xl" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-2xl shadow-violet-900/50 group">
              Start Your Project
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
