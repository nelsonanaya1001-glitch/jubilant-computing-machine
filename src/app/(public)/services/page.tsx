import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, ShoppingCart, Smartphone, Calendar, Check, ArrowRight, ArrowUpRight } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Business Websites",
    tagline: "Establish credibility. Generate leads.",
    description:
      "Your website is the first impression most customers get of your business. We build professional, fast, and striking sites that communicate your value and turn visitors into leads.",
    features: [
      "Custom design aligned to your brand",
      "Mobile-first, fully responsive",
      "SEO-optimized structure",
      "Contact forms & lead capture",
      "Google Maps integration",
      "Performance optimization",
    ],
    accent: "#4f46e5",
    price: "399",
  },
  {
    icon: Smartphone,
    title: "Landing Pages",
    tagline: "Focus. Convert. Dominate.",
    description:
      "A high-performance page focused on a single goal: converting visitors. Whether you're running ads or launching a product, we build pages engineered to maximize your return.",
    features: [
      "Single-purpose conversion design",
      "A/B testing ready",
      "Sub-2 second load speed",
      "Lead capture & CRM integration",
      "Pixel & analytics tracking",
      "Mobile and desktop optimized",
    ],
    accent: "#16a34a",
    price: "399",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Stores",
    tagline: "Sell online. Scale revenue.",
    description:
      "We build high-converting online stores that make purchasing easy and enjoyable. From product pages to checkout, every element is designed to maximize sales.",
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
    accent: "#db2777",
    price: "549",
  },
  {
    icon: Calendar,
    title: "Booking Websites",
    tagline: "Fill your calendar. Cut no-shows.",
    description:
      "Perfect for service businesses — salons, consultants, healthcare, fitness studios, and more. We build booking systems that let clients self-schedule 24/7.",
    features: [
      "Online appointment scheduling",
      "Automated confirmations & reminders",
      "Staff & resource management",
      "Payment collection at booking",
      "Calendar sync (Google, Outlook)",
      "Secure database included",
      "Client account portal",
    ],
    accent: "#ea580c",
    price: "549",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full filter blur-[120px]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-40 pb-24">
          <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">What we do</div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 max-w-3xl leading-[0.95]">
            Built from scratch.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Never templated.</span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl leading-relaxed">
            Every project is custom-built for your business and audience. Pick the service that fits — we'll handle the rest.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors overflow-hidden"
              >
                <div
                  className="absolute -top-20 -right-20 w-48 h-48 rounded-full filter blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: service.accent + "33" }}
                />
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: service.accent + "1a", color: service.accent }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{service.title}</h3>
                  <p className="text-sm font-medium mb-4" style={{ color: service.accent }}>{service.tagline}</p>
                  <p className="text-white/40 text-sm leading-relaxed mb-6">{service.description}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                        <Check className="w-4 h-4 flex-shrink-0" style={{ color: service.accent }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div>
                      <span className="text-xs text-white/30">Starting at</span>
                      <div className="text-2xl font-black text-white">${service.price}</div>
                    </div>
                    <Link href="/get-started">
                      <Button className="bg-violet-600 hover:bg-violet-500 text-white border-0">
                        Get Started <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-[0.95]">
            Not sure which
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">you need?</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-lg mx-auto">
            Tell us about your business and goals. We'll recommend the right fit — no pressure.
          </p>
          <Link href="/get-started">
            <Button size="xl" className="bg-violet-600 hover:bg-violet-500 text-white border-0 shadow-2xl shadow-violet-900/40 group">
              Start the Conversation
              <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
