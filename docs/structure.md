# Code structure

One rule decides where code goes: **routes are thin, features own their logic, vendors stay behind one door.**

```text
src/
  app/
    [locale]/            routes only: layout, page, loading, error, not-found
                         (route groups such as (public), account/, dashboard/, admin/ live here,
                         each with its own layout.tsx)
    api/                 route handlers that don't need a language (webhooks, cron)
    global-not-found.tsx
  features/<domain>/     a feature or business domain, e.g. pwa, providers, chat, payments
    components/          its React components
    server/              queries.ts (reads), actions.ts (Server Actions), service.ts (rules)
    schemas.ts           zod schemas shared by forms and the server
    *.ts + *.test.ts     pure logic with colocated tests
    index.ts             the only public entry (ESLint blocks deep imports)
  infrastructure/<vendor>/  the ONLY place a vendor SDK is imported (database, auth, SMS, payments,
                         email, storage); exposes a small interface the features use
  components/ui · components/layout
  config/  content/  i18n/  hooks/  lib/
```

Create `features/<domain>/server/` and `infrastructure/` when the first one is needed; a static site may never have them.

## Rules

- **Pages call features, features call infrastructure.** A page never imports a vendor SDK or the database directly.
- **Business rules** (prices, commissions, permissions, state changes) live in `features/<domain>/server/service.ts` as functions that take plain data, so they are unit-testable without a database.
- **Swappable vendors:** `infrastructure/sms/index.ts` exports `sms: SmsProvider`; changing provider changes that folder only.
- **Money** as integer minor units (poisha, cents); format with `formatter(locale).money(amount / 100)`.
- **Time** stored in UTC; shown in `site.i18n.timeZone`.

## Data and caching (server mode)

- `"use cache"` only for data that is the same for everyone (a public profile, a catalogue). **Never** for per-person data (account, chat, orders, anything after sign-in): read it with no cache, and keep those pages under `site.privatePaths`.
- Reading the locale inside a cached function: call `getLocale()`/root params inside it, so the locale is part of the cache key.
- After a write, refresh with `updateTag`/`revalidateTag` for the tags the read used.
