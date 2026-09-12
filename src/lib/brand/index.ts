/**
 * Brand kit generation entry point.
 *
 * Everything here is pure and deterministic — the same intake answers always
 * produce the same kit, so what the client sees in the portal matches the PDF
 * we hand over, and re-running generation never silently changes their brand.
 */

import { buildPalette, type Palette } from "./palette";
import { buildFontPairing, type FontPairing } from "./fonts";
import { buildLogoConcepts, type LogoConcept } from "./logo";

export * from "./palette";
export * from "./fonts";
export * from "./logo";

export type BrandKitInput = {
  businessName: string;
  stylePreferences: string[];
  seedColors: string[];
  logoTypePref?: string | null;
};

export type BrandKit = {
  palette: Palette;
  fonts: FontPairing;
  logos: LogoConcept[];
};

export function generateBrandKit(input: BrandKitInput): BrandKit {
  const styles = Array.isArray(input.stylePreferences) ? input.stylePreferences : [];
  const seed = (Array.isArray(input.seedColors) && input.seedColors[0]) || "#7c3aed";

  const palette = buildPalette(seed, styles);
  const fonts = buildFontPairing(styles);
  const logos = buildLogoConcepts({
    businessName: input.businessName,
    palette,
    fonts,
    preference: input.logoTypePref,
  });

  return { palette, fonts, logos };
}
