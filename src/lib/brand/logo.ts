/**
 * Templated SVG logo-concept generator.
 *
 * Produces clean, editable *vector* concepts from the intake answers. Chosen
 * over AI image generation deliberately: output is real SVG (not raster), text
 * never comes out garbled, it costs nothing per generation, and the winning
 * concept can be refined by hand before delivery.
 */

import type { Palette } from "./palette";
import { colorByRole, readableOn } from "./palette";
import type { FontPairing } from "./fonts";

export type LogoKind = "monogram" | "wordmark" | "lockup" | "badge";

export type LogoConcept = {
  id: string;
  label: string;
  kind: LogoKind;
  description: string;
  svg: string;
};

export type LogoInput = {
  businessName: string;
  palette: Palette;
  fonts: FontPairing;
  /** wordmark | monogram | icon-wordmark | no-preference */
  preference?: string | null;
};

/** XML-escape any text that goes inside an SVG node. */
function esc(value: string): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Stable hash so a given business name always yields the same mark geometry. */
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/** First letters of up to two significant words, e.g. "Founders Distribution" → "FD". */
export function initials(name: string): string {
  const skip = new Set(["the", "a", "an", "of", "and", "&", "for", "llc", "inc", "co"]);
  const words = name
    .replace(/[^\p{L}\p{N}\s&]/gu, " ")
    .split(/\s+/)
    .filter((w) => w && !skip.has(w.toLowerCase()));

  if (words.length === 0) return name.slice(0, 2).toUpperCase() || "BR";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Split a name into two lines for stacked lockups. */
function splitName(name: string): [string, string | null] {
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return [name, null];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

const SVG_OPEN = (viewBox: string, label: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${esc(label)}" preserveAspectRatio="xMidYMid meet">`;

/** Abstract geometric marks, selected deterministically from the business name. */
function geometricMark(variant: number, primary: string, accent: string): string {
  const marks = [
    // Overlapping circles — partnership / connection
    `<circle cx="34" cy="50" r="22" fill="${primary}"/><circle cx="58" cy="50" r="22" fill="${accent}" fill-opacity="0.85"/>`,
    // Ascending bars — growth
    `<rect x="16" y="54" width="14" height="26" rx="4" fill="${primary}"/><rect x="38" y="38" width="14" height="42" rx="4" fill="${primary}"/><rect x="60" y="20" width="14" height="60" rx="4" fill="${accent}"/>`,
    // Chevron stack — momentum
    `<path d="M20 62 L46 32 L72 62" fill="none" stroke="${primary}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 80 L46 50 L72 80" fill="none" stroke="${accent}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`,
    // Rotated square in ring — precision
    `<circle cx="46" cy="50" r="30" fill="none" stroke="${primary}" stroke-width="9"/><rect x="32" y="36" width="28" height="28" rx="5" fill="${accent}" transform="rotate(45 46 50)"/>`,
    // Quadrant grid — structure
    `<rect x="16" y="20" width="27" height="27" rx="6" fill="${primary}"/><rect x="49" y="20" width="27" height="27" rx="6" fill="${accent}"/><rect x="16" y="53" width="27" height="27" rx="6" fill="${accent}" fill-opacity="0.6"/><rect x="49" y="53" width="27" height="27" rx="6" fill="${primary}"/>`,
    // Arc + dot — launch / trajectory
    `<path d="M18 78 Q46 14 76 42" fill="none" stroke="${primary}" stroke-width="10" stroke-linecap="round"/><circle cx="76" cy="42" r="12" fill="${accent}"/>`,
  ];
  return marks[variant % marks.length];
}

function monogramRounded(input: LogoInput): LogoConcept {
  const primary = colorByRole(input.palette, "primary");
  const accent = colorByRole(input.palette, "accent");
  const fg = readableOn(primary);
  const text = initials(input.businessName);

  const svg =
    SVG_OPEN("0 0 200 200", `${input.businessName} monogram`) +
    `<rect width="200" height="200" rx="44" fill="${primary}"/>` +
    `<circle cx="158" cy="42" r="14" fill="${accent}"/>` +
    `<text x="100" y="100" text-anchor="middle" dominant-baseline="central" ` +
    `font-family="${esc(input.fonts.heading)}, system-ui, sans-serif" font-weight="${input.fonts.headingWeight}" ` +
    `font-size="88" letter-spacing="-2" fill="${fg}">${esc(text)}</text>` +
    `</svg>`;

  return {
    id: "monogram-rounded",
    label: "Rounded monogram",
    kind: "monogram",
    description:
      "A compact app-style mark. Works as a favicon, social avatar and profile picture without any modification.",
    svg,
  };
}

function monogramCircle(input: LogoInput): LogoConcept {
  const primary = colorByRole(input.palette, "primary");
  const accent = colorByRole(input.palette, "accent");
  const text = initials(input.businessName);

  const svg =
    SVG_OPEN("0 0 200 200", `${input.businessName} circular monogram`) +
    `<circle cx="100" cy="100" r="94" fill="none" stroke="${primary}" stroke-width="10"/>` +
    `<circle cx="100" cy="100" r="74" fill="${accent}" fill-opacity="0.12"/>` +
    `<text x="100" y="100" text-anchor="middle" dominant-baseline="central" ` +
    `font-family="${esc(input.fonts.heading)}, system-ui, sans-serif" font-weight="${input.fonts.headingWeight}" ` +
    `font-size="78" letter-spacing="-1" fill="${primary}">${esc(text)}</text>` +
    `</svg>`;

  return {
    id: "monogram-circle",
    label: "Circular monogram",
    kind: "monogram",
    description:
      "A lighter, more classic take on the monogram. Reads well stamped over photography or on packaging.",
    svg,
  };
}

function wordmark(input: LogoInput): LogoConcept {
  const primary = colorByRole(input.palette, "primary");
  const accent = colorByRole(input.palette, "accent");
  const name = input.businessName.trim();
  // Long names need a smaller size to stay inside the viewBox.
  const size = name.length > 18 ? 40 : name.length > 12 ? 50 : 62;

  const svg =
    SVG_OPEN("0 0 520 140", `${name} wordmark`) +
    `<text x="28" y="70" dominant-baseline="central" ` +
    `font-family="${esc(input.fonts.heading)}, system-ui, sans-serif" font-weight="${input.fonts.headingWeight}" ` +
    `font-size="${size}" letter-spacing="-1.5" fill="${primary}">${esc(name)}</text>` +
    `<rect x="28" y="98" width="86" height="8" rx="4" fill="${accent}"/>` +
    `</svg>`;

  return {
    id: "wordmark",
    label: "Wordmark",
    kind: "wordmark",
    description:
      "Your name set as the logo, with an accent rule for emphasis. The strongest option for building name recognition.",
    svg,
  };
}

function iconWordmark(input: LogoInput): LogoConcept {
  const primary = colorByRole(input.palette, "primary");
  const accent = colorByRole(input.palette, "accent");
  const name = input.businessName.trim();
  const variant = hash(name) % 6;
  const size = name.length > 18 ? 34 : name.length > 12 ? 40 : 48;

  const svg =
    SVG_OPEN("0 0 560 120", `${name} logo`) +
    `<g transform="translate(10, 10) scale(1)">${geometricMark(variant, primary, accent)}</g>` +
    `<text x="118" y="60" dominant-baseline="central" ` +
    `font-family="${esc(input.fonts.heading)}, system-ui, sans-serif" font-weight="${input.fonts.headingWeight}" ` +
    `font-size="${size}" letter-spacing="-1" fill="${primary}">${esc(name)}</text>` +
    `</svg>`;

  return {
    id: "icon-wordmark",
    label: "Icon + wordmark lockup",
    kind: "lockup",
    description:
      "A distinct symbol beside your name. The symbol can later stand on its own for app icons and social avatars.",
    svg,
  };
}

function stackedLockup(input: LogoInput): LogoConcept {
  const primary = colorByRole(input.palette, "primary");
  const accent = colorByRole(input.palette, "accent");
  const muted = colorByRole(input.palette, "muted");
  const [line1, line2] = splitName(input.businessName.trim());
  const variant = hash(input.businessName + "s") % 6;

  const svg =
    SVG_OPEN("0 0 360 300", `${input.businessName} stacked logo`) +
    `<g transform="translate(130, 18) scale(1.05)">${geometricMark(variant, primary, accent)}</g>` +
    `<text x="180" y="182" text-anchor="middle" ` +
    `font-family="${esc(input.fonts.heading)}, system-ui, sans-serif" font-weight="${input.fonts.headingWeight}" ` +
    `font-size="40" letter-spacing="-1" fill="${primary}">${esc(line1)}</text>` +
    (line2
      ? `<text x="180" y="228" text-anchor="middle" font-family="${esc(input.fonts.body)}, system-ui, sans-serif" ` +
        `font-weight="${input.fonts.bodyWeight}" font-size="24" letter-spacing="6" fill="${muted}">${esc(
          line2.toUpperCase()
        )}</text>`
      : "") +
    `<rect x="150" y="256" width="60" height="6" rx="3" fill="${accent}"/>` +
    `</svg>`;

  return {
    id: "stacked",
    label: "Stacked lockup",
    kind: "lockup",
    description:
      "A vertical arrangement for square spaces — signage, packaging, merchandise and centred website headers.",
    svg,
  };
}

function badge(input: LogoInput): LogoConcept {
  const primary = colorByRole(input.palette, "primary");
  const accent = colorByRole(input.palette, "accent");
  const fg = readableOn(primary);
  const text = initials(input.businessName);
  const name = input.businessName.trim().toUpperCase();

  const svg =
    SVG_OPEN("0 0 220 220", `${input.businessName} badge`) +
    `<circle cx="110" cy="110" r="106" fill="${primary}"/>` +
    `<circle cx="110" cy="110" r="88" fill="none" stroke="${accent}" stroke-width="3" stroke-opacity="0.65"/>` +
    `<text x="110" y="102" text-anchor="middle" dominant-baseline="central" ` +
    `font-family="${esc(input.fonts.heading)}, system-ui, sans-serif" font-weight="${input.fonts.headingWeight}" ` +
    `font-size="62" fill="${fg}">${esc(text)}</text>` +
    `<text x="110" y="152" text-anchor="middle" dominant-baseline="central" ` +
    `font-family="${esc(input.fonts.body)}, system-ui, sans-serif" font-weight="600" ` +
    `font-size="13" letter-spacing="3" fill="${fg}" fill-opacity="0.75">${esc(
      name.length > 22 ? name.slice(0, 22) : name
    )}</text>` +
    `</svg>`;

  return {
    id: "badge",
    label: "Badge",
    kind: "badge",
    description:
      "A self-contained seal. Suits hospitality, trades and craft businesses, and stamps cleanly onto physical products.",
    svg,
  };
}

/**
 * Generate the concept set. Honours the client's stated preference by ordering
 * matching concepts first, but always returns the full set so they have real
 * choice (and so we have options to refine).
 */
export function buildLogoConcepts(input: LogoInput): LogoConcept[] {
  const all = [
    monogramRounded(input),
    wordmark(input),
    iconWordmark(input),
    stackedLockup(input),
    monogramCircle(input),
    badge(input),
  ];

  const pref = (input.preference || "no-preference").toLowerCase();
  const rank = (c: LogoConcept) => {
    if (pref === "monogram") return c.kind === "monogram" ? 0 : 1;
    if (pref === "wordmark") return c.kind === "wordmark" ? 0 : 1;
    if (pref === "icon-wordmark") return c.kind === "lockup" ? 0 : 1;
    return 0;
  };

  // Stable sort: preferred kinds float to the top, original order preserved otherwise.
  return all
    .map((c, i) => ({ c, i }))
    .sort((a, b) => rank(a.c) - rank(b.c) || a.i - b.i)
    .map(({ c }) => c);
}
