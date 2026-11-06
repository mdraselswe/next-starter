import { siteSchema, type SiteConfig } from "./schema.ts";

/**
 * ✏️ The main file to edit for a new project: brand, colours, contact, SEO
 * and render mode. Everything here is validated by `siteSchema`.
 * Fonts: src/config/fonts.ts · UI text: src/i18n/messages · page content: src/content.
 */
const site: SiteConfig = {
  name: "Next Starter",
  shortName: "Starter",
  description: "A strict, configurable Next.js starter with static and server modes.",
  url: "https://example.com",
  locale: "en",
  dir: "ltr",
  render: "static",
  theme: {
    defaultMode: "system",
    primary: { light: "oklch(0.55 0.2 264)", dark: "oklch(0.72 0.16 264)" },
    primaryForeground: { light: "oklch(0.985 0 0)", dark: "oklch(0.18 0.02 264)" },
    background: { light: "#ffffff", dark: "#0b0b0f" },
    radius: "0.625rem",
  },
  contact: {
    email: "hello@example.com",
  },
  socials: [{ kind: "github", url: "https://github.com" }],
  seo: {
    title: "Next Starter",
    keywords: ["next.js", "starter"],
  },
};

export const siteConfig = siteSchema.parse(site);
