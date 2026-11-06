# Project Starter Kit: strict, latest, configurable, AI-driven

Kit version 2 · last verified 2026-11-06 · works with any AI coding tool (Claude Code, Cursor, Codex, Copilot, Gemini, ChatGPT…)

Ei file ta jekono AI ke diye **scratch theke** ekta modern, strict, latest-version, sundor design er project banano ar shara jibon thik rakhar jonno.

## Kivabe use korbe

1. Notun empty folder kholo, `git init` koro, ei file ta folder e `STARTER-KIT.md` name e rakho.
2. Niche **Project profile** ta ekbar fill koro (5 minute).
3. AI ke bolo: _"Read STARTER-KIT.md fully. Then run Prompt 0."_ AI proti prompt sheshe **STOP** korbe. Tumi output dekhe `approved` (ba correction) likhbe, tarpor _"Run Prompt N"_.
4. Ekshathe shob prompt dibe na. Ekta prompt = ekta gate.
5. Project cholakalin proti 1–2 mash por, ba boro feature er age, **Prompt 10 (Freshness audit)** chalao.

> **next-starter theke shuru korle (recommended):** foundation already ready. Prompt 3 ar 4 skip koro (AI shudhu verify korbe), Prompt 2 te stack already fixed (Next.js), Prompt 5 e shudhu `src/config/site.ts` + `src/app/globals.css` tokens bodlabe. Ei repo te Configuration map er actual file: [docs/configuration.md](docs/configuration.md). AI ke bolo: _"Read AGENTS.md and STARTER-KIT.md. This project was created from next-starter; Prompts 3–4 are done. Run Prompt 0."_

> Prompts English e, karon shob AI English instruction shobcheye nikhut follow kore. `{{…}}` gulo nijer value diye bodlabe.
> Ei file e kono library er version number ba "ekhon kon ta latest" lekha **ichchha kore** rakha hoyni (shudhu niche dated Snapshot e ache). AI proti bar registry ar docs theke verify korbe, tai file ta purono hobe na.

---

## Project profile (fill once; AI reads it before every prompt)

```text
PROJECT PROFILE
Name:                 {{project name}}
Idea (1 paragraph):   {{what it is, for whom, why}}
Platforms:            {{web | web + PWA | mobile (Expo) | desktop}}
Kind:                 {{marketing site | web app/SaaS | e-commerce | dashboard | content site}}
Default stack:        Next.js (App Router) + React + TypeScript + Tailwind + shadcn/ui
                      (override here: {{e.g. "Astro", "Expo", "keep default"}})
Backend / data:       {{none (static) | Supabase | Postgres + Drizzle | Firebase | external API}}
Package manager:      {{pnpm (default) | npm | bun}}
Hosting:              {{Vercel | Cloudflare | Netlify | other}}, budget: {{free tier only?}}
Languages (UI):       {{en | bn | en + bn …}}
Reports to me in:     {{English | Bangla | Banglish}}
Git mode:             {{solo: commit + push to main after green checks | team: branch + PR per task}}
Brand (if known):     {{name, logo, colours, fonts, tone of voice}}
Design references:    {{URLs of sites/apps I like, or "suggest"}}
White-label/reuse:    {{yes: everything brand-specific must live in config | no}}
```

---

## Golden rules (apply to every prompt; later they live in AGENTS.md)

