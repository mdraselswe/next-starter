/**
 * Internal links. No trailing slash: `typedRoutes` checks them, and the build
 * adds the slash (`trailingSlash: true`). Add a page here when you create one.
 * Plain data (no Next imports) so scripts can read it too.
 */
export const ROUTES = {
  home: "/",
  about: "/about",
} as const;

/** Pages listed in the sitemap. */
export const SITEMAP_ROUTES: readonly string[] = [ROUTES.home, ROUTES.about];

/** The served URL of a route (`/about` → `/about/`). */
export const pageUrl = (route: string) => (route.endsWith("/") ? route : `${route}/`);
