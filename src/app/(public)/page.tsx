import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Star,
  ChevronDown,
  Globe,
  ShoppingCart,
  Smartphone,
  Calendar,
  Code2,
  TrendingUp,
  Shield,
  Headphones,
  Award,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Business Websites",
    description: "Professional multi-page websites that establish credibility and generate leads for your business.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Stores",
    description: "Fully featured online stores with secure payments, inventory management, and conversion optimization.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Smartphone,
    title: "Landing Pages",
    description: "High-converting single-page experiences designed to turn visitors into leads or customers.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Calendar,
    title: "Booking Websites",
    description: "Online booking systems for service businesses — salons, consultants, healthcare, and more.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Code2,
    title: "Custom Web Apps",
    description: "Bespoke web applications built to your exact specifications and business workflow.",
    color: "bg-pink-50 text-pink-600",
  },
];

const portfolioProjects = [
  { title: "Hartwell Law Group", category: "Business Website", color: "from-blue-600 to-blue-800" },
  { title: "GreenLeaf Organics", category: "E-Commerce", color: "from-green-600 to-green-800" },
  { title: "Elevate Fitness", category: "Booking System", color: "from-orange-600 to-orange-800" },
  { title: "Crestwood Realty", category: "Business Website", color: "from-purple-600 to-purple-800" },
  { title: "Bliss Beauty Studio", category: "Booking System", color: "from-pink-600 to-pink-800" },
  { title: "TechVault Solutions", category: "Custom Web App", color: "from-slate-600 to-slate-800" },
];

const testimonials = [
  {
    name: "Marcus Chen",
    company: "Hartwell Law Group",
    rating: 5,
    text: "PixelForge Studio delivered a website that completely transformed our online presence. Client inquiries increased by 340% within the first two months.",
  },
  {
    name: "Sarah Beaumont",
    company: "GreenLeaf Organics",
    rating: 5,
    text: "Our e-commerce store is beautiful and our customers love the shopping experience. Revenue doubled in the first quarter after launch.",
  },
  {
    name: "David Okonkwo",
    company: "Elevate Fitness",
    rating: 5,
    text: "The booking system they built is flawless. Our no-show rate dropped 60% and administrative time was cut in half. Worth every penny.",
  },
];

const faqs = [
  {
    q: "How long does it take to build a website?",
    a: "Project timelines vary based on complexity. A standard business website typically takes 3–5 weeks, while e-commerce or custom web applications can take 6–12 weeks. We'll provide a detailed timeline during our discovery call.",
  },
  {
    q: "What information do you need to get started?",
    a: "We'll need your business details, branding assets (logo, colors), content, and a clear picture of your goals. Our intake form guides you through everything we need — it takes about 10 minutes to complete.",
  },
  {
    q: "Do you offer ongoing maintenance and support?",
    a: "Yes. We offer monthly maintenance plans that include security updates, content changes, performance monitoring, and priority support.",
  },
  {
    q: "Will my website work on mobile devices?",
    a: "Absolutely. Every website we build is fully responsive and tested across all major devices and browsers. Mobile performance is a core requirement, not an afterthought.",
  },
  {
    q: "Can I update the website myself after launch?",
    a: "Yes. We build on platforms that give you full control over your content. We also provide training and documentation so you can manage updates independently.",
  },
  {
    q: "Do you work with businesses outside your local area?",
    a: "We work with clients globally. Our process is fully remote-friendly, with clear communication at every stage of the project.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-600 rounded-full filter blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-2 text-sm font-medium text-blue-300 mb-8">
              <Award className="w-4 h-4" />
              Premium Web Development Agency
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              We Build Websites That{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Drive Results
              </span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
              From concept to launch, we craft high-performance websites and web applications
              that grow your business. No templates. No shortcuts. Just exceptional work.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/get-started">
                <Button size="xl" className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/50">
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="xl" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "150+", label: "Projects Delivered" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "5+", label: "Years Experience" },
              { value: "24/7", label: "Support Available" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Build</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Every project is custom-built to match your brand and business goals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Businesses Choose PixelForge Studio
              </h2>
              <p className="text-lg text-gray-500 mb-10">
                We don't just build websites — we build business assets that work around the clock to attract, convert, and retain customers.
              </p>
              <div className="space-y-5">
                {[
                  { icon: TrendingUp, title: "Performance-First Development", desc: "Every line of code is optimized for speed, SEO, and conversion." },
                  { icon: Shield, title: "Security Built-In", desc: "Enterprise-grade security practices on every project we deliver." },
                  { icon: Headphones, title: "Dedicated Support", desc: "Direct access to your project team throughout development and after launch." },
                  { icon: Award, title: "No Templates, Ever", desc: "Every website is designed and built from scratch to your specifications." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-10 text-white">
              <h3 className="text-2xl font-bold mb-8">Our Process</h3>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Discovery", desc: "We learn everything about your business, goals, and audience." },
                  { step: "02", title: "Strategy & Design", desc: "Custom design concepts tailored to your brand identity." },
                  { step: "03", title: "Development", desc: "Clean, fast, and secure code built for performance." },
                  { step: "04", title: "Launch & Support", desc: "Smooth launch with ongoing maintenance and support." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="text-blue-400 font-bold text-sm w-8 flex-shrink-0">{item.step}</div>
                    <div>
                      <div className="font-semibold mb-1">{item.title}</div>
                      <div className="text-slate-400 text-sm">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Recent Work</h2>
              <p className="text-gray-500">A selection of projects we're proud of</p>
            </div>
            <Link href="/portfolio">
              <Button variant="outline">View All Projects</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioProjects.map((project) => (
              <div
                key={project.title}
                className={`bg-gradient-to-br ${project.color} rounded-2xl h-56 flex items-end p-6 text-white group cursor-pointer hover:scale-[1.02] transition-transform`}
              >
                <div>
                  <div className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1">
                    {project.category}
                  </div>
                  <div className="text-xl font-bold">{project.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Client Success Stories</h2>
            <p className="text-gray-500 text-lg">Real results from real businesses</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="bg-white rounded-xl border border-gray-100 group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-gray-900">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-gray-500 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Something Great?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Tell us about your project. Our intake form takes 10 minutes and gives us everything we need to get started.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/get-started">
              <Button size="xl" className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg">
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Talk to Us First
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