```text
GOLDEN RULES — follow strictly; they override your habits.
1. Your training data is outdated. Never write framework/library code from memory.
   Before using any API, verify it against the docs of the EXACT installed version:
   (a) docs shipped inside node_modules (e.g. node_modules/next/dist/docs/),
   (b) the official docs site, its llms.txt, or a docs MCP server (e.g. Context7),
   (c) the package's CHANGELOG / migration guide.
   If a doc marks something deprecated, use the replacement. Quote the doc path when unsure.
2. Versions come from the registry, never from memory: `<pm> view <pkg> version` and
   `<pm> view <pkg> peerDependencies`, and scaffold with the official CLI at @latest.
   Record exact versions in docs/02-tech-stack.md.
3. "Latest" means latest that works together. If a newest major breaks a peer dependency,
   take the newest compatible version, write an ADR with the reason and when to revisit,
   and tell the update bot to hold that major.
4. Runtime = current Node.js LTS. @types/node major = the Node major you run.
5. Configuration first. Nothing project-specific (names, copy, prices, colours, fonts,
   links, limits, feature switches) is hard-coded in components. It lives in src/config/,
   the design tokens, or i18n messages (see "Configuration map").
6. Ask before deciding anything not written in the docs. Batch your questions, give your
   recommended answer for each, and never ask what you can find out yourself.
   Record every decision as an ADR in docs/adr/.
7. Never weaken a check (lint rule, type flag, test, budget) to get green. Fix the cause.
   No `any`, `@ts-ignore`, disabled rules, TODOs, dead or commented-out code without a written reason.
8. Small steps. After each step: typecheck, lint, test. Stop at every STOP and show what changed.
9. Never commit secrets. Every env var is validated by a schema at startup and listed in .env.example.
10. Report honestly in the language from the profile: what was done, what failed, what was skipped.
11. If you cannot run commands in this tool, give me the exact commands and wait for my pasted output.
```

---

## Prompt 0: Discovery interview → `docs/01-product-spec.md`

```text
You are my product partner. Read the PROJECT PROFILE in STARTER-KIT.md.

Interview me before writing anything. At most 8 questions per round, grouped:
users & problem, core features, OUT of scope, platforms, languages/locales, auth,
payments, data & privacy, offline/installable, SEO/marketing, analytics, budget, success metric.

When you have enough, write docs/01-product-spec.md:
- Problem, target users / personas, what each wants
- MVP features as user stories + acceptance criteria; V2/V3 lists (not built now); non-goals
- Non-functional requirements: performance budget (e.g. Lighthouse mobile ≥ 95, CLS ≈ 0),
  accessibility (WCAG 2.2 AA), SEO, offline, security, supported devices (from 360px wide)
- Tone of voice and wording rules
STOP and wait for my review.
```

## Prompt 1: Design direction → `docs/05-design-direction.md`

```text
Read docs/01-product-spec.md and the PROJECT PROFILE (brand, design references).

1. Research: open the reference sites I gave, plus 6–10 relevant examples from the
   "Design resources" list in STARTER-KIT.md (galleries for this product kind, real-app
   patterns for each MVP screen). Note what works: layout, typography, colour, motion, density.
   Check every link still works; skip dead ones.
2. Propose 3 distinct design directions. For each: name, mood words, 2–3 reference links,
   colour palette (OKLCH, light + dark, checked for WCAG AA contrast), font pairing
   (display + text, with licence and source), radius/shadow style, motion personality,
   one hero/first-screen sketch (described or as a quick HTML mock).
3. Recommend one and say why it fits the users and the brand.
Rules: inspiration only — never copy a site's layout, art, copy or brand. Fonts and assets
must be licensed for this use.
STOP and wait for me to pick (I may mix directions).
```

## Prompt 2: Tech stack, architecture, ADRs

```text
Read docs/01-product-spec.md and docs/05-design-direction.md.

1. Propose the stack per layer (framework, UI primitives, styling, components, animation,
   state, forms/validation, data/DB, auth, testing, hosting). For each: 2 options, your pick, why
   (cost, maturity, free tier, lock-in, bundle size). Default to the PROJECT PROFILE stack.
2. For the picked stack, get CURRENT versions from the registry and the current Node LTS.
   Build a compatibility matrix of the majors (framework, React, TypeScript, ESLint and its
   plugins, test tools). Read each major library's latest upgrade/migration guide.
3. Write:
   - docs/02-tech-stack.md: table layer | package | exact version | why | docs URL;
     held-back majors with reason; a "Modern patterns we use / old patterns we forbid"
     section built from the migration guides (with links). Start from the Snapshot table in
     STARTER-KIT.md but verify every row.
   - docs/03-architecture.md: folder structure (start from "Standard folder structure"),
     layers and import boundaries, data flow, where business logic lives, how vendors are
     wrapped behind ports/adapters so they can be swapped, rendering strategy per route,
     error/loading/empty states, caching, security.
   - docs/04-database.md (if there is data): entities, relations, indexes, access rules
     (e.g. RLS), migrations-only policy (backward compatible).
   - docs/06-configuration.md: the Configuration map for THIS project — every brand,
     content, theme, feature-flag and env value, the file it lives in, and its schema.
   - docs/adr/NNNN-<slug>.md: one ADR per decision (template at the end of STARTER-KIT.md),
     including one for toolchain versions.
STOP and wait for my review.
```

