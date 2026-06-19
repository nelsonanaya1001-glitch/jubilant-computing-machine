import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PixelForge Studio | Premium Web Development Agency",
  description:
    "PixelForge Studio builds high-performance, conversion-focused websites for ambitious businesses. Custom web development, e-commerce, and digital experiences.",
  keywords: "web development, web design, custom websites, e-commerce, digital agency",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
