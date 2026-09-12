"use client";

import { Download } from "lucide-react";

/**
 * Triggers the browser's print dialog, which offers "Save as PDF" on every
 * major platform. Chosen over server-side PDF rendering deliberately: it needs
 * no headless-Chromium dependency on Vercel, and it keeps the logo as true
 * vector in the exported file rather than rasterising it.
 */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700"
    >
      <Download className="h-4 w-4" />
      Download PDF
    </button>
  );
}