## Prompt 3: Scaffold + strict tooling

```text
Scaffold using ONLY the official CLIs at @latest (e.g. `pnpm create next-app@latest`,
`pnpm dlx shadcn@latest init`). Do not copy boilerplate from memory. Verify every config
key against the installed version's docs. Then set up:

Package manager & runtime
- Package manager pinned in package.json "packageManager"; exact versions (save-exact);
  a minimum release age for new versions if the package manager supports it (supply-chain safety);
  engines.node = LTS; .nvmrc; lockfile committed; CI installs with the frozen lockfile.

TypeScript
- strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes, noImplicitOverride,
  noFallthroughCasesInSwitch, forceConsistentCasingInFileNames, moduleResolution "bundler",
  path alias "@/*" → "src/*". Typecheck script runs the framework's type generation first
  (e.g. `next typegen && tsc --noEmit`).

Framework features (verify each is current and stable before enabling)
- Typed routes, the React Compiler, Turbopack, view transitions if the design uses them.

Lint & format
- ESLint flat config with the framework presets; no-explicit-any = error;
  no-non-null-assertion = error; consistent-type-imports; no-restricted-imports enforcing the
  boundaries in docs/03-architecture.md; no direct process.env outside src/config/env.ts;
  a rule banning raw colour values in components (tokens only).
- Prettier (+ Tailwind class sorting plugin) — or Biome if chosen in the ADRs.
- .editorconfig, .gitattributes (eol=lf).

Configuration (see "Configuration map")
- src/config/env.ts: zod schemas for server env and public env; fail the build on invalid env.
- src/config/site.ts (brand, contact, SEO, locale), src/config/features.ts (feature flags),
  src/config/app.ts (tunable numbers: limits, timings, page sizes), src/config/routes.ts,
  all validated by zod. Design tokens in one CSS file (Tailwind @theme). i18n messages file(s).
- .env.example with every key and a comment; .env* ignored.

Tests
- Vitest (+ Testing Library) with co-located *.test.ts; Playwright e2e on desktop + mobile,
  with an axe accessibility check on every page.

Git hygiene
- .gitignore (CLI output + OS/editor/test output); husky + lint-staged (eslint --fix, prettier);
  commitlint with Conventional Commits.

CI (GitHub Actions; latest major of each action — check their releases)
- On push/PR: install (frozen), typecheck, lint, format:check, unit, build, e2e (upload the report
  on failure), Lighthouse CI with the budgets from the product spec.
- Renovate or Dependabot: weekly, minor/patch grouped, majors as separate PRs, held-back majors
  ignored with a link to their ADR.

Scripts: dev, build, start, typecheck, lint, lint:fix, format, format:check, test, test:e2e,
and check (= typecheck + lint + test + build).

README.md: what it is, prerequisites, setup, scripts, folder map, how to rebrand (link to
docs/06-configuration.md), deploy.

Run every script once and show they pass. STOP.
```

## Prompt 4: AI rules: AGENTS.md, CLAUDE.md, skills, MCP

```text
Write AGENTS.md — the single source of truth for any AI or human — with numbered,
non-negotiable rules:
0. Before any task: read docs/adr/, the product spec (is it MVP?), and the doc for the area.
1. Scope: build only MVP items unless I say otherwise.
2. Stack + exact versions (from docs/02-tech-stack.md) and the verify-before-write rule with
   the exact docs paths for this stack.
3. Architecture boundaries (from docs/03-architecture.md) + "ESLint enforces this".
4. Configuration first: where each kind of value lives (from docs/06-configuration.md).
5. Code: strict TS, no any, DRY (search lib/, hooks/, components/ui before writing a helper),
   zod at every boundary, Server Components by default, server actions return a Result type
   and never throw to the client, pure logic in lib/ or services/ with a test.
6. UI: design tokens only (no raw colours/sizes), i18n keys only, mobile-first, a11y,
   skeletons that match the final layout (no content spinners), respect reduced motion,
   animate transform/opacity only.
7. Data & security: migrations only, access rules on every table, rate limits, no secrets.
8. Git: the PROJECT PROFILE git mode, Conventional Commits.
9. Definition of done (copy the checklist from STARTER-KIT.md).

Write CLAUDE.md (and any tool-specific rule file the tool needs, e.g. .cursor/rules) as a thin
pointer: "Read and follow AGENTS.md", read docs/ for the feature, use the skills folder.

Create skills in .claude/skills/<name>/SKILL.md (or the tool's equivalent) for repeated jobs,
e.g. add-page, add-component, add-feature, add-config-value, db-migration, rebrand, ship-task.
Each: when to use, exact steps, files to touch, checks to run.

If the tool supports hooks, add one that runs typecheck + lint after edits.
Recommend MCP servers (docs e.g. Context7; DB; GitHub; a browser for testing) with exact config.
STOP.
```

