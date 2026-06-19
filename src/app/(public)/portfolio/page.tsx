import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "InvestingHouse",
    category: "Landing Page",
    description: "High-converting landing page for a logistics & freight investment company. Clean, professional design built to establish authority and capture leads.",
    url: "https://investinghouse.net",
    tags: ["Landing Page", "Logistics", "Lead Generation"],
  },
  {
    title: "El Barullo",
    category: "Landing Page",
    description: "Modern landing page for a logistics & transportation company. Focused on brand credibility and converting visitors into clients.",
    url: "https://elbarullo.com",
    tags: ["Landing Page", "Logistics", "Branding"],
  },
];

export default function PortfolioPage() {
  return (
    <div className="bg-black text-white">
      {/* Hero */}
      <section className="relative py-28 border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-violet-600/10 rounded-full filter blur-[100px]" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-4">Portfolio</div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">Our Work</h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Real projects. Real businesses. Built to convert.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
            {projects.map((project) => (
              <div
                key={project.title}
                className="group w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-all duration-300"
              >
                {/* Live preview */}
                <div className="relative w-full h-56 overflow-hidden bg-white/5">
                  <iframe
                    src={project.url}
                    title={project.title}
                    className="w-full h-full border-0 pointer-events-none scale-[0.6] origin-top-left"
                    style={{ width: "166.67%", height: "166.67%", transform: "scale(0.6)", transformOrigin: "top left" }}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin"
                  />
                  <div className="absolute inset-0" />
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-1">{project.category}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="bg-white/5 border border-white/10 text-white/50 text-xs px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
                  >
                    Visit site <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Your project could be next</h2>
          <p className="text-white/40 text-lg mb-8">
            We'd love to learn about your business and show you what we can build together.
          </p>
          <Link href="/get-started">
            <Button size="xl" className="bg-violet-600 hover:bg-violet-500 text-white border-0">
              Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
