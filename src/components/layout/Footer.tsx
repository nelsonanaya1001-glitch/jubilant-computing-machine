import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#080810] border-t border-white/5 text-white/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 bg-violet-500 rounded-md rotate-12" />
              <span className="font-bold text-white text-lg tracking-tight">
                launch<span className="text-violet-400">boarding</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              We design and build websites that make a real business impact — not just pretty pages.
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              {["Business Websites", "E-Commerce", "Landing Pages", "Booking Systems"].map((s) => (
                <li key={s}><Link href="/services" className="hover:text-white transition-colors">{s}</Link></li>
              ))}
              <li><Link href="/brand" className="hover:text-white transition-colors">Brand &amp; Identity</Link></li>
              <li><Link href="/ads" className="hover:text-white transition-colors">Meta Ads</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Our Work", href: "/portfolio" },
                { label: "Pricing", href: "/pricing" },
                { label: "Contact", href: "/contact" },
                { label: "Start a Project", href: "/get-started" },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="mailto:hello@launchboarding.co" className="hover:text-white transition-colors">hello@launchboarding.co</a></li>
              <li><a href="tel:+17865015600" className="hover:text-white transition-colors">+1 (786) 501-5600</a></li>
              <li>Remote — Worldwide</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Launchboarding. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
