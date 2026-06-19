import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, Star, ChevronDown } from "lucide-react";

const work = [
  { title: "Hartwell Law Group", cat: "Business Website", color: "#1a1a2e", accent: "#4f46e5" },
  { title: "GreenLeaf Organics", cat: "E-Commerce Store", color: "#0d1a12", accent: "#16a34a" },
  { title: "Elevate Fitness", cat: "Booking System", color: "#1c0f05", accent: "#ea580c" },
  { title: "Crestwood Realty", cat: "Business Website", color: "#0f0f1a", accent: "#7c3aed" },
  { title: "Bliss Beauty Studio", cat: "Booking System", color: "#1a0d14", accent: "#db2777" },
  { title: "TechVault Solutions", cat: "Custom Web App", color: "#0a0f1a", accent: "#0ea5e9" },
];

const services = [
  { n: "01", title: "Business Websites", desc: "Multi-page sites that establish authority and generate consistent inbound leads." },
  { n: "02", title: "E-Commerce Stores", desc: "Custom storefronts with conversion-optimized checkout and inventory management." },
  { n: "03", title: "Landing Pages", desc: "Single-purpose pages built around one goal — capturing leads or making sales." },
  { n: "04", title: "Booking Systems", desc: "Online scheduling that lets clients book 24/7 without emails or phone calls." },
  { n: "05", title: "Custom Web Apps", desc: "Bespoke platforms built to your workflow when off-the-shelf software falls short." },
];

const testimonials = [
  { name: "Marcus Chen", co: "Hartwell Law Group", text: "Client inquiries went up 340% in two months. The site looks exactly like we envisioned — but actually converts.", stars: 5 },
  { name: "Sarah Beaumont", co: "GreenLeaf Organics", text: "Our e-commerce revenue doubled in Q1 after launch. The shopping experience is genuinely beautiful.", stars: 5 },
  { name: "David Okonkwo", co: "Elevate Fitness", text: "No-show rate dropped 60% and we cut admin time in half. I wish we'd done this two years earlier.", stars: 5 },
];

const faqs = [
  { q: "How long does a project take?", a: "A business website typically takes 3–5 weeks. E-commerce and custom apps run 6–12 weeks depending on scope. We'll give you a firm timeline before we start." },
  { q: "What do you need from me to begin?", a: "Fill out our intake form — it covers your business, design preferences, and goals. It takes about 10 minutes. We handle the rest." },
  { q: "Do you offer maintenance after launch?", a: "Yes. We offer monthly plans covering security patches, content updates, performance monitoring, and priority support." },
  { q: "Will the site work on mobile?", a: "Every site we build is fully responsive and tested across devices and browsers. Mobile-first is standard, not optional." },
  { q: "Are there ongoing fees?", a: "Our quoted price is a one-time project fee. Hosting and domain costs are yours to own directly. Maintenance plans are optional add-ons." },
  { q: "Do you work with international clients?", a: "Yes — our entire workflow is remote-friendly. We have clients across North America, Europe, and Australia." },
];

export default function HomePage() {
  return (
    <div className="bg-black text-white">

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full filter blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24">
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tight mb-8 max-w-5xl">
            Websites that
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              actually work.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed mb-10">
            We build custom websites and web applications for businesses serious about growth.
            No templates. No shortcuts. Just results.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/get-started">
              <Button size="xl" className="bg-violet-600 hover:bg-violet-500 text-white border-0 shadow-2xl shadow-violet-900/40 group">
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button size="xl" variant="ghost" className="text-white/60 hover:text-white hover:bg-white/5">
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

          <div className="divide-y divide-white/5">
            {services.map((s) => (
              <div key={s.n} className="flex flex-col md:flex-row md:items-center gap-6 py-7 group cursor-default">
                <div className="text-xs font-mono text-white/20 w-8 flex-shrink-0">{s.n}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors mb-1">{s.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed max-w-xl">{s.desc}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-violet-400 transition-colors flex-shrink-0 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Work ─────────────────────────────────── */}
      <section className="py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Portfolio</div>
              <h2 className="text-4xl md:text-5xl font-black">Selected work</h2>
            </div>
            <Link href="/portfolio" className="text-sm text-white/40 hover:text-white flex items-center gap-1.5 transition-colors">
              View all projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {work.map((p) => (
              <div
                key={p.title}
                className="group relative rounded-2xl overflow-hidden h-56 cursor-pointer"
                style={{ backgroundColor: p.color }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at 30% 50%, ${p.accent}22, transparent 60%)` }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: p.accent }}>{p.cat}</div>
                  <div className="text-lg font-bold text-white">{p.title}</div>
                </div>
                <div
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: p.accent + "33" }}
                >
                  <ArrowUpRight className="w-4 h-4" style={{ color: p.accent }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────── */}
      <section className="py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">How we work</div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">Built around your results</h2>
              <p className="text-white/40 text-lg leading-relaxed">
                We don't hand you a template and call it done. Every project starts with
                understanding your business, your customers, and what success looks like for you.
              </p>
            </div>
            <div className="space-y-0 divide-y divide-white/5">
              {[
                { step: "01", title: "Discovery", desc: "We learn everything about your business, audience, and goals before writing a line of code." },
                { step: "02", title: "Design", desc: "Custom design built around your brand — not a theme with your colors slapped on." },
                { step: "03", title: "Build", desc: "Fast, secure, and clean code. Tested across devices before it ever touches production." },
                { step: "04", title: "Launch", desc: "Smooth go-live with full handoff, training, and ongoing support as needed." },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 py-6">
                  <div className="text-xs font-mono text-white/20 pt-1 w-6 flex-shrink-0">{item.step}</div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────── */}
      <section className="py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">Client stories</div>
            <h2 className="text-4xl md:text-5xl font-black">Results that speak</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:border-violet-500/20 transition-colors">
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-violet-400 text-violet-400" />
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-white/30 text-xs mt-0.5">{t.co}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────── */}
      <section className="py-28 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-3">FAQ</div>
            <h2 className="text-4xl md:text-5xl font-black">Questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-colors">
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
      <section className="py-28 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-[0.9]">
            Ready to
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              build?
            </span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
            Our intake form takes 10 minutes. We'll review your project and get back to you within one business day.
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
