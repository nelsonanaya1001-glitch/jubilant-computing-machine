"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-black/95 backdrop-blur-md border-b border-white/5 shadow-xl shadow-black/20"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="w-7 h-7 bg-violet-500 rounded-md rotate-12 group-hover:rotate-0 transition-transform duration-200" />
            <span className="font-bold text-white text-lg tracking-tight">
              launch<span className="text-violet-400">board</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/5">
                Sign In
              </Button>
            </Link>
            <Link href="/get-started">
              <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white border-0 shadow-lg shadow-violet-900/30">
                Start a Project
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-white/60 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-white/5 px-6 py-5 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-white/60 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
            <Link href="/login"><Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5" size="sm">Sign In</Button></Link>
            <Link href="/get-started"><Button className="w-full bg-violet-600 hover:bg-violet-500" size="sm">Start a Project</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
}
