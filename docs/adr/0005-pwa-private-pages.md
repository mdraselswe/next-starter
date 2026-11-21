# 0005. The service worker never caches private pages

**Status:** accepted · **Date:** 2026-11-21

## Context

The service worker saved every page it served and showed the saved copy when the network was slow (3.5 s) or offline. Fine for a brochure site; in an app with sign-in it could show the previous person's dashboard, chat or order history on a shared phone after sign-out, or stale prices and messages on a slow connection.

## Decision

- `site.privatePaths` (default `/account`, `/dashboard`, `/admin`, `/api`, `/auth`) lists paths that belong to one signed-in person. `privatePathVariants()` adds every locale prefix.
- The service worker (`scripts/sw.template.js`) gets that list at build time and treats those paths as network-only: no cache read, no cache write, for pages and router data. Offline, a private navigation falls back to the cached home page.
- Nothing is stored when the response says `Cache-Control: no-store` or `private`, or when the request carries an `Authorization` header. Server code that renders per-person data on a public path should send `private`.
- `clearOfflineCache()` from `@/features/pwa` deletes all saved pages; call it on sign-out and account switch.
- The same list goes into robots.txt (`Disallow`), together with `/dev`.

## Consequences

- Private pages need the network. That is the right default for health, payment and account data.
- A project adds its own private sections to `site.privatePaths`; the e2e smoke test checks the list reaches robots.txt and sw.js.
