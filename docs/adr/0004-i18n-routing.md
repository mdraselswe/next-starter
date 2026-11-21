# 0004. Languages: `[locale]` routes, default locale without a prefix

**Status:** accepted · **Date:** 2026-11-21

## Context

Projects differ: some are Bangla only, some English only, some both with a switcher. The language must be chosen per project at setup (not hard-coded), work in both render modes, give each language its own crawlable URL (hreflang), and keep pages prerenderable (Cache Components caches per locale, static export writes plain files). A cookie-based language can't do that: static mode has no request cookies, and reading cookies makes every page dynamic.

## Decision

- `site.i18n` holds `defaultLocale`, `locales`, `timeZone` and `currency`; `pnpm locales <default> [others…]` sets them (NEW-PROJECT.md asks).
- Every page lives under `src/app/[locale]/`; `[locale]/layout.tsx` is the root layout, `generateStaticParams` lists the configured locales, `requireLocale()` 404s anything else. Server Components read the locale with `next/root-params` (`getT()`, `getLocale()` in `@/i18n/server`); client components use `useT()` from `@/i18n/client` (the layout's `LocaleProvider`).
- URLs: the default locale has no prefix (`/about/`), others do (`/en/about/`).
  - Server mode: `next.config.ts` rewrites unprefixed paths to `/<default>/…` (afterFiles, so public files and route handlers outside `[locale]` win) and redirects `/<default>/…` to the unprefixed URL.
  - Static mode: `scripts/postbuild.ts` moves `out/<default>/` to `out/` and removes the default locale from the router payload's canonical path (`"c":["","bn",…]` → `"c":["",…]`), which is what the server does for a rewrite. It throws if it can't find that field, so a Next.js format change fails the build instead of shipping a broken router.
- `app/global-not-found.tsx` (experimental `globalNotFound`) is the 404 for URLs outside `[locale]` and becomes `out/404.html`; inside `[locale]`, `not-found.tsx` answers in the visitor's language.
- UI text: `src/i18n/messages/<locale>.ts`, all typed by `en.ts` keys (a missing key is a type error, a unit test checks every catalogue has the same keys). Page content: `Record<locale, …>` in `src/content/`, read with `pickLocale` (falls back to the default).
- Formatting (`formatter`, `useFormatter`, `getFormatter`): `Intl` with the site's time zone and currency. Times are stored in UTC and shown in `site.i18n.timeZone`.
- No automatic redirect by `Accept-Language`: the default language is served at `/` to everyone, so pages stay cacheable; people switch with the header switcher.

## Consequences

- Links use `localeHref(locale, ROUTES.x)`; `ROUTES` holds unprefixed paths.
- `next/root-params` is not available in Server Actions or Route Handlers: pass the locale in from the page.
- The static payload rewrite depends on a Next.js internal; e2e tests (client navigation, language switch) and the postbuild guard catch a change. If it ever can't be fixed, the fallback is prefixing every locale in static mode and redirecting `/` (one line in postbuild plus `localePath`).
