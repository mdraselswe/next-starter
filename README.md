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

`setup-project` renames the package, updates every dependency to its latest version (except the majors held in `version-holds.json`), installs the Playwright browser and runs the full check. On GitHub you can instead click **Use this template → Create a new repository**, clone it, and run the same last two commands.

Then:

1. Edit `src/config/site.ts` (name, URL, colours, contact, SEO), `src/config/features.ts`, `src/config/fonts.ts`, `src/i18n/messages/en.ts` and `src/content/`. Map of every value: [docs/configuration.md](docs/configuration.md).
2. Choose how it's built: `pnpm mode static` (default) or `pnpm mode server`.
3. `pnpm dev` → http://localhost:3000
4. For a new product, give your AI `STARTER-KIT.md` and say: _"Read AGENTS.md and STARTER-KIT.md. This project was created from next-starter; Prompts 3–4 are done. Run Prompt 0."_
5. Do the one-time GitHub settings below so updates merge themselves.

Requirements: Node 26 LTS (`.nvmrc`; Node 24 LTS also works) and pnpm (`corepack enable` picks the version in `package.json`).

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

## Staying up to date

| Layer                                                | Effect                                                          |
| ---------------------------------------------------- | --------------------------------------------------------------- |
| `.github/dependabot.yml`                             | Weekly PRs (npm + Actions), 3-day cooldown, patch/minor grouped |
| `.github/workflows/dependabot-automerge.yml`         | Patch/minor PRs merge themselves after CI passes                |
| `.github/workflows/freshness.yml` + `pnpm freshness` | Fails weekly/on PRs if a major is behind without a hold         |
| `version-holds.json`                                 | Majors deliberately held back, with the reason                  |
| pnpm `minimumReleaseAge`                             | Never installs a version published less than a day ago          |

Major upgrades: [docs/updating.md](docs/updating.md) (codemods first, then `pnpm check`).

### One-time GitHub settings (per repo)

1. **Settings → General → Pull Requests:** tick **Allow auto-merge**.
2. **Settings → Branches → Add branch ruleset** (or classic protection) for `main`: **Require status checks to pass**, add the **check** job (CI). Without a required check, auto-merge would merge immediately.
3. This template repo only: **Settings → General → Template repository** ✓.

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

1. Notun project: upore "Start a new project" er 4 ta command chalao (`gh repo create … --template`, `cd`, `pnpm install`, `pnpm setup-project <name>`).
2. Shudhu ei file gulo bodlao: `src/config/site.ts` (naam, rong, URL), `features.ts`, `fonts.ts`, `src/i18n/messages/en.ts`, `src/content/`.
3. Static site hole `pnpm mode static`, server/database lagle `pnpm mode server`.
4. AI ke `STARTER-KIT.md` dao, Prompt 0 theke shuru koro.
5. GitHub e ekbar "Allow auto-merge" ar `main` e required check (CI) on koro. Tarpor patch/minor update nije nije merge hobe; major update PR hishebe ashbe, ar purono hole freshness check fail kore janabe.
