import { z } from "zod";

/**
 * Schemas for every project-specific value. Config files are validated at
 * build time, so a typo fails the build instead of shipping.
 *
 * This file and the other files in src/config use only relative imports with
 * `.ts` extensions, so Node can run them directly in scripts/ (type stripping).
 */

export const RENDER_MODES = ["static", "server"] as const;
export type RenderMode = (typeof RENDER_MODES)[number];

export const THEME_MODES = ["system", "light", "dark"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const SOCIAL_KINDS = [
  "facebook",
  "instagram",
  "x",
  "linkedin",
  "youtube",
  "tiktok",
  "github",
  "whatsapp",
] as const;

const color = z.string().regex(/^(oklch|#|rgb|hsl)/, "Use an oklch(), hex, rgb() or hsl() colour");

export const siteSchema = z.object({
  /** Full brand name, used in titles and the footer. */
  name: z.string().min(1),
  /** Short name for the app icon label (≤ 12 characters reads best). */
  shortName: z.string().min(1).max(20),
  description: z.string().min(1),
  /** Production URL without a trailing slash. Can be overridden with NEXT_PUBLIC_SITE_URL. */
  url: z.url(),
  /** BCP 47 language tag of the default locale, e.g. "en" or "bn". */
  locale: z.string().min(2),
  dir: z.enum(["ltr", "rtl"]),
  /**
   * How the site is built:
   * - "static": plain HTML files in out/, host anywhere (no server features)
   * - "server": full Next.js (Server Actions, route handlers, Cache Components)
   * Can be overridden with RENDER_MODE. Switch with `pnpm mode static|server`.
   */
  render: z.enum(RENDER_MODES),
  theme: z.object({
    defaultMode: z.enum(THEME_MODES),
    /** Brand colour for buttons, links and focus rings, per theme. */
    primary: z.object({ light: color, dark: color }),
    /** Text colour on top of the brand colour, per theme. */
    primaryForeground: z.object({ light: color, dark: color }),
    /** Page background used for the app icon and browser UI, per theme. */
    background: z.object({ light: color, dark: color }),
    /** Base corner radius, e.g. "0.625rem". */
    radius: z.string().regex(/^\d*\.?\d+(rem|px)$/),
  }),
  contact: z.object({
    email: z.email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
  socials: z.array(z.object({ kind: z.enum(SOCIAL_KINDS), url: z.url() })),
  seo: z.object({
    /** Default page title (home page). */
    title: z.string().min(1),
    keywords: z.array(z.string()),
  }),
});

export type SiteConfig = z.infer<typeof siteSchema>;

export const featuresSchema = z.object({
  /** Light/dark switch in the header. */
  themeToggle: z.boolean(),
  /** Installable app: manifest, icons, service worker, offline support. */
  pwa: z.boolean(),
  /** "Install the app" card that pops up after a short visit (needs pwa). */
  installPrompt: z.object({
    enabled: z.boolean(),
    delaySeconds: z.number().int().min(0),
    /** Days to wait after "Not now" before showing it again. */
    snoozeDays: z.number().int().min(0),
  }),
  /** Small notice while the device is offline (needs pwa). */
  offlineBanner: z.boolean(),
});

export type FeaturesConfig = z.infer<typeof featuresSchema>;
