import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { site } from "./src/config/index.ts";
import { DEFAULT_LOCALE, PREFIXED_LOCALES } from "./src/config/locale.ts";
import { SECURITY_HEADERS } from "./src/config/security.ts";

/**
 * One codebase, two build modes (src/config/site.ts → `render`, or RENDER_MODE):
 *
 * - static: `output: "export"` writes plain HTML to out/. Cache Components and
 *   Partial Prefetching are off because Next can't use them in export mode.
 *   Server-only features (Server Actions, cookies, request-time route handlers)
 *   fail the build, so you find out early. Security headers come from the host
 *   config that `pnpm mode` writes.
 * - server: full Next.js with Cache Components ("use cache", cacheLife, cacheTag)
 *   and Partial Prefetching, the current Next defaults.
 *
 * Languages: pages live in app/[locale]. The default locale is served without a
 * prefix: server mode (and `pnpm dev` in both modes) rewrites `/about/` →
 * `/bn/about/` and redirects `/bn/about/` → `/about/`; a static build copies the
 * default locale's export to the root instead (scripts/postbuild.ts).
 * See docs/adr/0004-i18n-routing.md.
 */
const isStatic = site.render === "static";

/** Not another locale's prefix: `/en`, `/en/…` stay as they are. */
const notPrefixed = PREFIXED_LOCALES.length > 0 ? `(?!(?:${PREFIXED_LOCALES.join("|")})(?:/|$))` : "";

const localeRouting: Pick<NextConfig, "redirects" | "rewrites"> = {
  async redirects() {
    return [
      { source: `/${DEFAULT_LOCALE}`, destination: "/", permanent: true },
      { source: `/${DEFAULT_LOCALE}/:path*`, destination: "/:path*", permanent: true },
    ];
  },
  async rewrites() {
    // afterFiles: public files, _next and route handlers outside [locale] win first.
    return {
      beforeFiles: [],
      afterFiles: [
        { source: "/", destination: `/${DEFAULT_LOCALE}` },
        { source: `/:path(${notPrefixed}.*)`, destination: `/${DEFAULT_LOCALE}/:path` },
      ],
      fallback: [],
    };
  },
};

export default function config(phase: string): NextConfig {
  // `next dev` of a static project runs without `output: "export"` and with the locale
  // rewrites (export-mode dev can not rewrite to [locale]; postbuild only runs after a build).
  // Static-only limits are still enforced by `next build`, which `pnpm check` and CI run.
  const dev = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    reactCompiler: true,
    typedRoutes: true,
    trailingSlash: true,
    poweredByHeader: false,
    // app/global-not-found.tsx: the 404 for URLs outside app/[locale] (out/404.html in static mode).
    experimental: { globalNotFound: true },
    ...(isStatic
      ? dev
        ? { images: { unoptimized: true }, ...localeRouting }
        : { output: "export", images: { unoptimized: true } }
      : {
          cacheComponents: true,
          partialPrefetching: true,
          async headers() {
            return [{ source: "/:path*", headers: SECURITY_HEADERS }];
          },
          ...localeRouting,
        }),
    // Tailwind v4 through its Turbopack loader (set up by create-next-app).
    turbopack: {
      rules: {
        "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
      },
    },
  };
}
