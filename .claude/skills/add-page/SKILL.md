---
name: add-page
description: Add a new page/route following the starter's config, i18n, metadata and test conventions.
---

# Add a page

1. Create `src/app/<route>/page.tsx` as a Server Component. Use `PageShell` from `@/components/layout/page-shell` and export `metadata = pageMetadata(title, description, ROUTES.<route>)` from `@/lib/metadata`.
2. Add the route to `ROUTES` in `src/config/routes.ts` (no trailing slash). Add it to `SITEMAP_ROUTES` if it should be indexed, and to `NAV_LINKS` in `src/config/navigation.ts` if it belongs in the header/footer.
3. UI labels → keys in `src/i18n/messages/en.ts` (use `t()`); longer copy or data → a file in `src/content/`.
4. Interactive parts: a small `"use client"` component; keep the page itself a Server Component.
5. Server-only needs (Server Actions, cookies, request data)? Only in server mode: check `site.render`, or move the project to server mode with `pnpm mode server` and write an ADR.
6. Add the path to `PAGES` in `tests/e2e/smoke.spec.ts` (renders + axe).
7. Run `pnpm check`, then `pnpm build && pnpm test:e2e`.
