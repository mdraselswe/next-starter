import type { Metadata } from "next";
import { brandStyle, fontVariables, htmlDesignAttributes } from "@/components/layout/brand-style";
import { NotFoundView } from "@/components/layout/not-found-view";
import { ThemeScript } from "@/components/layout/theme-script";
import { site } from "@/config";
import { DEFAULT_LOCALE, localeDir } from "@/config/locale";
import { translator } from "@/i18n";
import "./globals.css";

/**
 * 404 for URLs outside app/[locale] (exported as out/404.html in static mode).
 * It bypasses the root layout, so it brings its own <html>, styles and theme.
 * Server mode rewrites unknown URLs into [locale], where not-found.tsx answers
 * in the visitor's language; this page shows the default language.
 */
const t = translator(DEFAULT_LOCALE);

export const metadata: Metadata = {
  title: `${t("notFound.title")} · ${site.name}`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html
      lang={DEFAULT_LOCALE}
      dir={localeDir(DEFAULT_LOCALE)}
      suppressHydrationWarning
      className={`${fontVariables} ${site.theme.defaultMode === "dark" ? "dark" : ""} h-full antialiased`}
      style={brandStyle}
      {...htmlDesignAttributes}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col">
        <main className="flex flex-1 flex-col">
          <NotFoundView t={t} locale={DEFAULT_LOCALE} className="flex-1" />
        </main>
      </body>
    </html>
  );
}
