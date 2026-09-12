"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Globe, Send, CheckCircle2, ArrowRight } from "lucide-react";

const inputCls =
  "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition";
const labelCls = "block text-sm font-medium text-white/70 mb-2";

const CONTACT_METHODS = [
  { icon: Mail, label: "Email us", value: "hello@launchboarding.co", href: "mailto:hello@launchboarding.co" },
  { icon: Phone, label: "Call us", value: "+1 (786) 501-5600", href: "tel:+17865015600" },
  { icon: Globe, label: "Where we work", value: "Remote — worldwide", href: null },
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#080810] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-violet-600/15 rounded-full filter blur-[120px]" />
        <div className="relative max-w-3xl mx-auto px-6 pt-36 pb-16 text-center">
          <div className="text-xs font-semibold text-fuchsia-400 uppercase tracking-widest mb-4">Contact</div>
          <h1 className="text-5xl md:text-6xl font-black mb-5 leading-[0.95]">
            Let&apos;s talk about
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
              your project.
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            Ready to start, or still figuring it out? Either way, we&apos;re happy to help. No pressure.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left — details */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Get in touch</h2>
            <p className="text-white/40 leading-relaxed mb-8">
              We reply to every message within one business day — usually much sooner.
            </p>

            <div className="space-y-3 mb-10">
              {CONTACT_METHODS.map((m) => {
                const body = (
                  <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors group-hover:border-violet-500/40">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                      <m.icon className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-white/35">{m.label}</div>
                      <div className="text-sm font-medium text-white truncate">{m.value}</div>
                    </div>
                  </div>
                );
                return m.href ? (
                  <a key={m.label} href={m.href} className="group block">{body}</a>
                ) : (
                  <div key={m.label} className="group">{body}</div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/5 p-6">
              <h3 className="font-bold text-white mb-2">Ready to start?</h3>
              <p className="text-sm text-white/50 mb-5 leading-relaxed">
                Skip the back-and-forth. Our intake form takes about 10 minutes and gives us
                everything we need to quote your project.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/get-started">
                  <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white border-0">
                    Start a website project <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/brand/start">
                  <Button variant="ghost" className="w-full text-white/60 hover:text-white border border-white/10">
                    Or start a brand package
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              {submitted ? (
                <div className="text-center py-14">
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-violet-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Message sent</h3>
                  <p className="text-white/50 max-w-sm mx-auto leading-relaxed">
                    Thanks for reaching out — we&apos;ll get back to you within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold mb-1">Send us a message</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>First name *</label>
                      <input name="firstName" required className={inputCls} placeholder="Jordan" />
                    </div>
                    <div>
                      <label className={labelCls}>Last name</label>
                      <input name="lastName" className={inputCls} placeholder="Smith" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Email *</label>
                      <input name="email" type="email" required className={inputCls} placeholder="you@company.com" />
                    </div>
                    <div>
                      <label className={labelCls}>Phone</label>
                      <input name="phone" type="tel" className={inputCls} placeholder="+1 (786) 000-0000" />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Company</label>
                    <input name="company" className={inputCls} placeholder="Your company" />
                  </div>

                  <div>
                    <label className={labelCls}>What are you interested in?</label>
                    <select name="service" className={inputCls} defaultValue="">
                      <option value="" className="bg-zinc-900">Select…</option>
                      {["Business Website", "Landing Page", "Booking Website", "Online Store", "Brand & Identity", "Not sure yet"].map((s) => (
                        <option key={s} value={s} className="bg-zinc-900">{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>Your message *</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      className={inputCls}
                      placeholder="Tell us about your business, your goals and your timeline…"
                    />
                  </div>

                  {/* Honeypot — hidden from people, catches bots. */}
                  <input
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute left-[-9999px] w-px h-px opacity-0"
                  />

                  {error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0"
                  >
                    {loading ? "Sending…" : <>Send message <Send className="ml-2 w-4 h-4" /></>}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
