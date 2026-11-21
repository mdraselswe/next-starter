/**
 * Internal pages, without the locale prefix and without a trailing slash
 * (the build adds it: `trailingSlash: true`). Add a page here when you create
 * one under src/app/[locale]/. Link to them with `localeHref(locale, ROUTES.x)`
 * (src/lib/locale-href.ts), which adds the prefix for non-default languages.
 * Plain data (no Next imports) so scripts can read it too.
 */
export const ROUTES = {
  home: "/",
  about: "/about",
  /** Design-system preview, development only (not in the sitemap; robots.txt disallows it). */
  dev: "/dev",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/** Pages listed in the sitemap (each in every language). */
export const SITEMAP_ROUTES: readonly string[] = [ROUTES.home, ROUTES.about];

/** The served URL of a route (`/about` → `/about/`). */
export const pageUrl = (route: string) => (route.endsWith("/") ? route : `${route}/`);