## Prompt 5: Design system → `docs/07-design-system.md`

```text
Turn the chosen direction in docs/05-design-direction.md into a design system:
- Tokens as CSS variables (Tailwind @theme): colour (OKLCH; light + dark; any extra themes),
  type scale (fluid clamp sizes), fonts via the framework font loader (self-hosted),
  spacing, radius, shadows, blur, z-index, motion (durations, easings), breakpoints.
  Every brand-specific token comes from config so a rebrand is a config change.
- Component inventory: which primitives come from shadcn/ui (its current default base
  library), which animated pieces from the chosen effects library (at most one or two, see
  "Design resources"), and which are custom. Copy components in through the official CLI or
  registry and adapt them to our tokens; check each licence.
- Icon set; illustration/photo style and sources; empty/error/loading/skeleton patterns;
  focus styles; touch targets ≥ 44px; contrast AA in both themes.
- Motion rules: what animates and why, durations, reduced-motion fallbacks, performance limits
  (no layout-property animation, lazy-load heavy effects such as WebGL/canvas).
- A /dev (or Storybook-like) page that previews tokens, themes, components and skeletons,
  excluded from production builds or the sitemap.
STOP.
```

## Prompt 6: Roadmap

```text
Write docs/10-roadmap.md: phases (Phase 0 = foundation, done), each with small tasks
(≤ 1 day each). Each task: id, branch name phase-<N>/<id>-<slug> (team mode), acceptance
criteria, tests required, docs to update. Order by dependency. Mark the milestones where you
will show me a running build.
Write docs/11-delivery-workflow.md describing the per-task loop in Prompt 7. STOP.
```

## Prompt 7: Build loop (repeat per task)

```text
Do roadmap task {{task id}}. Follow AGENTS.md and the matching skill.
1. Re-read the docs for this area. For a big feature, first write docs/specs/<feature>.md
   (goal, UX, states, data, API, tests) and STOP for my approval.
2. List the framework/library APIs you will use and confirm each against the installed docs
   (quote the doc path).
3. Implement in small Conventional Commits, following the PROJECT PROFILE git mode. All new
   values go into config/tokens/i18n, not components. Build loading, empty and error states and
   a matching skeleton.
4. Write/extend unit tests and, for user flows, an e2e test.
5. Run typecheck, lint, format:check, unit, build, e2e. Fix causes, never weaken checks.
6. Update docs (ADR, tech stack, configuration map, roadmap tick) if anything changed.
7. Team mode: open a PR (what, why, how tested, screenshots for UI) and wait for green CI.
   Solo mode: push to main after green checks and confirm the deploy is live.
Report: what changed, what is not done, follow-ups. At milestones, show screenshots on
mobile and desktop, light and dark.
```

## Prompt 8: Launch quality pass

```text
Before launch, audit and fix, then report with evidence:
- Performance: Lighthouse mobile on every main page vs the budget; CLS ≈ 0; bundle analysis;
  images sized and lazy; fonts subset and preloaded; heavy effects lazy-loaded.
- Accessibility: axe clean, keyboard-only walkthrough, screen-reader labels, focus order,
  reduced motion, contrast in both themes.
- SEO: per-page metadata, canonical URLs, sitemap, robots, Open Graph images, structured data.
- Security: no secrets in the repo or client bundle, security headers/CSP, validated input,
  rate limits, dependency audit clean, `rel="noopener noreferrer"` on external links.
- Product: 404/500 pages, offline behaviour and install flow if a PWA, favicon/app icons that
  match the theme, empty states, legal pages (privacy, terms, cookies) if needed.
- Rebrand test: change brand name, colours and fonts in config only; the app must rebuild
  correctly with no code edits. Revert.
STOP with the report.
```

