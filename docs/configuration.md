# Configuration map

Everything project-specific lives in a few files. A new project changes these, not components.

| What                                                               | File                                               | Checked by                   |
| ------------------------------------------------------------------ | -------------------------------------------------- | ---------------------------- |
| Name, description, URL, locale, direction                          | `src/config/site.ts`                               | zod (`siteSchema`)           |
| Render mode (`static` / `server`)                                  | `src/config/site.ts` → `render`                    | zod; switch with `pnpm mode` |
| Brand colours, background, radius, default theme                   | `src/config/site.ts` → `theme`                     | zod; e2e axe contrast check  |
| Contact, social links, SEO title/keywords                          | `src/config/site.ts`                               | zod                          |
| Feature switches (PWA, install card, offline banner, theme toggle) | `src/config/features.ts`                           | zod                          |
| Fonts                                                              | `src/config/fonts.ts`                              | TypeScript                   |
| Routes (internal links) and sitemap pages                          | `src/config/routes.ts`                             | `typedRoutes`                |
| Header/footer links                                                | `src/config/navigation.ts`                         | TypeScript (i18n keys)       |
| UI text, labels, errors                                            | `src/i18n/messages/en.ts`                          | typed keys                   |
| Page content (hero, lists, data)                                   | `src/content/*.ts`                                 | TypeScript                   |
| Environment variables                                              | `src/config/env.ts` + `.env.example`               | zod                          |
| Design tokens beyond the brand (spacing, shadows, extra colours)   | `src/app/globals.css` (`:root`, `.dark`, `@theme`) | prettier/Tailwind            |
| Held-back package majors                                           | `version-holds.json` (+ `.github/dependabot.yml`)  | `pnpm freshness`             |

Generated from config on every `dev`/`build` (git-ignored, don't edit): `public/robots.txt`, `public/sitemap.xml`, `public/manifest.webmanifest`, `public/icons/*`, `public/sw.js`.

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

Switch with `pnpm mode static` or `pnpm mode server`. CI builds both modes, so code stays portable until you commit to one.

## Adding a config value

1. Add the field to the schema in `src/config/schema.ts` (with a comment).
2. Set it in `site.ts` or `features.ts`.
3. Read it through `import { site, features } from "@/config"`.
4. Document it in this table.
