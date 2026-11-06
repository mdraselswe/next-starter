# 0002. Generate robots, sitemap, manifest and icons into public/

**Status:** accepted · **Date:** 2026-11-06

## Context

Next metadata routes (`app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`, icon route handlers) need `export const dynamic = "force-static"` in static export, but that segment config is rejected when Cache Components is on (server mode). One file can't satisfy both.

## Decision

`scripts/generate-assets.ts` runs before `dev` and `build`, reads `src/config`, and writes `public/robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `icons/*` (SVG + PNGs via sharp, colours converted from OKLCH) and a runtime-caching `sw.js`. In static mode `scripts/postbuild.ts` replaces `out/sw.js` with one that precaches the whole export. The files are git-ignored.

Scripts run with Node's built-in TypeScript support, so `src/config` files use relative `.ts` imports.

## Consequences

- Same output in both modes; config stays the single source.
- Dynamic sitemaps (from a database) need a route handler in server mode; add one then and drop the generated file.
