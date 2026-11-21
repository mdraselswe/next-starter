/**
 * Locale routing helpers shared by the app, next.config.ts and scripts/ (plain
 * TypeScript, relative imports, no Next imports).
 *
 * URL rule: the default locale has no prefix (`/about/`), every other locale
 * does (`/en/about/`). Pages live under `src/app/[locale]/`; server mode
 * rewrites unprefixed URLs to the default locale, static mode copies the
 * default locale's export to the root (scripts/postbuild.ts).
 */
import { site } from "./index.ts";

export const LOCALES: readonly string[] = site.i18n.locales;
export const DEFAULT_LOCALE: string = site.i18n.defaultLocale;
/** Locales that get a URL prefix. */
export const PREFIXED_LOCALES: readonly string[] = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

const RTL = new Set(["ar", "fa", "he", "ur", "ps", "sd", "ug", "yi", "dv", "ckb"]);

export const isLocale = (value: string): boolean => LOCALES.includes(value);

/** Text direction of a locale ("ar" → "rtl"). */
export const localeDir = (locale: string): "ltr" | "rtl" =>
  RTL.has(locale.split("-")[0]?.toLowerCase() ?? "") ? "rtl" : "ltr";

/** The language's own name, e.g. "bn" → "বাংলা", "en" → "English". */
export function localeName(locale: string): string {
  try {
    const name = new Intl.DisplayNames([locale], { type: "language" }).of(locale);
    return name ? name.charAt(0).toLocaleUpperCase(locale) + name.slice(1) : locale;
  } catch {
    return locale;
  }
}

/** `/about` → `/about` (default locale) or `/en/about`. Accepts paths with or without a trailing slash. */
export function localePath(locale: string, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

/** Splits a URL path into its locale and the path without the prefix. */
export function splitLocale(pathname: string): { locale: string; path: string } {
  const [, first = "", ...rest] = pathname.split("/");
  if (PREFIXED_LOCALES.includes(first)) {
    return { locale: first, path: `/${rest.join("/")}` };
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

/** Every locale variant of a private path, for robots.txt and the service worker. */
export function privatePathVariants(paths: readonly string[] = site.privatePaths): string[] {
  return paths.flatMap((p) => [p, ...PREFIXED_LOCALES.map((l) => `/${l}${p}`)]);
}
