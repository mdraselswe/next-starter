/**
 * ✏️ Home page content. Content (marketing copy, lists, data) lives in
 * src/content; short UI labels live in src/i18n. Replace freely per project.
 * Icons are lucide icon names, mapped in the component.
 */
export const homeContent = {
  hero: {
    eyebrow: "Next.js starter",
    title: "Build your next app on a [solid] base",
    body: "Strict TypeScript, tests, CI, automatic updates and one config folder for every project-specific value.",
    primaryCta: "Read about it",
    secondaryCta: "View on GitHub",
    secondaryHref: "https://github.com",
  },
  features: [
    {
      icon: "settings",
      title: "Config first",
      body: "Brand, colours, text and features live in src/config, src/content and src/i18n.",
    },
    {
      icon: "server",
      title: "Static or server",
      body: "Build plain HTML for any host, or full Next.js with one switch.",
    },
    {
      icon: "shield",
      title: "Strict by default",
      body: "Strict TypeScript, ESLint boundaries, unit, e2e and accessibility tests.",
    },
    {
      icon: "refresh",
      title: "Stays current",
      body: "Dependabot updates, auto-merge on green CI and a weekly freshness check.",
    },
    {
      icon: "smartphone",
      title: "Installable",
      body: "Optional PWA with offline support and install steps for every device.",
    },
    {
      icon: "sparkles",
      title: "Modern UI",
      body: "shadcn/ui on Base UI, Tailwind tokens, light and dark themes.",
    },
  ],
} as const;

export type FeatureIcon = (typeof homeContent.features)[number]["icon"];
