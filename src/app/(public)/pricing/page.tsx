import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, HelpCircle } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "2,500",
    period: "one-time",
    tagline: "Perfect for small businesses launching online",
    features: [
      "Up to 5 pages",
      "Mobile-responsive design",
      "Contact form",
      "Basic SEO setup",
      "Google Analytics integration",
      "1 round of revisions",
      "30 days post-launch support",
    ],
    cta: "Get Started",
    popular: false,
    color: "border-gray-200",
  },
  {
    name: "Professional",
    price: "5,500",
    period: "one-time",
    tagline: "For growing businesses that need more",
    features: [
      "Up to 12 pages",
      "Custom design system",
      "Blog or news section",
      "Advanced SEO optimization",
      "CMS integration",
      "Lead capture & email integration",
      "3 rounds of revisions",
      "90 days post-launch support",
      "Speed optimization",
    ],
    cta: "Get Started",
    popular: true,
    color: "border-blue-600",
  },
  {
    name: "E-Commerce",
    price: "7,500",
    period: "one-time",
    tagline: "Full-featured online store built to sell",
    features: [
      "Custom storefront design",
      "Product catalog (up to 100 SKUs)",
      "Secure payment processing",
      "Inventory management",
      "Order notifications",
      "Customer accounts",
      "Discount and coupon system",
      "3 rounds of revisions",
      "120 days post-launch support",
    ],
    cta: "Get Started",
    popular: false,
    color: "border-gray-200",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    tagline: "Complex projects with custom requirements",
    features: [
      "Unlimited pages",
      "Multi-location & franchise sites",
      "Third-party API integrations",
      "Customer accounts & portals",
      "Advanced SEO & analytics",
      "Performance SLA",
      "Dedicated project manager",
      "Ongoing retainer available",
      "Priority support",
    ],
    cta: "Talk to Us",
    popular: false,
    color: "border-gray-200",
  },
];

const addons = [
  { name: "Monthly Maintenance", price: "$150/mo", desc: "Security updates, content changes, performance monitoring" },
  { name: "Booking System", price: "+$1,500", desc: "Online appointment scheduling with calendar sync" },
  { name: "SEO Package", price: "+$800", desc: "Keyword research, on-page optimization, Google Business setup" },
  { name: "Copywriting", price: "+$500", desc: "Professional website copy written by our content team" },
  { name: "Logo Design", price: "+$600", desc: "Custom logo design with brand color palette" },
  { name: "Email Setup", price: "+$200", desc: "Custom domain email with client portal" },
];

export default function PricingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Straightforward Pricing</h1>
          <p className="text-xl text-slate-300">
            No hidden fees. No surprise invoices. Clear pricing for every stage of your project.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border-2 ${plan.color} p-8 relative ${plan.popular ? "shadow-xl shadow-blue-100" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.tagline}</p>
                  <div className="flex items-baseline gap-1">
                    {plan.price !== "Custom" && (
                      <span className="text-2xl font-medium text-gray-500">$</span>
                    )}
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-400 text-sm ml-1">{plan.period}</span>
                    )}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/get-started">
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Add-Ons & Extras</h2>
            <p className="text-gray-500">Enhance any package with optional services</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((addon) => (
              <div key={addon.name} className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{addon.name}</h4>
                  <span className="text-blue-600 font-bold text-sm">{addon.price}</span>
                </div>
                <p className="text-sm text-gray-500">{addon.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Pricing Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "How do payment terms work?",
                a: "We typically require a 50% deposit to begin work, with the remaining balance due upon launch. For larger projects, we can arrange milestone-based payments.",
              },
              {
                q: "Can I upgrade my plan later?",
                a: "Yes. Many clients start with a smaller package and expand as their business grows. We can scope additional pages, features, or functionality at any time.",
              },
              {
                q: "Are there ongoing fees?",
                a: "The listed prices are one-time project fees. Hosting, domain registration, and any third-party software subscriptions are separate and owned by you. We offer optional monthly maintenance plans.",
              },
              {
                q: "Do you offer discounts for nonprofits?",
                a: "Yes. We offer 15% off for registered nonprofit organizations. Contact us to discuss your project.",
              },
            ].map((faq) => (
              <details key={faq.q} className="bg-gray-50 rounded-xl border border-gray-100 group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-gray-900">
                  {faq.q}
                  <HelpCircle className="w-5 h-5 text-gray-400" />
                </summary>
                <div className="px-6 pb-6 text-gray-500">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to get a custom quote?</h2>
          <p className="text-blue-100 text-lg mb-8">Fill out our project intake form and we'll get back to you with a detailed proposal within 24 hours.</p>
          <Link href="/get-started">
            <Button size="xl" className="bg-white text-blue-700 hover:bg-blue-50">
              Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
