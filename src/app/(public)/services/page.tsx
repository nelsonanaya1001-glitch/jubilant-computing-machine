import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, ShoppingCart, Smartphone, Calendar, Code2, CheckCircle, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Business Websites",
    tagline: "Establish credibility. Generate leads. Grow your brand.",
    description:
      "Your website is often the first impression a potential customer has of your business. We build professional, fast, and visually striking websites that communicate your value and convert visitors into leads.",
    features: [
      "Custom design aligned to your brand identity",
      "Mobile-first, fully responsive layout",
      "SEO-optimized structure and content",
      "Contact forms and lead capture",
      "Google Maps integration",
      "Fast load times and performance optimization",
    ],
    color: "from-blue-600 to-blue-800",
    startingAt: "2,500",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Stores",
    tagline: "Sell online. Scale your revenue. Own your store.",
    description:
      "We build high-converting online stores that make purchasing easy and enjoyable for your customers. From product pages to checkout, every element is designed to maximize sales.",
    features: [
      "Custom storefront design",
      "Secure payment gateway integration",
      "Product catalog and inventory management",
      "Shopping cart and checkout optimization",
      "Order management and email notifications",
      "Mobile shopping experience",
    ],
    color: "from-purple-600 to-purple-800",
    startingAt: "4,500",
  },
  {
    icon: Smartphone,
    title: "Landing Pages",
    tagline: "Focus. Convert. Dominate your market.",
    description:
      "A high-performance landing page focused on a single goal: converting visitors. Whether you're running ads or launching a product, we build pages engineered to maximize your ROI.",
    features: [
      "Single-purpose conversion design",
      "A/B testing ready structure",
      "Fast load speed (sub-2 second target)",
      "Lead capture and CRM integration",
      "Pixel and analytics tracking setup",
      "Mobile and desktop optimized",
    ],
    color: "from-green-600 to-green-800",
    startingAt: "1,200",
  },
  {
    icon: Calendar,
    title: "Booking Websites",
    tagline: "Fill your calendar. Reduce no-shows. Streamline operations.",
    description:
      "Perfect for service businesses — salons, consultants, healthcare providers, fitness studios, and more. We build booking systems that let clients self-schedule 24/7.",
    features: [
      "Online booking and appointment scheduling",
      "Automated confirmation and reminder emails",
      "Staff and resource management",
      "Payment collection at booking",
      "Calendar sync (Google, Outlook)",
      "Client account portal",
    ],
    color: "from-orange-600 to-orange-800",
    startingAt: "3,500",
  },
  {
    icon: Code2,
    title: "Custom Web Applications",
    tagline: "Your workflow. Digitized. Perfected.",
    description:
      "When off-the-shelf software doesn't cut it, we build bespoke web applications tailored to your exact business processes. From internal tools to client-facing platforms.",
    features: [
      "Full-stack custom development",
      "User authentication and role management",
      "Database design and architecture",
      "Third-party API integrations",
      "Admin dashboards and reporting",
      "Scalable, cloud-ready infrastructure",
    ],
    color: "from-slate-600 to-slate-800",
    startingAt: "8,000",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">What We Build</h1>
          <p className="text-xl text-slate-300">
            Every project is custom-built from the ground up. We don't use templates — we craft digital experiences designed specifically for your business and audience.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;
              return (
                <div
                  key={service.title}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isEven ? "" : "lg:flex-row-reverse"}`}
                >
                  <div className={isEven ? "order-1" : "order-1 lg:order-2"}>
                    <div className={`bg-gradient-to-br ${service.color} rounded-3xl p-12 text-white h-80 flex items-center justify-center`}>
                      <Icon className="w-24 h-24 opacity-80" />
                    </div>
                  </div>
                  <div className={isEven ? "order-2" : "order-2 lg:order-1"}>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h2>
                    <p className="text-blue-600 font-semibold mb-4">{service.tagline}</p>
                    <p className="text-gray-500 leading-relaxed mb-6">{service.description}</p>
                    <ul className="space-y-2 mb-8">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-4">
                      <Link href="/get-started">
                        <Button>
                          Get Started <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                      <span className="text-sm text-gray-500">
                        Starting at <span className="font-semibold text-gray-900">${service.startingAt}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-blue-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Not sure which service you need?</h2>
          <p className="text-blue-100 text-lg mb-8">
            Tell us about your business and goals. We'll recommend the right solution.
          </p>
          <Link href="/get-started">
            <Button size="xl" className="bg-white text-blue-700 hover:bg-blue-50">
              Start the Conversation <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
