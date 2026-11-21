---
name: add-feature
description: Add a self-contained feature folder (components, hooks, logic, tests, public index) with a feature switch.
---

# Add a feature

1. Create `src/features/<name>/` with:
   - `components/` (React components), `use-*.ts` hooks, pure logic in `*.ts` with a colocated `*.test.ts`
   - `index.ts` exporting only what other code may use (ESLint blocks deep imports from outside)
2. If it can be turned off, add a switch to `featuresSchema` in `src/config/schema.ts`, set it in `src/config/features.ts`, and render the feature only when `features.<name>` is true.
3. Text → every file in `src/i18n/messages/` (`getT()` on the server, `useT()` in client components); data → `src/content/` (per language) or `features/<name>/server/` (queries, actions, service). See docs/structure.md.
4. Validate any external input with zod. Vendor SDKs (database, payments, email, SMS) live only in `src/infrastructure/<vendor>/` behind a small interface. Per-person data: never `"use cache"`, and its pages go under `site.privatePaths`.
5. UI: shadcn components (`npx shadcn@latest add <name>`), tokens only, light/dark, keyboard, a `XSkeleton` twin shown through `SuspenseReveal` (docs/loading.md), toasts for results, reduced motion.
6. Tests: unit tests for logic; a Playwright test for the main user path.
7. `pnpm check`, and make sure the other render mode still builds (`RENDER_MODE=server pnpm build` or static).
8. Update `docs/configuration.md` (new config values) and add an ADR for any real decision.