## Prompt 9: Deploy

```text
Set up hosting from the PROJECT PROFILE:
- Preview deploys per branch (team mode) and production from main; env vars per environment
  (validated by env.ts); build command and output directory set explicitly in a committed
  config file where the host supports it.
- Custom domain + HTTPS (give me the exact DNS records to add if I must do it).
- Verify the live site: every route returns 200, unknown routes 404, assets cached,
  sitemap/canonical use the real domain, the service worker/manifest load if a PWA.
- Write an ADR for the hosting setup and a "Deploy" section in the README.
Never enter my passwords or verification codes; ask me to do those steps.
STOP with the live URL and the checks.
```

## Prompt 10: Freshness audit (every 1–2 months, or before a big feature)

```text
Audit this codebase for staleness. Do not change anything yet; produce a report.

A. Dependencies
   - Run `<pm> outdated`. Table: package | current | latest | patch/minor/major.
   - For each major: read its migration guide, list the breaking changes that hit our code
     (grep for them), estimate effort, and check peers (e.g. eslint-config-*) support it.
   - Re-check held-back majors in the ADRs: can they move now?
   - Flag unused and deprecated dependencies.
   - Runtime: current Node LTS? @types/node major == Node major? CI actions on latest majors?

B. Deprecated / old patterns
   - For every framework/library in docs/02-tech-stack.md, open its upgrade guide for the
     installed version and grep the code for every deprecated API it lists.
   - Use the Snapshot table in STARTER-KIT.md as a starting checklist, then extend it.

C. Structure & configuration
   - Files in the wrong layer, boundary violations, duplicate helpers, inconsistent naming,
     feature folders missing their standard parts, stray build output not ignored.
   - Hard-coded values that belong in config/tokens/i18n.

D. Design freshness (UI projects)
   - Compare key screens with 3–5 current examples from the "Design resources" galleries.
     Suggest at most 5 improvements; don't chase trends that hurt usability or speed.

Output a prioritised list: Safe now (patch/minor + mechanical fixes), Needs decision (majors,
new framework features), Leave as is (with reason). Also propose updates to the Snapshot table
in STARTER-KIT.md with today's date. STOP and wait for me to choose. Then do "Safe now" first
and each major separately.
```

---

## Configuration map (the "change little, launch new project" rule)

Ekta notun project/client er jonno shudhu ei file gulo bodlate hobe. Code e haat lagbe na. (Generic map; next-starter e exact files: `docs/configuration.md`, jekhane colours/radius `site.ts` e ar baki tokens `src/app/globals.css` e.)

| What changes per project                | Where it lives                                                                                                                         | Validated by    |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Name, logo, contact, socials, SEO       | `src/config/site.ts`                                                                                                                   | zod schema      |
| Colours, fonts, radius, shadows, motion | Brand values in `src/config/site.ts`, set as CSS variables in the root layout; the rest in `src/styles/tokens.css` (Tailwind `@theme`) | contrast test   |
| UI text, labels, errors                 | `src/i18n/messages/<locale>.ts`                                                                                                        | typed keys      |
| Feature switches (blog, PWA, auth…)     | `src/config/features.ts`                                                                                                               | zod schema      |
| Limits, timings, page sizes, prices     | `src/config/app.ts`                                                                                                                    | zod schema      |
| Content/data (menu, products, FAQ)      | `src/content/` or the CMS/DB                                                                                                           | zod schema      |
| Routes                                  | `src/config/routes.ts` (typed routes)                                                                                                  | framework types |
| Secrets, API URLs, keys                 | `.env.*` via `src/config/env.ts`                                                                                                       | zod schema      |
| Icons, images, OG images, app icons     | `public/` + generated from tokens at build time                                                                                        | e2e checks      |

Multi-brand (white-label) option: put the brand-specific files under `src/brands/<id>/` and pick one with an env variable (`NEXT_PUBLIC_BRAND=<id>`); CI builds every brand.

---

## Standard folder structure (Next.js, feature-based, ports/adapters)

