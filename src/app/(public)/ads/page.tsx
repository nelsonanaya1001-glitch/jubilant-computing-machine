import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, Check, Target, Users, BarChart3, Repeat, Megaphone, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Meta Ads Management | Launchboarding",
  description:
    "Facebook and Instagram ad campaigns built, launched and optimised to bring your business real customers — not just clicks.",
};

const included = [
  { icon: Target, title: "Audience targeting", desc: "We research and build the audiences most likely to buy from you, then narrow them as the data comes in." },
  { icon: Megaphone, title: "Ad creative", desc: "Scroll-stopping images and copy written for your offer — not recycled stock templates." },
  { icon: BarChart3, title: "Tracking & Pixel setup", desc: "Meta Pixel and Conversions API wired up properly, so you can see exactly what each dollar returns." },
  { icon: Repeat, title: "Ongoing optimisation", desc: "We test, cut what loses and scale what wins. Campaigns are managed continuously, not set-and-forget." },
];

const funnel = [
  { step: "Someone scrolls", desc: "Your ad appears in the feed of a person who matches your ideal customer." },
  { step: "They click", desc: "Creative built around your offer earns the click instead of the scroll-past." },
  { step: "They land", desc: "The click goes to a page built to convert — often one we built for you." },
  { step: "They convert", desc: "A call, a booking or a sale. Tracked end to end so you know what worked." },
];

const plans = [
  {
    name: "Ads Starter",
    setup: "349",
    monthly: "299",
    popular: false,
    best: "Best for a first campaign or a local business",
    features: [
      "1 campaign, up to 2 ad sets",
      "Audience research & setup",
      "Meta Pixel + Conversions API",
      "Ad creative (up to 3 variations)",
      "Monthly performance report",
      "Recommended ad spend: $500–1,500/mo",
    ],
  },
  {
    name: "Ads Growth",
    setup: "499",
    monthly: "549",
    popular: true,
    best: "Best for scaling what already works",
    features: [
      "Multiple campaigns & ad sets",
      "Full funnel: cold, warm & retargeting",
      "Monthly creative refresh",
      "Ongoing A/B testing",
      "Weekly reporting & optimisation",
      "Recommended ad spend: $1,500–5,000/mo",
    ],
  },
];

const faqs = [
  { q: "Is ad spend included in the price?", a: "No — and no honest agency includes it. Your ad budget is paid directly to Meta from your own account, so you keep full control and full visibility. Our fee covers building, running and optimising the campaigns." },
  { q: "Who owns the ad account?", a: "You do. We work inside your Meta Business account, so if we ever part ways you keep every campaign, audience and piece of historical data." },
  { q: "How long before I see results?", a: "Meta needs roughly 7–14 days to exit the learning phase and start delivering efficiently. Expect meaningful data in the first two weeks and a clearer picture of cost per lead by week four." },
  { q: "Do I need a website first?", a: "Almost always, yes. Sending paid traffic to a weak page wastes money. If you don't have a strong landing page, we'll build one — and bundling it with ads is cheaper than buying both separately." },
  { q: "Is there a long contract?", a: "No. Management is month to month. We'd rather keep you because the ads work than because a contract says so." },
];

export default function AdsPage() {
  return (
    <div className="bg-[#080810] text-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute -top-10 left-1/4 w-[550px] h-[450px] bg-emerald-600/12 rounded-full filter blur-[130px]" />
        <div className="absolute top-32 right-10 w-[400px] h-[400px] bg-violet-600/12 rounded-full filter blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-40 pb-24">
          <div className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-4">
            Meta Ads Management
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 max-w-4xl leading-[0.95]">
            Ads that bring
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-violet-400">
              customers, not clicks.
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl leading-relaxed mb-10">
            Facebook and Instagram campaigns built around your offer, tracked properly, and
            optimised every week. You keep the ad account — and every dollar of data in it.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/contact">
              <Button size="xl" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0 shadow-2xl shadow-emerald-900/40 group">
                Get an ads plan
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <div className="text-sm text-white/40">
              From <span className="text-white font-bold">$299/mo</span> · month to month
            </div>
          </div>

          {/* Funnel strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-16 pt-16 border-t border-white/5">
            {funnel.map((f, i) => (
              <div key={f.step} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-emerald-400">0{i + 1}</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="font-bold text-white text-sm mb-1.5">{f.step}</div>
                <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What's included ── */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-black mb-3">What we handle</h2>
          <p className="text-white/40 mb-12 max-w-xl">
            Everything from first audience to weekly optimisation. You approve the direction, we
            run the machine.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {included.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-emerald-500/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3">Management pricing</h2>
            <p className="text-white/40">A one-time setup fee, then month-to-month management.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`relative rounded-2xl border p-7 overflow-hidden ${
                  p.popular ? "border-emerald-500/40 bg-emerald-500/[0.04]" : "border-white/10 bg-white/[0.02]"
                }`}
              >
                {p.popular && (
                  <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                    Most popular
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1">{p.name}</h3>
                <p className="text-xs text-white/35 mb-5">{p.best}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-medium text-white/40">$</span>
                  <span className="text-4xl font-black text-white">{p.monthly}</span>
                  <span className="text-white/30 text-sm ml-1">/mo</span>
                </div>
                <div className="text-sm text-white/30 mb-6">plus a one-time ${p.setup} setup</div>
                <ul className="space-y-2.5 mb-7">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact">
                  <Button
                    className={`w-full border-0 ${
                      p.popular ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-white/5 hover:bg-white/10 text-white"
                    }`}
                  >
                    Get started <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Ad spend disclaimer — important that this is unmissable */}
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-5">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-white/60 leading-relaxed">
              <span className="font-semibold text-white">Ad spend is separate.</span> Your budget
              is paid directly to Meta from your own ad account — it never passes through us. That
              keeps your spending transparent and your account yours.
            </p>
          </div>

          <p className="text-center text-sm text-white/30 mt-8">
            Need a landing page for your ads to point at?{" "}
            <Link href="/pricing" className="text-emerald-400 hover:text-emerald-300">
              Bundle a landing page and save
            </Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-black text-center mb-12">Questions about ads</h2>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bg-white/[0.02] border border-white/5 rounded-xl hover:border-emerald-500/25 transition-colors">
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

      {/* ── CTA ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-900/10 to-violet-900/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-600/15 rounded-full filter blur-[90px]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[0.95]">
            Stop guessing.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Start measuring.
            </span>
          </h2>
          <p className="text-white/40 text-lg mb-10">
            Tell us about your business and your budget, and we&apos;ll tell you honestly whether
            ads make sense for you.
          </p>
          <Link href="/contact">
            <Button size="xl" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0 shadow-2xl shadow-emerald-900/40">
              Get an ads plan <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
