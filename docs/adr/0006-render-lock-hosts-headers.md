# 0006. Render-mode lock, hosts and security headers

**Status:** accepted · **Date:** 2026-11-21

## Context

CI and the weekly auto-upgrade built both render modes so shared code stays portable (ADR 0001). A project that needs a server (login, database) can never build statically, so that check would fail on its first auth feature. Hosting was Vercel-only, and no security headers were sent.

## Decision

- `site.renderLocked`: `pnpm mode server --lock` sets it. `pnpm build:other` builds the other mode unless locked; CI and auto-upgrade call it before the configured build (so e2e runs against the configured one).
- `site.host` (`vercel` | `cloudflare` | `other`): `pnpm mode <mode> --host <host>` writes `vercel.json` (Vercel static) or `wrangler.jsonc` (Cloudflare: static assets from `out/`, or OpenNext for server mode; docs/deploy.md).
- `src/config/security.ts` lists HSTS, nosniff, frame denial, referrer and permissions policies, COOP. Server mode sends them from `next.config.ts`; static mode writes them to `public/_headers` (Cloudflare, Netlify) and `vercel.json`. A Content-Security-Policy is per project (docs/security.md).

## Consequences

- A locked project only proves its own mode; that is the intent.
- Cloudflare server mode depends on the OpenNext adapter supporting the current Next.js major; verify on upgrade (docs/deploy.md). OpenNext's build is meant for Linux/macOS/WSL, so it runs in CI or Cloudflare's build, not on Windows directly.
