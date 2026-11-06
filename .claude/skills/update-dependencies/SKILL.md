---
name: update-dependencies
description: Bring dependencies up to date, handle a major upgrade, or fix a failing freshness check.
---

# Update dependencies

1. `pnpm auto-upgrade` first: it takes everything that passes the checks and holds the rest. Then `pnpm freshness`; an open "Auto-upgrade needs attention" issue says what failed.
2. Patch/minor: `pnpm update` then `pnpm check`. (Dependabot usually does this automatically.)
3. Each major separately:
   - Read the release notes and migration guide; check peers (`pnpm view <pkg> peerDependencies`, and which versions its plugins accept).
   - Run the official codemod if any (see docs/updating.md), then `pnpm update <pkg>@latest`.
   - `pnpm check`, `pnpm build && pnpm test:e2e`, and `RENDER_MODE=server pnpm build`.
   - Grep for APIs the guide deprecates; update AGENTS.md rules and the STARTER-KIT.md snapshot if patterns changed.
4. Blocked by a peer? Add the package to `version-holds.json` (reason, date) and to `ignore` in `.github/dependabot.yml`. Never use `--force` or `--legacy-peer-deps`.
5. Remove holds whose blocker is fixed (freshness prints "hold may be stale").
6. Node LTS moved: update `.nvmrc` and the `@types/node` major (and `engines.node` when the oldest LTS changes).
7. Commit as `build(deps): …` or `chore(deps): …`.
