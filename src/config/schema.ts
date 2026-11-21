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

export const HOSTS = ["vercel", "cloudflare", "other"] as const;
export type Host = (typeof HOSTS)[number];

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
  /**
   * Languages. Set with `pnpm locales <default> [others…]`.
   * The default locale has no URL prefix (`/about/`); the others do (`/en/about/`).
   */
  i18n: z
    .object({
      /** BCP 47 tag of the default language, e.g. "bn" or "en". Must be in `locales`. */
      defaultLocale: z.string().min(2),
      /** Every language the site is built in. Each needs src/i18n/messages/<locale>.ts. */
      locales: z.array(z.string().min(2)).min(1),
      /** IANA time zone for dates shown to people, e.g. "Asia/Dhaka". Store times in UTC. */
      timeZone: z.string().min(1),
      /** ISO 4217 currency for prices, e.g. "BDT". */
      currency: z.string().length(3),
    })
    .refine((v) => v.locales.includes(v.defaultLocale), "defaultLocale must be one of locales")
    .refine((v) => new Set(v.locales).size === v.locales.length, "locales must not repeat"),
  /**
   * How the site is built:
   * - "static": plain HTML files in out/, host anywhere (no server features)
   * - "server": full Next.js (Server Actions, route handlers, Cache Components)
   * Can be overridden with RENDER_MODE. Switch with `pnpm mode static|server`.
   */
  render: z.enum(RENDER_MODES),
  /**
   * false: CI also builds the other render mode, so code stays portable.
   * true: the project needs this mode (e.g. login, database); CI builds only it.
   * Set with `pnpm mode <mode> --lock`.
   */
  renderLocked: z.boolean(),
  /** Where it is deployed; `pnpm mode` writes that host's config file. */
  host: z.enum(HOSTS),
  /**
   * Paths that belong to one signed-in person (account, dashboard, admin, API).
   * The service worker never caches them, robots.txt disallows them, and they
   * match with or without a locale prefix. Prefix match: "/dashboard" covers "/dashboard/x".
   */
  privatePaths: z.array(z.string().regex(/^\/[^?#]*$/, 'Start with "/", no query')),
  theme: z.object({
    defaultMode: z.enum(THEME_MODES),
    /** Brand colour for buttons, links and focus rings, per theme. */
    primary: z.object({ light: color, dark: color }),
    /** Text colour on top of the brand colour, per theme. */
    primaryForeground: z.object({ light: color, dark: color }),
    /** Page background used for the app icon and browser UI, per theme. */
    background: z.object({ light: color, dark: color }),
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

export const TOAST_POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;
export type ToastPosition = (typeof TOAST_POSITIONS)[number];

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
  /** Animated notice when the connection drops, and "back online" when it returns. */
  offlineBanner: z.boolean(),
  /** Toast notifications (sonner). `position` is the default; any toast can pass its own. */
  toaster: z.object({ enabled: z.boolean(), position: z.enum(TOAST_POSITIONS) }),
});

export type FeaturesConfig = z.infer<typeof featuresSchema>;

/* ─── Design knobs (src/config/design.ts, docs/design-system.md) ───────────
   Each knob changes a set of CSS tokens, so every component follows. Mixed
   together (plus colours and fonts) they give each project its own look. */
export const CONTROL_SHAPES = ["rounded", "pill"] as const;
export const BORDERS = ["none", "hairline", "bold"] as const;
export const ELEVATIONS = ["flat", "soft", "tactile", "offset", "glow"] as const;
export const DENSITIES = ["compact", "comfortable", "airy"] as const;
export const MOTIONS = ["crisp", "smooth", "bouncy"] as const;
export const TEXTURES = ["none", "grain", "grid", "dots"] as const;

export const designSchema = z.object({
  /** Base corner radius, e.g. "0.625rem". Cards, menus and dialogs scale from it. */
  radius: z.string().regex(/^\d*\.?\d+(rem|px)$/),
  /** Buttons, inputs, tabs: follow the radius, or fully round. */
  controlShape: z.enum(CONTROL_SHAPES),
  /** Lines around controls and cards: none (fills and shadows do the work), 1px, or 2px in the text colour. */
  border: z.enum(BORDERS),
  /** How things sit on the page: flat, soft shadows, tactile (light from above), offset sticker shadows, or glow. */
  elevation: z.enum(ELEVATIONS),
  /** Control height and padding. */
  density: z.enum(DENSITIES),
  /** Timing and easing: short and exact, smooth, or springy with overshoot. */
  motion: z.enum(MOTIONS),
  /** Page background pattern. */
  texture: z.enum(TEXTURES),
  /** Tint of the greys (borders, muted surfaces, text): hue 0–360, chroma 0 (pure grey) to 0.04. */
  neutral: z.object({ hue: z.number().min(0).max(360), chroma: z.number().min(0).max(0.04) }),
});
export type DesignConfig = z.infer<typeof designSchema>;
