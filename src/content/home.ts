/**
 * ✏️ Home page content, one entry per language (missing ones fall back to the
 * default locale). Content (marketing copy, lists, data) lives in
 * src/content; short UI labels live in src/i18n. Replace freely per project.
 * Icons are lucide icon names, mapped in the component.
 */
export type FeatureIcon = "settings" | "server" | "shield" | "refresh" | "smartphone" | "sparkles";

export interface HomeContent {
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    secondaryHref: string;
  };
  features: readonly { icon: FeatureIcon; title: string; body: string }[];
}

export const homeContent: Record<string, HomeContent> = {
  en: {
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
  },
  bn: {
    hero: {
      eyebrow: "Next.js স্টার্টার",
      title: "আপনার পরের অ্যাপ বানান [মজবুত] ভিত্তির উপর",
      body: "Strict TypeScript, টেস্ট, CI, অটোমেটিক আপডেট, আর প্রজেক্টের সব নিজস্ব সেটিং এক কনফিগ ফোল্ডারে।",
      primaryCta: "বিস্তারিত পড়ুন",
      secondaryCta: "GitHub-এ দেখুন",
      secondaryHref: "https://github.com",
    },
    features: [
      {
        icon: "settings",
        title: "কনফিগ আগে",
        body: "ব্র্যান্ড, রং, লেখা আর ফিচার থাকে src/config, src/content আর src/i18n-এ।",
      },
      {
        icon: "server",
        title: "স্ট্যাটিক বা সার্ভার",
        body: "যেকোনো হোস্টের জন্য সাধারণ HTML, অথবা এক সুইচে পুরো Next.js।",
      },
      {
        icon: "shield",
        title: "শুরু থেকেই কড়া নিয়ম",
        body: "Strict TypeScript, ESLint সীমানা, ইউনিট, e2e আর অ্যাক্সেসিবিলিটি টেস্ট।",
      },
      {
        icon: "refresh",
        title: "সবসময় আপডেটেড",
        body: "Dependabot আপডেট, CI সবুজ হলে অটো-মার্জ, আর সাপ্তাহিক ফ্রেশনেস চেক।",
      },
      {
        icon: "smartphone",
        title: "ইনস্টল করা যায়",
        body: "অফলাইন সাপোর্ট আর প্রতিটি ডিভাইসের ইনস্টল নির্দেশনাসহ PWA।",
      },
      {
        icon: "sparkles",
        title: "আধুনিক UI",
        body: "Base UI-র উপর shadcn/ui, Tailwind টোকেন, লাইট আর ডার্ক থিম।",
      },
    ],
  },
};
