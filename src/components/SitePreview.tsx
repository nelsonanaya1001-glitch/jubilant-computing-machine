"use client";

import { useState } from "react";

/**
 * Screenshot providers, tried in order. Free, no API key.
 * If one fails to render we fall through to the next, and if all of them fail
 * we draw a branded card instead — a portfolio should never show a broken image.
 */
const PROVIDERS: ((url: string) => string)[] = [
  (url) => `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1200&h=900`,
  (url) => `https://image.thum.io/get/width/1200/crop/900/noanimate/${url}`,
  (url) =>
    `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`,
];

/** Deterministic gradient per site, so the fallback still looks designed. */
const GRADIENTS = [
  "from-violet-600 to-indigo-800",
  "from-fuchsia-600 to-purple-800",
  "from-sky-600 to-blue-800",
  "from-emerald-600 to-teal-800",
  "from-amber-600 to-orange-800",
  "from-rose-600 to-pink-800",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function hostOf(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function SitePreview({
  url,
  title,
  /** Optional local screenshot (e.g. "/previews/example.png") — always wins. */
  image,
  className = "",
}: {
  url: string;
  title: string;
  image?: string;
  className?: string;
}) {
  const [attempt, setAttempt] = useState(0);
  const exhausted = attempt >= PROVIDERS.length;

  if (!image && exhausted) {
    const grad = GRADIENTS[hash(title) % GRADIENTS.length];
    return (
      <div
        className={`absolute inset-0 w-full h-full bg-gradient-to-br ${grad} flex flex-col items-center justify-center gap-2 px-4 text-center`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.18),transparent_60%)]" />
        <span className="relative text-lg font-black text-white drop-shadow">{title}</span>
        <span className="relative text-[11px] font-medium text-white/70">{hostOf(url)}</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image ?? PROVIDERS[attempt](url)}
      alt={`${title} website preview`}
      loading="lazy"
      onError={() => {
        if (!image) setAttempt((a) => a + 1);
      }}
      className={className}
    />
  );
}
