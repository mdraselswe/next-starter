<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project guide (for AI agents and humans)

Built from **next-starter**. Read `README.md` for the overview, `docs/configuration.md` for where values live, and `docs/adr/` for decisions. For a new product, follow `STARTER-KIT.md` from Prompt 0.

Stack: Next.js 16 (App Router, Turbopack, React Compiler, typed routes) · React 19 · TypeScript 6 strict · Tailwind CSS 4 · shadcn/ui on Base UI · zod 4 · Vitest · Playwright + axe · pnpm · Node 26 LTS (`.nvmrc`; Node 24 also works). Exact versions: `package.json`. Held-back majors: `version-holds.json`.

## Commands

- `pnpm dev` / `pnpm build` / `pnpm start`
- `pnpm check` — typecheck + lint + format + unit tests + build. Run before every commit.
- `pnpm test:e2e` — Playwright + accessibility on the production build (`pnpm build` first)
- `pnpm mode static|server` — switch render mode (also updates vercel.json)
- `pnpm freshness` — fails if a dependency major or Node LTS is behind
- `npx shadcn@latest add <component>` — add UI components (into `src/components/ui`)

## Rules (non-negotiable)

0. **Verify before you write.** Your training data is outdated. Check APIs in `node_modules/<pkg>/dist/docs` (Next), the package's own docs/changelog, or a docs MCP (Context7). Check versions with `pnpm view <pkg> version`. Never downgrade or add `--force`.
1. **Config first.** No project-specific value in components: brand/colours/SEO/render mode → `src/config/site.ts`; switches → `src/config/features.ts`; fonts → `src/config/fonts.ts`; links → `src/config/routes.ts` + `navigation.ts`; UI text → `src/i18n/messages/*.ts` via `t()`; page copy/data → `src/content/`; env → `src/config/env.ts` + `.env.example`. New value? Add it to the schema in `src/config/schema.ts` first.
2. **Both render modes must build.** Static mode can't use Server Actions, cookies/headers, request-time route handlers, rewrites/redirects, `next/image` optimisation or `"use cache"`. If a feature needs the server, gate it behind `site.render === "server"` or document that the project is server-only (ADR). CI builds both.
3. **Imports:** `@/…` aliases in app code. Features import each other only through `@/features/<name>` (their `index.ts`); ESLint enforces it. Files in `src/config/` that scripts use import each other relatively with a `.ts` extension (Node runs them).
4. **process.env** only in `src/config/env.ts` (ESLint enforces it). Validate every variable with zod.
5. **TypeScript:** strict + `noUncheckedIndexedAccess`; no `any`, no `!`, no `@ts-ignore`, no disabled lint rules without a written reason.
6. **React 19 + Compiler:** no `useMemo`/`useCallback`/`memo` for performance; `ref` as a prop (no `forwardRef`); `<Context>` (no `.Provider`); `useEffectEvent` for non-reactive effect logic, never disable `exhaustive-deps`; `useSyncExternalStore` for browser state; Server Components by default, `"use client"` on the smallest interactive leaf.
7. **Hydration:** client-only values (storage, time, window) must not change server HTML: use `useMounted` or `useSyncExternalStore` with a server snapshot.
8. **UI:** shadcn tokens only (`bg-primary`, `text-muted-foreground`…), never raw colours; Tailwind classes as literal strings combined with `cn()`; mobile first from 360px; light and dark; keyboard and screen-reader friendly; skeletons shaped like the real content; respect reduced motion; animate transform/opacity only.
9. **Tests:** pure logic in `lib/` or a feature's `*.ts` with a colocated `*.test.ts`; user flows get a Playwright test in `tests/e2e/` (axe runs there).
10. **Git:** Conventional Commits (commitlint enforces it). Husky runs eslint + prettier on staged files.

## Where things are

- `src/app/` routes only (thin; compose components and features)
- `src/config/` all configuration · `src/content/` page content · `src/i18n/` UI text
- `src/components/ui` shadcn primitives (+ `button-link`, `rich-text`) · `src/components/layout` header, footer, theme, page shell
- `src/features/<name>/` self-contained features with an `index.ts` (example: `pwa`)
- `src/hooks/`, `src/lib/` shared hooks and pure helpers
- `scripts/` build helpers run by Node directly (TypeScript type stripping)
- `tests/e2e/` Playwright

## Skills

`.claude/skills/`: `new-project`, `add-page`, `add-feature`, `rebrand`, `update-dependencies`, `maintain` (weekly unattended updates). Other AI tools: read the same `SKILL.md` files.

## Definition of done

Acceptance criteria met · works 360px→desktop, light/dark, keyboard · loading/empty/error states · no hard-coded project values · unit + e2e tests green · `pnpm check` passes in the current mode and `RENDER_MODE=server pnpm build` (or static) still builds · docs/ADR updated if a decision changed.
