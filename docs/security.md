# Security baseline

What the starter does, and what each project adds.

## Built in

- **Headers** (`src/config/security.ts`): HSTS, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` (camera, mic, location, payment off), COOP. Sent in both render modes (ADR 0006).
- **Private pages** never enter the offline cache or the sitemap; robots.txt disallows them (ADR 0005). Call `clearOfflineCache()` on sign-out.
- **Secrets** only through `src/config/env.ts` (`serverEnv()`, zod-validated); `NEXT_PUBLIC_*` is public by definition.
- **Input**: validate everything that crosses a boundary (forms, Server Actions, route handlers, webhooks) with zod.

## Per project

- **Content-Security-Policy.** Start in report-only mode, list the origins you really use (analytics, payment, maps, video), then enforce. A strict CSP with nonces needs server mode (`proxy.ts`) and makes pages dynamic; a hash/allow-list CSP works for static.
- **Permissions-Policy.** Turn on what you use, e.g. `camera=(self), microphone=(self)` for video calls, `geolocation=(self)` for "near me".
- **Auth.** Short sessions, rate limits on sign-in and OTP, re-auth for sensitive actions. Authorise on the server for every request (and in the database with row-level security where available), never only in the UI.
- **Audit log** for sensitive data (health, money): who read or changed what, when.
- **Dependencies** stay current automatically (docs/updating.md).
