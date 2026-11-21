# next-starter

A strict, configurable Next.js starter for new projects. One config folder holds everything project-specific, the same code builds as a **static site** or a **full server app**, and dependencies keep themselves up to date.

- **Next.js 16** App Router · Turbopack · React Compiler · typed routes · Cache Components (server mode)
- **React 19**, **TypeScript 6** strict (`noUncheckedIndexedAccess`), **Tailwind CSS 4**, **shadcn/ui on Base UI**, **zod 4**
- **Config first:** brand, colours, fonts, text, content, features and env in `src/config`, `src/i18n`, `src/content`
- **Languages:** any set, chosen at setup (`pnpm locales bn en`); default at `/`, others at `/<code>/`, switcher, hreflang sitemap, typed UI text per language, `Intl` formatting in the site's time zone and currency, Noto Sans Bengali for Bangla
- **Two render modes:** `static` (plain files, host anywhere, fully offline) or `server` (Server Actions, Cache Components); one command switches, `--lock` when a project needs the server
- **Hosts:** Vercel or Cloudflare config written by `pnpm mode … --host`; security headers in both modes
- **Ready parts:** header with mobile menu, footer, light/dark/system theme with no flash, animated 404 and error pages (pointer parallax, retry that waits for the connection), loading states, SEO (metadata, sitemap, robots), optional PWA (manifest, generated app icons, offline, install instructions for iOS/Android/desktop; private paths never cached), status colour tokens, a `/dev` design-system preview, design knobs so every project gets its own look (`src/config/design.ts`: radius, border, elevation, density, motion, texture, grey tint; three directions compared live on `/dev/directions`; [docs/design-system.md](docs/design-system.md)), a motion kit (tokens, scroll reveal, SVG draw, page transitions with View Transitions, pointer spotlight, number ticker; [docs/motion.md](docs/motion.md)), animated components (dialog, sheet, popover, select, switch, tabs, toasts at any position), skeletons that hand over smoothly ([docs/loading.md](docs/loading.md)), an offline / back-online banner
- **Quality:** ESLint (import boundaries, no `process.env` outside config), Prettier, Vitest, Playwright on desktop + mobile with axe accessibility checks, husky + lint-staged + commitlint
- **Stays current:** Dependabot (3-day cooldown), auto-merge for patch/minor on green CI, a freshness gate that fails when a major or Node LTS is behind, `pnpm setup-project` that starts new projects on today's versions
- **AI-ready:** `AGENTS.md`, `CLAUDE.md`, skills in `.claude/skills/`, and `STARTER-KIT.md` (prompts from idea to launch)

## Start a new project

Works with any AI coding tool (Claude Code, Cursor, Codex, …). No AI subscription needed afterwards.

1. Make an empty folder named after the project, e.g. `E:\Code\Personal\dental-clinic`, and open it in your AI tool.
2. Say:

   > Read `E:\Code\Personal\next-starter\NEW-PROJECT.md` and follow it. Idea: a booking site for a small dental clinic.

The AI creates the private GitHub repo from this template (or a local copy), upgrades everything to the newest versions, sets up automatic updates, then plans the product with you (it asks for an "ok" on the brief and the design) and builds it. Every step is in [NEW-PROJECT.md](NEW-PROJECT.md), so you can also do it by hand.

Requirements: Node 26 LTS (`.nvmrc`; Node 24 LTS also works), pnpm (`corepack enable`), git, and the `gh` CLI logged in for GitHub.

## Commands

| Command                           | What it does                                                               |
| --------------------------------- | -------------------------------------------------------------------------- |
| `pnpm dev`                        | Dev server (generates config-driven assets first)                          |
| `pnpm build`                      | Production build: `out/` in static mode, `.next/` in server mode           |
| `pnpm start`                      | Serve the production build in the current mode                             |
| `pnpm check`                      | Typecheck, lint, format check, unit tests, build. Run before committing    |
| `pnpm test` / `pnpm test:watch`   | Unit tests (Vitest)                                                        |
| `pnpm test:e2e`                   | Playwright + axe on the production build (run `pnpm build` first)          |
| `pnpm mode static\|server`        | Render mode; `--lock`, `--host vercel\|cloudflare\|other` (docs/deploy.md) |
| `pnpm locales <default> [others]` | Languages, e.g. `pnpm locales bn en`                                       |
| `pnpm build:other`                | Build the other render mode (skipped when locked)                          |
| `pnpm freshness`                  | Fail if a dependency major or Node LTS is behind (CI runs it weekly)       |
| `pnpm setup-project <name>`       | First command in a new project                                             |
| `npx shadcn@latest add <name>`    | Add a shadcn/ui component                                                  |

## Render modes

|                                                       | `static`                     | `server`                |
| ----------------------------------------------------- | ---------------------------- | ----------------------- |
| Output                                                | `out/` (HTML, JS, CSS)       | Next.js server          |
| Hosting                                               | Any static host              | Vercel or any Node host |
| Server Actions, cookies, request-time route handlers  | no (build fails if used)     | yes                     |
| Cache Components (`"use cache"`), Partial Prefetching | no (not supported in export) | yes                     |
| Offline (PWA)                                         | whole site precached         | pages cached as visited |

CI builds both, so code stays portable until a project commits to one with `pnpm mode server --lock`. Details: [docs/adr/0001-render-modes.md](docs/adr/0001-render-modes.md), [0006](docs/adr/0006-render-lock-hosts-headers.md).

## Deploy (Vercel)

- **Static:** `pnpm mode static` writes `vercel.json` (`framework: null`, output `out`), so the generated service worker ships. Import the repo in Vercel; nothing else to set.
- **Server:** `pnpm mode server` removes `vercel.json`; Vercel detects Next.js.
- Set `NEXT_PUBLIC_SITE_URL` in the host if it differs from `site.url`. Other hosts: build command `pnpm build`; output `out` (static) or a Node server running `pnpm start` (server).

