import type { NextConfig } from "next";
import { site } from "./src/config/index.ts";

/**
 * One codebase, two build modes (src/config/site.ts → `render`, or RENDER_MODE):
 *
 * - static: `output: "export"` writes plain HTML to out/. Cache Components and
 *   Partial Prefetching are off because Next can't use them in export mode.
 *   Server-only features (Server Actions, cookies, request-time route handlers)
 *   fail the build, so you find out early.
 * - server: full Next.js with Cache Components ("use cache", cacheLife, cacheTag)
 *   and Partial Prefetching, the current Next defaults.
 */
const isStatic = site.render === "static";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,
  trailingSlash: true,
  poweredByHeader: false,
  ...(isStatic
    ? { output: "export", images: { unoptimized: true } }
    : { cacheComponents: true, partialPrefetching: true }),
  // Tailwind v4 through its Turbopack loader (set up by create-next-app).
  turbopack: {
    rules: {
      "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" },
    },
  },
};

export default nextConfig;
