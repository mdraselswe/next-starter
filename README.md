# next-starter

A strict, configurable Next.js starter for new projects. One config folder holds everything project-specific, the same code builds as a **static site** or a **full server app**, and dependencies keep themselves up to date.

- **Next.js 16** App Router · Turbopack · React Compiler · typed routes · Cache Components (server mode)
- **React 19**, **TypeScript 6** strict (`noUncheckedIndexedAccess`), **Tailwind CSS 4**, **shadcn/ui on Base UI**, **zod 4**
- **Config first:** brand, colours, fonts, text, content, features and env in `src/config`, `src/i18n`, `src/content`
- **Two render modes:** `static` (plain files, host anywhere, fully offline) or `server` (Server Actions, Cache Components); one command switches
- **Ready parts:** header with mobile menu, footer, light/dark/system theme with no flash, 404, error and loading states, SEO (metadata, sitemap, robots), optional PWA (manifest, generated app icons, offline, install instructions for iOS/Android/desktop)
- **Quality:** ESLint (import boundaries, no `process.env` outside config), Prettier, Vitest, Playwright on desktop + mobile with axe accessibility checks, husky + lint-staged + commitlint
- **Stays current:** Dependabot (3-day cooldown), auto-merge for patch/minor on green CI, a freshness gate that fails when a major or Node LTS is behind, `pnpm setup-project` that starts new projects on today's versions
- **AI-ready:** `AGENTS.md`, `CLAUDE.md`, skills in `.claude/skills/`, and `STARTER-KIT.md` (prompts from idea to launch)

## Start a new project

**With AI (recommended).** Open Claude Code in your projects folder (e.g. `E:\Code\Personal`) and say:

> /new-project — a booking site for a small dental clinic

The `new-project` skill (installed in `~/.claude/skills/`, source in `.claude/skills/new-project/`) creates the private repo from this template, updates everything to the latest versions, turns on automatic updates, applies the brand and then plans and builds the product with `STARTER-KIT.md`. It only asks you about the idea and design.

**By hand:**

```bash
gh repo create my-app --template mdraselswe/next-starter --private --clone
```

```bash
cd my-app
```

```bash
pnpm install
```

```bash
pnpm setup-project my-app
```

```bash
pnpm github-setup
```