## Staying up to date (no AI, no manual reviews)

Everything below runs on GitHub's free automation. Nobody has to review or merge anything.

| Layer                                              | What it does                                                                                                                                                                                                                       |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.github/dependabot.yml`                           | Weekly PRs for npm and Actions, 3-day cooldown, patch/minor grouped                                                                                                                                                                |
| `workflows/dependabot-automerge.yml`               | Every Dependabot PR (majors too) merges itself once CI passes                                                                                                                                                                      |
| Ruleset "main: CI must pass" (`pnpm github-setup`) | Nothing with a red `check` reaches `main`                                                                                                                                                                                          |
| `workflows/auto-upgrade.yml` + `pnpm auto-upgrade` | Every Monday: moves Node LTS, takes all minor/patch, tries each major alone; keeps what passes the checks, holds what breaks and tries it again next week, removes holds that work now. Ships only after full CI (with e2e) passes |
| `version-holds.json`                               | Versions that currently break the checks (kept in sync with Dependabot's ignore list automatically)                                                                                                                                |
| `workflows/freshness.yml` + `pnpm freshness`       | Fails if something is behind without a hold                                                                                                                                                                                        |
| pnpm `minimumReleaseAge`                           | Never installs a version published less than a day ago                                                                                                                                                                             |

What still needs a person (or any AI): a major that breaks the checks stays held until its own ecosystem catches up (the weekly run picks it up then, no action needed) or someone fixes our code for it. When the run can't finish, GitHub opens an issue **"Auto-upgrade needs attention"** with instructions; you get an email. Codemods and migration notes: [docs/updating.md](docs/updating.md).

New projects copy all of this, and `setup-project` runs the auto-upgrade first, so a new project starts on the newest versions even if this template is a week behind.

### Setup (once per repo)

- `pnpm github-setup`: auto-merge on, `check` required on `main` (already done for next-starter).
- Template repo only: **Settings → General → Template repository** ✓ (already on).

## Folder map

```text
src/
  app/[locale]/       routes only: layout, pages, loading, error, not-found, dev (preview)
  app/global-not-found.tsx  404 outside [locale]
  app/global-error.tsx      error page when the root layout fails
  config/             site.ts ✏️, features.ts ✏️, fonts.ts ✏️, routes.ts, navigation.ts, env.ts, schema.ts
  content/            page content ✏️
  i18n/               translator/formatter, getT (server), useT (client), messages/<locale>.ts ✏️
  components/ui/      shadcn/ui primitives + button-link, rich-text
  components/layout/  header, footer, theme script/toggle, page shell
  components/motion/  page transition, suspense reveal, spotlight, number ticker
  components/illustrations/  hairline SVG illustrations
  features/<name>/    self-contained features with an index.ts (pwa)
  hooks/  lib/        shared hooks and pure helpers
scripts/              generate-assets, postbuild, set-mode, freshness, setup-project, start
tests/e2e/            Playwright + axe
docs/                 configuration, updating, adr/
.claude/skills/       add-page, add-feature, rebrand, update-dependencies
STARTER-KIT.md        prompts from idea to launch for any AI
```

✏️ = edit per project.

## Docs

- [Configuration map](docs/configuration.md)
- [Code structure](docs/structure.md) · [Design system](docs/design-system.md) · [Motion and illustration](docs/motion.md) · [Loading](docs/loading.md) · [Deploy](docs/deploy.md) · [Security](docs/security.md)
- [Keeping versions current](docs/updating.md)
- [Decisions (ADRs)](docs/adr/)
- [AGENTS.md](AGENTS.md): rules for AI agents and humans
- [STARTER-KIT.md](STARTER-KIT.md): prompts from product idea to launch

## Bangla quick guide

**Notun project (je kono AI tool diye: Claude, Cursor, Codex):**

1. Project er naame ekta khali folder banao, jemon `E:\Code\Personal\dental-clinic`, ar sheta AI tool e khulo.
2. AI ke likho:

   > Read `E:\Code\Personal\next-starter\NEW-PROJECT.md` and follow it. Idea: (tomar idea)

Baki shob AI korbe. Tomake shudhu idea, bhasha (jemon "Bangla, sathe English"), ar plan/design e "ok" dite hobe.

**Bhasha:** `pnpm locales bn en` mane Bangla `/` e, English `/en/` e. Shudhu English hole `pnpm locales en`. UI lekha `src/i18n/messages/` e, page er lekha `src/content/` e protita bhashar jonno.

**Login/dashboard wala app:** `pnpm mode server --lock --host cloudflare`. Account/dashboard er path `privatePaths` e rakho, tahole offline cache e kokhono jabe na.

**Update:** kichu korte hobe na, AI-o lagbe na.

- Protita shombar GitHub nije-i shob package ar Node LTS update kore, test chalay, ar pass korle `main` e merge kore.
- "Latest" mane test pass kore emon shobcheye notun version. Kono notun version code bhangle sheta hold e thake (`version-holds.json`, jemon ekhon TypeScript 7), ar protita shoptahe abar try hoy. Pass korle nije-i upgrade hoye hold uthe jay.
- Kokhono atke gele GitHub ekta issue khulbe ("Auto-upgrade needs attention") ar tomake email dibe.

**GitHub Actions bondho thakle** (jemon account/billing lock): automatic update cholbe na, kintu code ar website-er kono khoti hobe na. Tokhon nijer computer e ei folder e chalao:

```bash
pnpm auto-upgrade
```

Tarpor `pnpm test:e2e` pass korle commit kore push koro, ba je kono AI ke bolo: "Run pnpm auto-upgrade, verify, commit and push."
