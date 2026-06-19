import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Launchboard | Web Development That Converts",
  description:
    "Launchboard builds high-performance websites for ambitious businesses. No templates. No shortcuts.",
  keywords: "web development, web design, custom websites, e-commerce, digital agency",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
