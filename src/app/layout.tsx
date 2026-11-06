import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeScript } from "@/components/layout/theme-script";
import { features, isProduction, site } from "@/config";
import { fontVariables } from "@/config/fonts";
import { InstallCard, OfflineBanner, PwaScript } from "@/features/pwa";
import { locale, t } from "@/i18n";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.seo.title, template: `%s · ${site.name}` },
  description: site.description,
  keywords: site.seo.keywords,
  applicationName: site.name,
  openGraph: { type: "website", siteName: site.name, title: site.seo.title, description: site.description },
  twitter: { card: "summary_large_image", title: site.seo.title, description: site.description },
  // Icons and the manifest are generated from config by scripts/generate-assets.ts.
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  ...(features.pwa ? { manifest: "/manifest.webmanifest" } : {}),
  appleWebApp: { capable: features.pwa, title: site.shortName, statusBarStyle: "default" },
};

const { background } = site.theme;
export const viewport: Viewport = {
  themeColor:
    site.theme.defaultMode === "system"
      ? [
          { media: "(prefers-color-scheme: light)", color: background.light },
          { media: "(prefers-color-scheme: dark)", color: background.dark },
        ]
      : background[site.theme.defaultMode],
  viewportFit: "cover",
};

/** Brand values from config become CSS variables; globals.css maps them onto the shadcn tokens. */
const brandVars = {
  "--brand": site.theme.primary.light,
  "--brand-dark": site.theme.primary.dark,
  "--brand-foreground": site.theme.primaryForeground.light,
  "--brand-foreground-dark": site.theme.primaryForeground.dark,
  "--page-bg": site.theme.background.light,
  "--page-bg-dark": site.theme.background.dark,
  "--radius": site.theme.radius,
} as CSSProperties;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={locale}
      dir={site.dir}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${fontVariables} ${site.theme.defaultMode === "dark" ? "dark" : ""} h-full antialiased`}
      style={brandVars}
    >
      <head>
        <ThemeScript />
        {features.pwa ? <PwaScript serviceWorker={isProduction} /> : null}
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#content"
          className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:translate-y-0"
        >
          {t("a11y.skip")}
        </a>
        <SiteHeader />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        {features.offlineBanner ? <OfflineBanner /> : null}
        {features.pwa ? <InstallCard /> : null}
      </body>
    </html>
  );
}
