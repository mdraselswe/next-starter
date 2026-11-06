# 0001. Static and server render modes from one codebase

**Status:** accepted · **Date:** 2026-11-06

## Context

Some projects are brochure/catalogue sites that should be plain static files (free, any host, offline); others need a server (auth, database, Server Actions). The starter must serve both without a fork.

Next.js 16's `cacheComponents` and `partialPrefetching` (on by default in `create-next-app`) cannot be used with `output: "export"` ("PPR cannot be enabled in export mode").

## Decision

`site.render` (`static` | `server`, overridable with `RENDER_MODE`) drives `next.config.ts`:

- static: `output: "export"`, `images.unoptimized`, Cache Components off
- server: `cacheComponents: true`, `partialPrefetching: true`

Both use `trailingSlash: true`, React Compiler and typed routes. `pnpm mode` switches the setting and the Vercel config. CI builds both modes.

## Consequences

- Shared code must avoid server-only APIs unless gated or the project commits to server mode (write an ADR then).
- Render-time `new Date()` / random values fail server-mode prerendering; compute them at module scope, in a client component, or behind `"use cache"` (server mode only).
