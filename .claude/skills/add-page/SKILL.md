---
name: add-page
description: Add a new page/route following the starter's config, i18n, metadata and test conventions.
---

# Add a page

1. Create `src/app/[locale]/<route>/page.tsx` as a Server Component. Use `PageShell` from `@/components/layout/page-shell`; text with `const t = await getT()` (`@/i18n/server`); export `generateMetadata` returning `pageMetadata(t(…), t(…), ROUTES.<route>, await getLocale())` from `@/lib/metadata`.
2. Add the route to `ROUTES` in `src/config/routes.ts` (no trailing slash). Add it to `SITEMAP_ROUTES` if it should be indexed, and to `NAV_LINKS` in `src/config/navigation.ts` if it belongs in the header/footer.
3. UI labels → keys in `src/i18n/messages/en.ts` **and every other language file** (a missing key is a type error); longer copy or data → a file in `src/content/` with one entry per language, read with `pickLocale`. Links: `localeHref(locale, ROUTES.x)`.
4. Data that loads: wrap only the waiting part in `<SuspenseReveal fallback={<XSkeleton />}>` with a skeleton twin of the same shape (docs/loading.md); never a skeleton for the heading or static parts.
5. Interactive parts: a small `"use client"` component using `useT()` from `@/i18n/client`; keep the page itself a Server Component. A page for one signed-in person: put it under a path in `site.privatePaths`.
6. Server-only needs (Server Actions, cookies, request data)? Only in server mode: check `site.render`, or move the project to server mode with `pnpm mode server` and write an ADR.
7. Add the route to `ROUTES` in `tests/e2e/smoke.spec.ts` (renders in every language + axe).
8. Run `pnpm check`, then `pnpm build && pnpm test:e2e`.
