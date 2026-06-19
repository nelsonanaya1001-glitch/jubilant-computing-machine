import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Hartwell Law Group",
    category: "Business Website",
    description: "Complete brand refresh and website rebuild for a mid-size law firm. Included attorney profiles, practice area pages, and lead capture system.",
    color: "from-blue-600 to-blue-800",
    result: "+340% qualified leads",
    tags: ["Business Website", "Lead Generation", "SEO"],
  },
  {
    title: "GreenLeaf Organics",
    category: "E-Commerce",
    description: "Custom e-commerce platform for an organic food brand. Built with subscription management, product bundling, and loyalty rewards.",
    color: "from-green-600 to-green-800",
    result: "+200% online revenue",
    tags: ["E-Commerce", "Subscriptions", "Shopify"],
  },
  {
    title: "Elevate Fitness Studio",
    category: "Booking System",
    description: "Full booking system and membership portal for a boutique fitness studio. Class scheduling, payment processing, and trainer management.",
    color: "from-orange-600 to-orange-800",
    result: "-60% no-show rate",
    tags: ["Booking", "Membership", "Payments"],
  },
  {
    title: "Crestwood Realty Group",
    category: "Business Website",
    description: "Modern property search website with MLS integration, agent profiles, and automated listing updates.",
    color: "from-purple-600 to-purple-800",
    result: "+180% property inquiries",
    tags: ["Real Estate", "MLS Integration", "Search"],
  },
  {
    title: "Bliss Beauty Studio",
    category: "Booking System",
    description: "Online booking platform for a full-service salon. Service menus, stylist selection, and automated appointment reminders.",
    color: "from-pink-600 to-pink-800",
    result: "+45% booking volume",
    tags: ["Booking", "Beauty", "Automations"],
  },
  {
    title: "Meridian Medical Clinic",
    category: "Booking System",
    description: "HIPAA-compliant patient intake and appointment scheduling platform. Integrated with existing EHR system.",
    color: "from-teal-600 to-teal-800",
    result: "+55% new patient bookings",
    tags: ["Healthcare", "Compliance", "Booking"],
  },
  {
    title: "Luminary Creative Agency",
    category: "Business Website",
    description: "Portfolio and case study showcase for a creative agency. Animated transitions, video backgrounds, and CMS integration.",
    color: "from-indigo-600 to-indigo-800",
    result: "+290% time on site",
    tags: ["Portfolio", "Creative", "Animation"],
  },
  {
    title: "Fresh Plates Catering",
    category: "E-Commerce",
    description: "Online ordering system for a corporate catering company. Group ordering, dietary filters, and office delivery scheduling.",
    color: "from-yellow-600 to-yellow-800",
    result: "+160% online orders",
    tags: ["Food", "E-Commerce", "Ordering"],
  },
];

export default function PortfolioPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Work</h1>
          <p className="text-xl text-slate-300">
            Every project below represents a real business challenge solved with thoughtful design and clean code.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.title}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div
                  className={`bg-gradient-to-br ${project.color} h-48 flex items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent)]" />
                  <div className="text-white text-center px-6">
                    <div className="text-xs font-medium text-white/60 uppercase tracking-widest mb-2">
                      {project.category}
                    </div>
                    <div className="text-2xl font-bold">{project.title}</div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{project.description}</p>
                  <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-2 text-sm font-semibold text-green-700 mb-4">
                    Result: {project.result}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Your project could be next</h2>
          <p className="text-gray-500 text-lg mb-8">
            We'd love to learn about your business and show you what we can build together.
          </p>
          <Link href="/get-started">
            <Button size="xl">
              Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
