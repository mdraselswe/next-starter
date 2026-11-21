import type { DesignConfig } from "@/config";

export interface Direction {
  id: string;
  name: string;
  /** Mood in a sentence: what it feels like and why it fits. */
  summary: string;
  /** 2–3 reference sites or apps this direction learned from (inspiration, never copied). */
  references: string[];
  /** The knob values; the chosen one is copied into src/config/design.ts. */
  design: DesignConfig;
  /** Colours to try with it (site.theme.primary). Fonts go in src/config/fonts.ts. */
  primary: { light: string; dark: string };
  /** What only this product would have: illustration, mascot, one or two signature interactions. */
  signature: string[];
}

/**
 * ✏️ Three directions for THIS product. STARTER-KIT Prompt 1 replaces these
 * every time: researched for the product, its users and its references, so
 * no two projects end up with the same three. The values below are only
 * examples of how far the knobs reach.
 */
export const DIRECTIONS: Direction[] = [
  {
    id: "a",
    name: "Example A · Soft & tactile",
    summary:
      "Objects you can press: light from above, soft layered shadows, springy squash. Friendly and trustworthy.",
    references: ["Apple Health", "uiverse.io tactile buttons", "motion-brew.com spring timing"],
    design: {
      radius: "1rem",
      controlShape: "rounded",
      border: "none",
      elevation: "tactile",
      density: "airy",
      motion: "bouncy",
      texture: "none",
      neutral: { hue: 70, chroma: 0.008 },
    },
    primary: { light: "oklch(0.58 0.16 160)", dark: "oklch(0.74 0.14 160)" },
    signature: ["Hand-drawn mascot in empty states", "Cards squash slightly when pressed"],
  },
  {
    id: "b",
    name: "Example B · Crisp & glow",
    summary: "Precise and technical: thin lines, a grid, light that follows the pointer, short exact motion.",
    references: ["linear.app", "magicui.design (border beam, shine)", "vercel.com"],
    design: {
      radius: "0.5rem",
      controlShape: "rounded",
      border: "hairline",
      elevation: "glow",
      density: "compact",
      motion: "crisp",
      texture: "grid",
      neutral: { hue: 265, chroma: 0.014 },
    },
    primary: { light: "oklch(0.55 0.22 275)", dark: "oklch(0.72 0.17 275)" },
    signature: ["Border beam on the main call to action", "Keyboard-first command menu"],
  },
  {
    id: "c",
    name: "Example C · Playful",
    summary: "Bold outlines, sticker shadows, chunky presses and little reactions. Delight over density.",
    references: ["Duolingo", "Gumroad", "uiverse.io brutalist buttons"],
    design: {
      radius: "1.25rem",
      controlShape: "pill",
      border: "bold",
      elevation: "offset",
      density: "airy",
      motion: "bouncy",
      texture: "dots",
      neutral: { hue: 85, chroma: 0.012 },
    },
    primary: { light: "oklch(0.62 0.2 35)", dark: "oklch(0.74 0.16 35)" },
    signature: ["Stickers and emoji reactions", "Icons wiggle, likes pop"],
  },
];
