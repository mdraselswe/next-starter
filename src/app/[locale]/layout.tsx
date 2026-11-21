import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { brandStyle, fontVariables, htmlDesignAttributes } from "@/components/layout/brand-style";
import { ThemeScript } from "@/components/layout/theme-script";
import { features, isProduction, site } from "@/config";
import { LOCALES, localeDir, localePath } from "@/config/locale";
import { pageUrl } from "@/config/routes";
import { Toaster } from "@/components/ui/sonner";
import { ConnectionBanner } from "@/features/connection";
import { InstallCard, PwaScript } from "@/features/pwa";
import { LocaleProvider } from "@/i18n/client";
import { getLocale, getT, requireLocale } from "@/i18n/server";
import "../globals.css";

/** One prerendered tree per configured language; any other first segment is a 404 (requireLocale). */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const description = (await getT())("meta.description");
  return {
    metadataBase: new URL(site.url),
    title: { default: site.seo.title, template: `%s · ${site.name}` },
    description,
    keywords: site.seo.keywords,
    applicationName: site.name,
    alternates: {
      canonical: pageUrl(localePath(locale, "/")),
      languages: Object.fromEntries(LOCALES.map((l) => [l, pageUrl(localePath(l, "/"))])),
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: site.seo.title,
      description,
      locale,
    },
    twitter: { card: "summary_large_image", title: site.seo.title, description },
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
}

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

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await requireLocale();
  const t = await getT();
  return (
    <html
      lang={locale}
      dir={localeDir(locale)}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${fontVariables} ${site.theme.defaultMode === "dark" ? "dark" : ""} h-full antialiased`}
      style={brandStyle}
      {...htmlDesignAttributes}
    >
      <head>
        <ThemeScript />
        {features.pwa ? <PwaScript serviceWorker={isProduction} /> : null}
      </head>
      <body className="flex min-h-full flex-col">
        <LocaleProvider locale={locale}>
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
          {features.offlineBanner ? <ConnectionBanner /> : null}
          {features.toaster.enabled ? <Toaster /> : null}
          {features.pwa ? <InstallCard /> : null}
        </LocaleProvider>
      </body>
    </html>
  );
}