```text
.
├─ STARTER-KIT.md  AGENTS.md  CLAUDE.md  README.md  .env.example  .nvmrc  .editorconfig
├─ .claude/skills/<skill>/SKILL.md
├─ .github/workflows/ci.yml  (+ renovate.json or dependabot.yml)
├─ docs/  01-product-spec … 11-delivery-workflow, adr/, specs/
├─ e2e/                        Playwright tests (+ axe)
├─ public/
├─ supabase/migrations/        (or drizzle/, prisma/ — DB migrations, if any)
└─ src/
   ├─ app/                     routes only: page, layout, loading, error, not-found, route handlers,
   │                           metadata files (manifest, sitemap, robots, icons)
   ├─ features/<feature>/      components/, hooks/, actions.ts, queries.ts, schemas.ts, *.ts logic,
   │                           *.test.ts, index.ts (the only public entry)
   ├─ components/ui/           shared primitives (shadcn) · layout/ shells · effects/ animated pieces
   ├─ services/                business logic, framework-free, unit tested
   ├─ core/ports/              interfaces · core/domain/ types & rules
   ├─ infrastructure/<vendor>/ the ONLY place vendor SDKs are imported; container.ts wires them
   ├─ config/                  env.ts, site.ts, features.ts, app.ts, routes.ts (all zod-validated)
   ├─ content/                 static content/data files (if no CMS)
   ├─ i18n/                    messages + typed t()
   ├─ lib/                     pure helpers · hooks/ shared hooks · styles/ tokens.css, globals.css
   └─ proxy.ts                 (Next 16+ name for middleware, only if needed)
```

Small/static sites may drop `core/` and `infrastructure/` until a vendor appears (write an ADR).
Naming: files `kebab-case.ts(x)`, components `PascalCase`, hooks `use-x.ts` exporting `useX`, tests next to the file as `x.test.ts`, each data component exports a matching `XSkeleton`.

---

## Design resources (verify links still work; licences change)

Use these for **inspiration and building blocks**, never to copy a whole site. Pick **one** primitive base and **at most one or two** effects libraries per project, so the look stays coherent and the bundle small.

**Component code (copy in, then adapt to our tokens)**

