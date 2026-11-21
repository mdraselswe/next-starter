"use client";

import { usePathname } from "next/navigation";
import { brandStyle, fontVariables, htmlDesignAttributes } from "@/components/layout/brand-style";
import { ErrorView } from "@/components/layout/error-view";
import { ThemeScript } from "@/components/layout/theme-script";
import { site } from "@/config";
import { localeDir, splitLocale } from "@/config/locale";
import { ROUTES } from "@/config/routes";
import { translator } from "@/i18n";
import { localeHref } from "@/lib/locale-href";
import "./globals.css";

/**
 * Shown when the root layout itself fails ([locale]/error.tsx handles pages).
 * It replaces the whole document, so it brings its own <html>, styles, theme
 * and language (read from the URL, as the layout's providers are gone).
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  const { locale } = splitLocale(usePathname());
  const t = translator(locale);
  return (
    <html
      lang={locale}
      dir={localeDir(locale)}
      suppressHydrationWarning
      className={`${fontVariables} ${site.theme.defaultMode === "dark" ? "dark" : ""} h-full antialiased`}
      style={brandStyle}
      {...htmlDesignAttributes}
    >
      <head>
        <ThemeScript />
        <title>{`${t("error.title")} · ${site.name}`}</title>
      </head>
      <body className="flex min-h-full flex-col">
        <main className="flex flex-1 flex-col">
          <ErrorView
            error={error}
            retry={retry}
            t={t}
            homeHref={localeHref(locale, ROUTES.home)}
            className="flex-1"
          />
        </main>
      </body>
    </html>
  );
}