`setup-project` renames the package, updates every dependency to its latest version (except the majors held in `version-holds.json`), installs the Playwright browser and runs the full check. `github-setup` turns on auto-merge and makes CI required on `main` (GitHub doesn't copy settings from a template). Then edit the config ([docs/configuration.md](docs/configuration.md)), pick `pnpm mode static|server`, and give your AI `STARTER-KIT.md` (Prompts 3–4 are already done).

Requirements: Node 26 LTS (`.nvmrc`; Node 24 LTS also works), pnpm (`corepack enable`), and the `gh` CLI logged in.

## Commands

| Command                         | What it does                                                            |
| ------------------------------- | ----------------------------------------------------------------------- |
| `pnpm dev`                      | Dev server (generates config-driven assets first)                       |
| `pnpm build`                    | Production build: `out/` in static mode, `.next/` in server mode        |
| `pnpm start`                    | Serve the production build in the current mode                          |
| `pnpm check`                    | Typecheck, lint, format check, unit tests, build. Run before committing |
| `pnpm test` / `pnpm test:watch` | Unit tests (Vitest)                                                     |
| `pnpm test:e2e`                 | Playwright + axe on the production build (run `pnpm build` first)       |
| `pnpm mode static\|server`      | Switch render mode (updates `site.ts` and `vercel.json`)                |
| `pnpm freshness`                | Fail if a dependency major or Node LTS is behind (CI runs it weekly)    |
| `pnpm setup-project <name>`     | First command in a new project                                          |
| `npx shadcn@latest add <name>`  | Add a shadcn/ui component                                               |

## Render modes

|                                                       | `static`                     | `server`                |
| ----------------------------------------------------- | ---------------------------- | ----------------------- |
| Output                                                | `out/` (HTML, JS, CSS)       | Next.js server          |
| Hosting                                               | Any static host              | Vercel or any Node host |
| Server Actions, cookies, request-time route handlers  | no (build fails if used)     | yes                     |
| Cache Components (`"use cache"`), Partial Prefetching | no (not supported in export) | yes                     |
| Offline (PWA)                                         | whole site precached         | pages cached as visited |

CI builds both, so code stays portable until a project commits to one. Details: [docs/adr/0001-render-modes.md](docs/adr/0001-render-modes.md).

## Deploy (Vercel)

- **Static:** `pnpm mode static` writes `vercel.json` (`framework: null`, output `out`), so the generated service worker ships. Import the repo in Vercel; nothing else to set.
- **Server:** `pnpm mode server` removes `vercel.json`; Vercel detects Next.js.
- Set `NEXT_PUBLIC_SITE_URL` in the host if it differs from `site.url`. Other hosts: build command `pnpm build`; output `out` (static) or a Node server running `pnpm start` (server).

## Staying up to date (no manual reviews)

| Layer                                                | What it does                                                                                                                            |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `.github/dependabot.yml`                             | Weekly PRs for npm and Actions, 3-day cooldown, patch/minor grouped                                                                     |
| `.github/workflows/dependabot-automerge.yml`         | Every Dependabot PR (majors too) merges itself once CI passes                                                                           |
| Ruleset "main: CI must pass" (`pnpm github-setup`)   | Nothing reaches `main` through a PR with a red `check`                                                                                  |
| Weekly Claude routine → `.claude/skills/maintain`    | Fixes Dependabot PRs that fail CI, takes held/missed majors, moves Node LTS, refreshes template defaults; pushes a `maintain/**` branch |
| `.github/workflows/maintain-pr.yml`                  | Turns a `maintain/**` push into a PR with auto-merge                                                                                    |
| `.github/workflows/freshness.yml` + `pnpm freshness` | Fails weekly if a major or Node LTS is behind without a hold                                                                            |
| `version-holds.json`                                 | Majors deliberately held back, with the reason (the routine re-checks them)                                                             |
| pnpm `minimumReleaseAge`                             | Never installs a version published less than a day ago                                                                                  |

Safety net: CI runs typecheck, lint, unit tests, both render-mode builds and Playwright + axe before anything merges. An update that breaks the build just waits (red) until the routine fixes it.

Manual major upgrades: [docs/updating.md](docs/updating.md).

### Setup (once per repo)

- `pnpm github-setup` — auto-merge, required `check`, Actions may open PRs.
- Template repo only: **Settings → General → Template repository** ✓ (already on for next-starter).
- Optional AI maintenance: GitHub connected to claude.ai (https://claude.ai/connect-github), then a weekly routine at https://claude.ai/code/routines with the prompt _"Follow .claude/skills/maintain/SKILL.md."_

## Folder map

```text
src/
  app/                routes only: layout, pages, loading, error, not-found
  config/             site.ts ✏️, features.ts ✏️, fonts.ts ✏️, routes.ts, navigation.ts, env.ts, schema.ts
  content/            page content ✏️
  i18n/               t() and messages/<locale>.ts ✏️
  components/ui/      shadcn/ui primitives + button-link, rich-text
  components/layout/  header, footer, theme script/toggle, page shell
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
- [Keeping versions current](docs/updating.md)
- [Decisions (ADRs)](docs/adr/)
- [AGENTS.md](AGENTS.md): rules for AI agents and humans
- [STARTER-KIT.md](STARTER-KIT.md): prompts from product idea to launch

## Bangla quick guide

**Notun project:** Claude Code khulo `E:\Code\Personal` folder e, tarpor likho:

> /new-project — amar idea ekhane (jemon: "ekta dental clinic er booking site")

Baki shob AI korbe: GitHub e private repo, latest version e setup, auto-update on, design ar page banano. Tomake shudhu idea ar design niye 1–2 ta proshner uttor dite hobe.

**Update:** kichu korte hobe na. Protita update PR CI pass korle nije nije merge hoy. Kono update code bhenge dile, protita mongolbar Claude-er weekly routine sheta thik kore dey. Kichu atke gele routine-er report e lekha thakbe.
