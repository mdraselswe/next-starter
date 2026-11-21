<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project guide (for AI agents and humans)

Built from **next-starter**. Read `README.md` for the overview, `docs/configuration.md` for where values live, and `docs/adr/` for decisions. For a new product, follow `STARTER-KIT.md` from Prompt 0. Starting a project from the starter: `NEW-PROJECT.md`.

Stack: Next.js 16 (App Router, Turbopack, React Compiler, typed routes) · React 19 · TypeScript 6 strict · Tailwind CSS 4 · shadcn/ui on Base UI · zod 4 · Vitest · Playwright + axe · pnpm · Node 26 LTS (`.nvmrc`; Node 24 also works). Exact versions: `package.json`. Held-back majors: `version-holds.json`.

## Commands

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm check` — typecheck + lint + format + unit tests + build. Run before every commit.
- `pnpm test:e2e` — Playwright + accessibility on the production build (`pnpm build` first)
- `pnpm mode static|server [--lock] [--host vercel|cloudflare|other]` — render mode, lock (CI builds only this mode), host config
- `pnpm locales <default> [others…]` — languages (e.g. `pnpm locales bn en`)
- `pnpm build:other` — build the other render mode (skipped when locked)
- `pnpm freshness` — fails if a dependency major or Node LTS is behind
- `pnpm auto-upgrade` — upgrade everything that passes the checks; hold what breaks (CI runs it weekly)
- `npx shadcn@latest add <component>` — add UI components (into `src/components/ui`)

## Rules (non-negotiable)

0. **Verify before you write.** Your training data is outdated. Check APIs in `node_modules/<pkg>/dist/docs` (Next), the package's own docs/changelog, or a docs MCP (Context7). Check versions with `pnpm view <pkg> version`. Never downgrade or add `--force`.
1. **Config first.** No project-specific value in components: brand/colours/SEO/render mode → `src/config/site.ts`; the look (radius, border, elevation, density, motion, texture) → `src/config/design.ts`; switches → `src/config/features.ts`; fonts → `src/config/fonts.ts`; links → `src/config/routes.ts` + `navigation.ts`; UI text → `src/i18n/messages/<locale>.ts` (every language) via `getT()` (server) / `useT()` (client); page copy/data → `src/content/` as `Record<locale, …>`; languages/time zone/currency → `site.i18n`; private sections → `site.privatePaths`; env → `src/config/env.ts` + `.env.example`. New value? Add it to the schema in `src/config/schema.ts` first.
2. **Both render modes must build** unless the project is locked (`site.renderLocked`, `pnpm mode server --lock`, with an ADR). Static mode can't use Server Actions, cookies/headers, request-time route handlers, rewrites/redirects, `next/image` optimisation or `"use cache"`. If a feature needs the server, gate it behind `site.render === "server"` or lock the project.
2a. **Languages:** pages live in `src/app/[locale]/`; link with `localeHref(locale, ROUTES.x)`; never hard-code a language or a `/en` prefix. Dates, numbers and money through `formatter` (`getFormatter` / `useFormatter`). Store time in UTC, money as integer minor units. See docs/adr/0004.
2b. **Private data:** pages for one signed-in person go under a path in `site.privatePaths` (never cached offline, disallowed in robots). Never `"use cache"` per-person data. Call `clearOfflineCache()` on sign-out. See docs/structure.md and docs/security.md.
3. **Imports:** `@/…` aliases in app code. Features import each other only through `@/features/<name>` (their `index.ts`); ESLint enforces it. Files in `src/config/` that scripts use import each other relatively with a `.ts` extension (Node runs them).
4. **process.env** only in `src/config/env.ts` (ESLint enforces it). Validate every variable with zod.
5. **TypeScript:** strict + `noUncheckedIndexedAccess`; no `any`, no `!`, no `@ts-ignore`, no disabled lint rules without a written reason.
6. **React 19 + Compiler:** no `useMemo`/`useCallback`/`memo` for performance; `ref` as a prop (no `forwardRef`); `<Context>` (no `.Provider`); `useEffectEvent` for non-reactive effect logic, never disable `exhaustive-deps`; `useSyncExternalStore` for browser state; Server Components by default, `"use client"` on the smallest interactive leaf.
7. **Hydration:** client-only values (storage, time, window) must not change server HTML: use `useMounted` or `useSyncExternalStore` with a server snapshot.
8. **UI:** shadcn tokens only (`bg-primary`, `text-muted-foreground`, status `bg-success` / `bg-warning` / `bg-info`…), never raw colours; controls and cards use the design-knob tokens (`rounded-(--control-radius)`, `h-(--control-h)`, `shadow-(--shadow-card)`…), never a fixed look (docs/design-system.md → Design knobs); preview new components on `/dev` (docs/design-system.md); Tailwind classes as literal strings combined with `cn()`; mobile first from 360px; light and dark; keyboard and screen-reader friendly; skeletons shaped like the real content (a `XSkeleton` twin + `SuspenseReveal`, docs/loading.md); toasts via `toast()` from `sonner`; respect reduced motion; animate transform/opacity only.
8a. **Motion, icons, illustrations:** follow docs/motion.md. Lightest layer first: CSS tokens and utilities (`reveal`, `draw`, `ease-*`, `duration-(--motion-*)`) → `<ViewTransition>` (`PageTransition`) → `motion/react` in a client leaf → GSAP/WebGL only on marketing pages, lazy-loaded with a poster. Never animate the LCP element at load. Lucide icons only; illustrations are hairline SVG with `currentColor` + `text-primary` accent. Components from shadcn registries (`@magicui/…`) get our tokens, `t()` text and a reduced-motion path before they ship.
9. **Tests:** pure logic in `lib/` or a feature's `*.ts` with a colocated `*.test.ts`; user flows get a Playwright test in `tests/e2e/` (axe runs there).
10. **Git:** Conventional Commits (commitlint enforces it). Husky runs eslint + prettier on staged files.

## Where things are

- `src/app/[locale]/` routes only (thin; compose components and features); `src/app/global-not-found.tsx` is the 404 outside `[locale]`, `src/app/global-error.tsx` the error page when the root layout fails (both reuse `NotFoundView` / `ErrorView` from `components/layout`)
- `src/config/` all configuration · `src/content/` page content · `src/i18n/` UI text
- `src/components/ui` shadcn primitives (+ `button-link`, `rich-text`, `inline-script`) · `src/components/layout` header, footer, theme, page shell · `src/components/motion` page transition, suspense reveal, spotlight, parallax, number ticker · `src/components/illustrations` hairline SVGs
- `src/features/<name>/` self-contained features with an `index.ts` (examples: `pwa`, `connection` for the offline / back-online banner); server logic in `features/<name>/server/`; vendor SDKs only in `src/infrastructure/<vendor>/` (docs/structure.md)
- `src/i18n/` `index.ts` (translator, formatter), `server.ts` (`getT`, `getLocale`), `client.tsx` (`useT`, `LocaleProvider`), `messages/`
- `src/hooks/`, `src/lib/` shared hooks and pure helpers
- `scripts/` build helpers run by Node directly (TypeScript type stripping)
- `tests/e2e/` Playwright

## Skills

`.claude/skills/`: `add-page`, `add-feature`, `add-motion`, `rebrand`, `update-dependencies`. Other AI tools: read the same `SKILL.md` files.

## Definition of done

Acceptance criteria met · works 360px→desktop, light/dark, keyboard · loading/empty/error states · no hard-coded project values · unit + e2e tests green · `pnpm check` passes in the current mode and `pnpm build:other` still builds (unless locked) · every language has the new text · docs/ADR updated if a decision changed.