| Site                                                                    | Best for                                                    | Licence (checked 2026-11)                                     |
| ----------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------- |
| [shadcn/ui](https://ui.shadcn.com)                                      | Accessible base components, blocks, CLI + registries        | MIT                                                           |
| [Base UI](https://base-ui.com)                                          | Unstyled accessible primitives (shadcn's default base now)  | MIT                                                           |
| [21st.dev](https://21st.dev)                                            | Marketplace of community shadcn-style components and blocks | per component                                                 |
| [Magic UI](https://magicui.design)                                      | Animated landing-page components (Tailwind + Motion)        | MIT                                                           |
| [React Bits](https://reactbits.dev)                                     | Text, background and cursor effects; browse by effect       | MIT + Commons Clause: OK in apps, don't resell the components |
| [Aceternity UI](https://ui.aceternity.com)                              | Bold hero sections, 3D/parallax effects                     | free + paid tiers                                             |
| [Uiverse](https://uiverse.io)                                           | Single CSS/Tailwind elements: buttons, loaders, toggles     | MIT                                                           |
| [Origin UI / coss ui](https://coss.com/ui)                              | Large set of polished form and app components               | check site                                                    |
| [Motion Primitives](https://motion-primitives.com)                      | Small, tasteful motion building blocks                      | MIT                                                           |
| [Animate UI](https://animate-ui.com)                                    | Animated versions of shadcn primitives                      | check repo                                                    |
| [Kokonut UI](https://kokonutui.com), [Cult UI](https://www.cult-ui.com) | Distinctive animated cards, dynamic-island style pieces     | MIT / check site                                              |
| [shadcnblocks](https://www.shadcnblocks.com)                            | Ready marketing and app page sections                       | free + paid                                                   |
| [registry.directory](https://registry.directory)                        | Finder for every public shadcn registry                     | —                                                             |

**Inspiration (look, don't copy)**

| Site                                                                     | Best for                                      |
| ------------------------------------------------------------------------ | --------------------------------------------- |
| [Mobbin](https://mobbin.com)                                             | Real app screens and flows (mobile + web)     |
| [Refero](https://refero.design)                                          | Searchable real-product UI patterns           |
| [Page Flows](https://pageflows.com)                                      | Recorded user flows (onboarding, checkout…)   |
| [Recent (ex-Godly)](https://recent.design)                               | Cutting-edge, motion-heavy web design         |
| [Awwwards](https://www.awwwards.com)                                     | Award-level creative sites (check usability!) |
| [Land-book](https://land-book.com), [Lapa Ninja](https://www.lapa.ninja) | Landing page structure by category            |
| [SiteInspire](https://www.siteinspire.com)                               | Calm, editorial, typographic sites            |
| [Dribbble](https://dribbble.com)                                         | Visual ideas (often not buildable as-is)      |

**Theme, colour, type, assets**

| Site                                                                             | Use                                                      |
| -------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [tweakcn](https://tweakcn.com)                                                   | Visual shadcn/Tailwind theme editor, exports CSS vars    |
| [Realtime Colors](https://www.realtimecolors.com)                                | Preview a palette and font pair on a real layout         |
| [oklch.com](https://oklch.com)                                                   | Pick/convert OKLCH colours                               |
| [Fontshare](https://www.fontshare.com), [Google Fonts](https://fonts.google.com) | Free, licensed fonts                                     |
| [Typewolf](https://www.typewolf.com), [Fontpair](https://fontpair.co)            | Font pairing ideas                                       |
| [Lucide](https://lucide.dev), [Phosphor](https://phosphoricons.com)              | Icon sets                                                |
| [Haikei](https://haikei.app)                                                     | SVG blobs, waves, gradients                              |
| [Unsplash](https://unsplash.com)                                                 | Placeholder photos (credit them; replace with real ones) |
| [Motion](https://motion.dev), [GSAP](https://gsap.com)                           | Animation libraries (verify current licence and API)     |

**Design rules that keep it modern without going stale**

- Start from the users' task, then style. A trend that slows the page or hides content is out.
- One strong idea per page (a signature hero, a bento grid, a scroll story), calm everywhere else.
- Typography does most of the work: a characterful display font + a very readable text font, fluid sizes.
- Light and dark themes from day one, both AA contrast. Colours in OKLCH tokens.
- Motion has a purpose (feedback, focus, delight), 150–400 ms, transform/opacity only, reduced-motion fallback.
- Real states: skeletons that match the layout, helpful empty states, friendly errors.
- Mobile first; thumb-reachable actions; 44px targets.

---

## Snapshot: modern-pattern checklist (verified 2026-11-06; always re-verify)

This table goes stale. Prompt 10 refreshes it from the real migration guides; update the date when it does.

| Area                  | Use                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Don't use                                                                                                                                                                                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next.js 16            | App Router; Server Components by default; `proxy.ts`; `await params/searchParams/cookies()/headers()`; `PageProps<'/route'>` from `next typegen`; `typedRoutes`; `reactCompiler`; `cacheComponents` + `"use cache"` + `cacheLife`/`cacheTag`; `updateTag` in Server Actions, `revalidateTag(tag, profile)` elsewhere; `refresh()`; Metadata API + `viewport` export; file-based icons/manifest/sitemap/robots; `next/font`; ESLint CLI; Turbopack (default); `data-scroll-behavior="smooth"` on `<html>` if you use smooth scrolling | Pages Router for new apps; `getServerSideProps`/`getStaticProps`; `next/head`; `middleware.ts`; sync request APIs; `unstable_cache`; `experimental.dynamicIO`; one-arg `revalidateTag`; `next lint`; `images.domains`; `next/legacy/image`; `--turbopack` flag |
| React 19              | `<Context value>`; `ref` as a prop; `useActionState`, `useOptimistic`, `use()`; `useEffectEvent` for non-reactive effect logic; React Compiler instead of manual memo; `useSyncExternalStore` for browser stores; `<ViewTransition>`/`<Activity>` where useful                                                                                                                                                                                                                                                                       | `Context.Provider`; `forwardRef`; `useFormState`; `defaultProps`/`propTypes`; class components; `React.FC`; fetching or deriving state in `useEffect`; disabling `exhaustive-deps`                                                                             |
| TypeScript            | strict flags (see Prompt 3); `satisfies`; `import type`; union literals / `as const` objects                                                                                                                                                                                                                                                                                                                                                                                                                                         | `any`, `enum`, `namespace`, unexplained `!`                                                                                                                                                                                                                    |
| Zod 4                 | `z.email()`, `z.url()`, `z.uuid()`, `{ error: "…" }`, `z.treeifyError`                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `z.string().email()/.url()`, `{ message }`, `.flatten()`, `errorMap`                                                                                                                                                                                           |
| Tailwind 4            | CSS-first `@import "tailwindcss"`, `@theme` tokens, `@tailwindcss/postcss`; class names as literal strings + `cn()` (clsx + tailwind-merge)                                                                                                                                                                                                                                                                                                                                                                                          | `tailwind.config.js` + `@tailwind base`; building class names from string pieces                                                                                                                                                                               |
| shadcn/ui             | `shadcn@latest init` (Base UI is the default base since 2026-07; Radix and React Aria still supported); registries for extra components                                                                                                                                                                                                                                                                                                                                                                                              | Copying old component code from blog posts                                                                                                                                                                                                                     |
| ESLint                | flat config `eslint.config.mjs` with `defineConfig`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `.eslintrc*`                                                                                                                                                                                                                                                   |
| Tooling               | Current Node LTS; exact pins + lockfile; minimum release age; Renovate/Dependabot with held-back majors ignored via ADR                                                                                                                                                                                                                                                                                                                                                                                                              | `^` ranges with no lockfile discipline; @types/node newer than the runtime                                                                                                                                                                                     |
| Known holds (2026-11) | TypeScript 7 (native) waits for typescript-eslint support; ESLint 10 waits for eslint-config-next plugins (react, import, jsx-a11y)                                                                                                                                                                                                                                                                                                                                                                                                  | Forcing a major with `--force`/`--legacy-peer-deps`                                                                                                                                                                                                            |

---

## Definition of done (every task)

- [ ] Meets the acceptance criteria; MVP scope only
- [ ] Works from 360px to desktop, light and dark, keyboard only, with reduced motion
- [ ] Loading skeleton matches the layout; empty and error states; no layout shift
- [ ] No hard-coded brand/content/text/colour values; config, tokens and i18n updated
- [ ] Unit tests for logic, e2e (+ axe) for user flows; all green
- [ ] typecheck, lint, format, build pass; no new warnings; budgets met
- [ ] No secrets; inputs validated
- [ ] Docs updated (ADR, tech stack, configuration map, roadmap)
- [ ] Conventional Commit; pushed/PR per git mode; deploy verified if solo mode

---

## Templates

### Product spec (`docs/01-product-spec.md`)

```md
# Product spec

## Problem

## Users

| Who | Wants |
| --- | ----- |

## MVP (user stories + acceptance criteria)

## Later (V2, V3)

## Non-goals

## Non-functional requirements

## Success measures
```

### ADR (`docs/adr/NNNN-short-title.md`)

```md
# NNNN. Title

**Status:** proposed | accepted | superseded by NNNN · **Date:** YYYY-MM-DD

## Context

What forces the decision.

## Decision

What we do. Options rejected and why.

## Consequences

What gets easier, what gets harder, when to revisit.
```

### AGENTS.md skeleton

```md
# Project guide

<What it is, one line.> Read docs/01-product-spec.md, docs/03-architecture.md and docs/adr/ before larger changes.

Stack: <framework + version, React, TypeScript, styling, Node LTS>. Verify APIs in installed docs, not memory.

## Commands

## Rules (numbered, non-negotiable)

## Configuration map

## Where things are

## Skills

## Definition of done
```

---

## Extra ideas (discuss before adding)

- **Spec per feature:** `docs/specs/<feature>.md` approved before building (built into Prompt 7).
- **Architecture tests:** dependency-cruiser or similar, on top of ESLint import rules.
- **Visual regression:** Playwright screenshots of key pages in both themes, compared in CI.
- **Release notes:** tag each phase; generate `CHANGELOG.md` from Conventional Commits.
- **Template repo:** after the first project built with this kit, turn its foundation (Prompts 3–5) into a GitHub template so the next project starts at Prompt 6.
- **Error monitoring and analytics:** privacy-friendly analytics and an error tracker from launch, behind feature flags.
