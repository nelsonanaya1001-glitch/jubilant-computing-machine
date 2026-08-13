import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "InvestingHouse",
    category: "Landing Page",
    description: "High-converting landing page for a logistics & freight investment company. Clean, professional design built to establish authority and capture leads.",
    url: "https://investinghouse.net",
    domain: "investinghouse.net",
    grad: "from-blue-600 to-indigo-800",
    tags: ["Landing Page", "Logistics", "Lead Generation"],
  },
  {
    title: "El Barullo",
    category: "Landing Page",
    description: "Modern landing page for a logistics & transportation company. Focused on brand credibility and converting visitors into clients.",
    url: "https://elbarullo.com",
    domain: "elbarullo.com",
    grad: "from-red-700 to-rose-900",
    tags: ["Landing Page", "Logistics", "Branding"],
  },
  {
    title: "Motorland MIA",
    category: "E-Commerce Store",
    description: "Full e-commerce storefront for an automotive parts & accessories dealer. Built for browsing, filtering, and purchasing with a seamless checkout experience.",
    url: "https://motorlandmia.com",
    domain: "motorlandmia.com",
    grad: "from-red-600 to-zinc-900",
    tags: ["E-Commerce", "Automotive", "Store"],
  },
  {
    title: "Founders Distribution",
    category: "Business Website",
    description: "Professional website for a wholesale distribution company. Built to showcase products, establish credibility, and connect with retail partners.",
    url: "https://foundersdistribution.com",
    domain: "foundersdistribution.com",
    grad: "from-amber-600 to-orange-800",
    tags: ["Business Website", "Distribution", "Wholesale"],
  },
];

function faviconUrl(domain: string) {
  return `https://www.google.com/s/2/favicons?domain=${domain}&sz=128`;
}

export default function PortfolioPage() {
  return (
    <div className="bg-[#080810] text-white">
      {/* Hero */}
      <section className="relative py-28 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080810] via-transparent to-[#080810]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/15 rounded-full filter blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-fuchsia-600/10 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] bg-pink-600/8 rounded-full filter blur-[100px]" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="text-xs font-semibold text-fuchsia-400 uppercase tracking-widest mb-4">Portfolio</div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">Our Work</h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Real projects. Real businesses. Built to convert.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-600/5 rounded-full filter blur-[100px]" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
            {projects.map((project) => (
              <div
                key={project.title}
                className="group w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-all duration-300"
              >
                {/* Logo preview */}
                <a href={project.url} target="_blank" rel="noopener noreferrer" className={`block relative w-full h-52 overflow-hidden bg-gradient-to-br ${project.grad} flex flex-col items-center justify-center gap-4`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.15),transparent_60%)]" />
                  <div className="relative w-20 h-20 rounded-2xl bg-white/95 flex items-center justify-center shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={faviconUrl(project.domain)}
                      alt={`${project.title} logo`}
                      width={56}
                      height={56}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="relative text-white font-black text-xl tracking-tight drop-shadow-md">{project.title}</div>
                </a>

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
      <section className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-fuchsia-900/10 to-pink-900/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-violet-600/15 rounded-full filter blur-[80px]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Your project could be next</h2>
          <p className="text-white/40 text-lg mb-8">
            We'd love to learn about your business and show you what we can build together.
          </p>
          <Link href="/get-started">
            <Button size="xl" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0 shadow-2xl shadow-violet-900/50">
              Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
