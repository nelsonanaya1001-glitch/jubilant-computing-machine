import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Launchboarding | Business Startup",
  description:
    "Launchboarding helps you start and grow a business — websites that convert, branding people remember, and ads that bring in real customers.",
  keywords:
    "business startup, start a business, small business growth, web design, branding, logo design, meta ads, facebook ads",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
