/**
 * Deterministic colour-palette generation.
 *
 * Takes a client's seed colour + chosen style directions and derives a full
 * brand palette using colour-harmony maths. No external API, no cost, and the
 * same input always produces the same palette (important: the client sees the
 * same colours in the portal that we put in the PDF).
 */

export type Hsl = { h: number; s: number; l: number };

export type PaletteColor = {
  name: string;
  hex: string;
  role: string;
  usage: string;
};

export type Palette = {
  seed: string;
  harmony: string;
  colors: PaletteColor[];
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const round = (n: number) => Math.round(n * 100) / 100;

/** Normalise `#abc`, `abc`, `#AABBCC` → `#aabbcc`. Falls back to violet on junk input. */
export function normalizeHex(input: string): string {
  const fallback = "#7c3aed";
  if (!input) return fallback;
  let h = input.trim().replace(/^#/, "").toLowerCase();
  if (/^[0-9a-f]{3}$/.test(h)) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/.test(h)) return fallback;
  return `#${h}`;
}

export function hexToHsl(hex: string): Hsl {
  const h = normalizeHex(hex).slice(1);
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;

  let hue = 0;
  let sat = 0;

  if (delta !== 0) {
    sat = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === r) hue = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
    else if (max === g) hue = ((b - r) / delta + 2) * 60;
    else hue = ((r - g) / delta + 4) * 60;
  }

  return { h: round(hue), s: round(sat * 100), l: round(l * 100) };
}

export function hslToHex({ h, s, l }: Hsl): string {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const lum = clamp(l, 0, 100) / 100;

  const c = (1 - Math.abs(2 * lum - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lum - c / 2;

  let rgb: [number, number, number];
  if (hue < 60) rgb = [c, x, 0];
  else if (hue < 120) rgb = [x, c, 0];
  else if (hue < 180) rgb = [0, c, x];
  else if (hue < 240) rgb = [0, x, c];
  else if (hue < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
}

/** Relative luminance (WCAG) — used to pick readable text colour over a swatch. */
export function luminance(hex: string): number {
  const h = normalizeHex(hex).slice(1);
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const r = channel(parseInt(h.slice(0, 2), 16));
  const g = channel(parseInt(h.slice(2, 4), 16));
  const b = channel(parseInt(h.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Returns `#ffffff` or `#0b0b12`, whichever is more readable on `hex`. */
export function readableOn(hex: string): string {
  return luminance(hex) > 0.45 ? "#0b0b12" : "#ffffff";
}

type HarmonyName = "analogous" | "complementary" | "triadic" | "monochrome";

/**
 * Style directions map to colour harmonies. Where a client picks several
 * styles, the first recognised one wins so results stay predictable.
 */
function harmonyForStyles(styles: string[]): HarmonyName {
  const map: Record<string, HarmonyName> = {
    bold: "complementary",
    playful: "triadic",
    modern: "analogous",
    friendly: "analogous",
    luxury: "monochrome",
    elegant: "monochrome",
    classic: "monochrome",
    minimal: "monochrome",
    technical: "analogous",
    corporate: "analogous",
    natural: "analogous",
  };
  for (const s of styles) {
    const hit = map[String(s).toLowerCase()];
    if (hit) return hit;
  }
  return "analogous";
}

function accentHue(base: number, harmony: HarmonyName): number {
  switch (harmony) {
    case "complementary":
      return base + 180;
    case "triadic":
      return base + 120;
    case "monochrome":
      return base;
    case "analogous":
    default:
      return base + 24;
  }
}

/**
 * Build the full brand palette.
 *
 * Always returns six roles in a fixed order so the brand guide, the portal and
 * the PDF can rely on the shape.
 */
export function buildPalette(seedInput: string, styles: string[] = []): Palette {
  const seed = normalizeHex(seedInput);
  const harmony = harmonyForStyles(styles);
  const base = hexToHsl(seed);

  // Keep the primary usable: very pale or near-black seeds get pulled into a
  // workable range rather than producing an unusable brand colour.
  const primary: Hsl = {
    h: base.h,
    s: clamp(base.s < 12 ? 12 : base.s, 12, 92),
    l: clamp(base.l, 32, 62),
  };

  // Accent and highlight are deliberately desaturated relative to the primary.
  // A secondary colour at full saturation reads neon rather than designed, and
  // a highly saturated seed would otherwise produce an unusable pair.
  const accent: Hsl = {
    h: accentHue(primary.h, harmony),
    s: clamp(primary.s * 0.82, 20, 70),
    l: clamp(harmony === "monochrome" ? primary.l + 16 : primary.l + 4, 34, 58),
  };

  const highlight: Hsl = {
    // Sits just past the accent — a related tint, not a third direction.
    h: accent.h + 8,
    s: clamp(primary.s * 0.66, 18, 60),
    l: clamp(primary.l + 26, 55, 78),
  };

  // Neutrals carry a hint of the brand hue so they feel designed, not default.
  const ink: Hsl = { h: primary.h, s: 18, l: 8 };
  const surface: Hsl = { h: primary.h, s: 16, l: 97 };
  const muted: Hsl = { h: primary.h, s: 10, l: 52 };

  const colors: PaletteColor[] = [
    {
      name: "Primary",
      hex: hslToHex(primary),
      role: "primary",
      usage: "Main brand colour — logo, primary buttons, key headings and links.",
    },
    {
      name: "Accent",
      hex: hslToHex(accent),
      role: "accent",
      usage: "Secondary actions, highlights, icons and hover states.",
    },
    {
      name: "Highlight",
      hex: hslToHex(highlight),
      role: "highlight",
      usage: "Badges, callouts and small emphasis details. Use sparingly.",
    },
    {
      name: "Ink",
      hex: hslToHex(ink),
      role: "ink",
      usage: "Body text and dark backgrounds. Your default text colour.",
    },
    {
      name: "Surface",
      hex: hslToHex(surface),
      role: "surface",
      usage: "Page and card backgrounds. Keeps layouts light and readable.",
    },
    {
      name: "Muted",
      hex: hslToHex(muted),
      role: "muted",
      usage: "Secondary text, borders, dividers and disabled states.",
    },
  ];

  return { seed, harmony, colors };
}

/** Convenience lookup so callers don't index by position. */
export function colorByRole(palette: Palette, role: string): string {
  return palette.colors.find((c) => c.role === role)?.hex ?? palette.colors[0].hex;
}
