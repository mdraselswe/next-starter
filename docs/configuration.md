# Configuration map

Everything project-specific lives in a few files. A new project changes these, not components.

| What                                                                                                 | File                                               | Checked by                   |
| ---------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------- |
| Name, description, URL                                                                               | `src/config/site.ts`                               | zod (`siteSchema`)           |
| Languages, time zone, currency (`i18n`)                                                              | `src/config/site.ts`; set with `pnpm locales`      | zod; unit test               |
| Private paths (never cached, disallowed in robots)                                                   | `src/config/site.ts` → `privatePaths`              | zod; e2e                     |
| Render-mode lock, host                                                                               | `src/config/site.ts`; set with `pnpm mode`         | zod                          |
| Security headers                                                                                     | `src/config/security.ts`                           | e2e (server mode)            |
| Render mode (`static` / `server`)                                                                    | `src/config/site.ts` → `render`                    | zod; switch with `pnpm mode` |
| Brand colours, background, default theme                                                             | `src/config/site.ts` → `theme`                     | zod; e2e axe contrast check  |
| Look: radius, control shape, border, elevation, density, motion, texture, grey tint                  | `src/config/design.ts` (docs/design-system.md)     | zod                          |
| Contact, social links, SEO title/keywords                                                            | `src/config/site.ts`                               | zod                          |
| Feature switches (PWA, install card, offline banner, theme toggle, toaster and its default position) | `src/config/features.ts`                           | zod                          |
| Fonts (Latin + Noto Sans Bengali)                                                                    | `src/config/fonts.ts`                              | TypeScript                   |
| Routes (internal links) and sitemap pages                                                            | `src/config/routes.ts`                             | `typedRoutes`                |
| Header/footer links                                                                                  | `src/config/navigation.ts`                         | TypeScript (i18n keys)       |
| UI text, labels, errors (per language)                                                               | `src/i18n/messages/<locale>.ts` + `index.ts`       | typed keys; unit test        |
| Page content (hero, lists, data), per language                                                       | `src/content/*.ts` (`Record<locale, …>`)           | TypeScript                   |
| Environment variables                                                                                | `src/config/env.ts` + `.env.example`               | zod                          |
| Design tokens beyond the brand (status colours, spacing, shadows)                                    | `src/app/globals.css` (`:root`, `.dark`, `@theme`) | `/dev` preview               |
| Held-back package majors                                                                             | `version-holds.json` (+ `.github/dependabot.yml`)  | `pnpm freshness`             |

Generated from config on every `dev`/`build` (git-ignored, don't edit): `public/robots.txt`, `public/sitemap.xml` (every page in every language, hreflang), `public/manifest.webmanifest`, `public/icons/*`, `public/sw.js`, `public/_headers`.

More guides: [structure](structure.md) · [design system](design-system.md) · [deploy](deploy.md) · [security](security.md).

## Languages

`pnpm locales bn en` → Bangla at `/`, English at `/en/`. `pnpm locales en` → English only (no switcher). Each language needs `src/i18n/messages/<locale>.ts` (registered in `messages/index.ts`) and an entry in each `src/content` file (missing ones fall back to the default language). Details: [ADR 0004](adr/0004-i18n-routing.md).

## How colours flow

`site.theme.primary` → CSS variables `--brand` / `--brand-dark` on `<html>` (root layout) → `--primary` in `globals.css` → Tailwind/shadcn classes (`bg-primary`, `text-primary`, `ring`). The same values (converted to hex) colour the app icon and the browser theme colour. Use OKLCH (`oklch(L C H)`); pick them with [oklch.com](https://oklch.com) or [tweakcn](https://tweakcn.com) and check contrast in both themes.

## Render modes

|                                                                               | `static`                                                | `server`                  |
| ----------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------- |
| Output                                                                        | Plain files in `out/`                                   | Next.js server (`.next/`) |
| Host                                                                          | Anywhere static (Vercel, Netlify, Cloudflare Pages, S3) | Vercel or any Node host   |
| Cache Components, `"use cache"`, Partial Prefetching                          | off (not supported in export)                           | on                        |
| Server Actions, route handlers using the request, cookies, headers, redirects | not available (build fails)                             | available                 |
| Offline                                                                       | whole site precached                                    | pages cached as visited   |

Switch with `pnpm mode static` or `pnpm mode server`. CI builds both modes, so code stays portable until you commit to one with `pnpm mode server --lock` (then CI builds only that). Add `--host vercel|cloudflare|other` to write the host's config ([deploy](deploy.md)).

## Adding a config value

1. Add the field to the schema in `src/config/schema.ts` (with a comment).
2. Set it in `site.ts` or `features.ts`.
3. Read it through `import { site, features } from "@/config"`.
4. Document it in this table.
