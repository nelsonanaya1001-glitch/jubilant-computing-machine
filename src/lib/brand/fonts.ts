/**
 * Curated Google Font pairings, bucketed by style direction.
 *
 * All families are Google Fonts, so they're free to use commercially and can be
 * embedded in the client's site with a single stylesheet link — no licensing
 * admin for us or them.
 */

export type FontPairing = {
  heading: string;
  headingWeight: number;
  body: string;
  bodyWeight: number;
  /** Why this pairing suits the chosen direction — goes straight in the brand guide. */
  rationale: string;
  /** Google Fonts stylesheet href for embedding. */
  embedUrl: string;
};

type PairingSeed = Omit<FontPairing, "embedUrl">;

const PAIRINGS: Record<string, PairingSeed> = {
  modern: {
    heading: "Space Grotesk",
    headingWeight: 700,
    body: "Inter",
    bodyWeight: 400,
    rationale:
      "Space Grotesk's geometric headings feel current and confident, while Inter keeps long-form text highly readable at any size.",
  },
  bold: {
    heading: "Archivo Black",
    headingWeight: 400,
    body: "Inter",
    bodyWeight: 400,
    rationale:
      "Archivo Black gives headlines real presence and stopping power; Inter balances it with a clean, neutral body text.",
  },
  classic: {
    heading: "Playfair Display",
    headingWeight: 700,
    body: "Lato",
    bodyWeight: 400,
    rationale:
      "Playfair Display's high-contrast serif reads established and trustworthy, softened by Lato's warm, approachable body text.",
  },
  elegant: {
    heading: "Cormorant Garamond",
    headingWeight: 600,
    body: "Montserrat",
    bodyWeight: 400,
    rationale:
      "Cormorant Garamond brings refinement and editorial polish; Montserrat keeps the supporting text modern and legible.",
  },
  luxury: {
    heading: "Cormorant Garamond",
    headingWeight: 600,
    body: "Jost",
    bodyWeight: 300,
    rationale:
      "A refined serif paired with light, airy geometric sans — the combination reads premium without shouting.",
  },
  playful: {
    heading: "Fredoka",
    headingWeight: 600,
    body: "Nunito",
    bodyWeight: 400,
    rationale:
      "Fredoka's rounded headings feel friendly and energetic, and Nunito carries that warmth through the body copy.",
  },
  friendly: {
    heading: "Poppins",
    headingWeight: 600,
    body: "Nunito Sans",
    bodyWeight: 400,
    rationale:
      "Poppins is open and welcoming without feeling childish; Nunito Sans keeps paragraphs comfortable to read.",
  },
  minimal: {
    heading: "Inter",
    headingWeight: 600,
    body: "Inter",
    bodyWeight: 400,
    rationale:
      "A single family used at two weights — the most restrained, most flexible system there is. Nothing competes for attention.",
  },
  technical: {
    heading: "IBM Plex Sans",
    headingWeight: 600,
    body: "IBM Plex Sans",
    bodyWeight: 400,
    rationale:
      "IBM Plex Sans reads precise and engineered, and using one family at two weights keeps the system simple to apply.",
  },
  corporate: {
    heading: "Manrope",
    headingWeight: 700,
    body: "Source Sans 3",
    bodyWeight: 400,
    rationale:
      "Manrope is professional and contemporary without being cold; Source Sans 3 is a dependable workhorse for body text.",
  },
  natural: {
    heading: "Fraunces",
    headingWeight: 600,
    body: "Karla",
    bodyWeight: 400,
    rationale:
      "Fraunces has an organic, hand-cut character that suits craft and wellness brands, grounded by Karla's steady body text.",
  },
};

const DEFAULT_KEY = "modern";

function googleFontsUrl(pairing: PairingSeed): string {
  const fam = (name: string, weights: number[]) =>
    `family=${name.replace(/ /g, "+")}:wght@${Array.from(new Set(weights)).sort((a, b) => a - b).join(";")}`;

  if (pairing.heading === pairing.body) {
    return `https://fonts.googleapis.com/css2?${fam(pairing.heading, [
      pairing.bodyWeight,
      pairing.headingWeight,
    ])}&display=swap`;
  }

  return `https://fonts.googleapis.com/css2?${fam(pairing.heading, [pairing.headingWeight])}&${fam(
    pairing.body,
    [pairing.bodyWeight, 600]
  )}&display=swap`;
}

/** Pick the pairing matching the first recognised style direction. */
export function buildFontPairing(styles: string[] = []): FontPairing {
  let key = DEFAULT_KEY;
  for (const s of styles) {
    const candidate = String(s).toLowerCase();
    if (PAIRINGS[candidate]) {
      key = candidate;
      break;
    }
  }
  const seed = PAIRINGS[key];
  return { ...seed, embedUrl: googleFontsUrl(seed) };
}

/** All style keys the generator understands — used to build the intake form options. */
export const STYLE_KEYS = Object.keys(PAIRINGS);
