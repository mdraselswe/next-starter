# Keeping versions current

No AI and no person is needed for updates. These layers work together:

| Layer                                                                | What it does                                                                                                           | Your part                              |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **Dependabot** (`.github/dependabot.yml`)                            | Weekly PRs for npm packages and GitHub Actions; waits 3 days after a release (cooldown); patch/minor grouped in one PR | none                                   |
| **Auto-merge** (`workflows/dependabot-automerge.yml`)                | Every Dependabot PR (majors too) merges itself once CI is green                                                        | `pnpm github-setup`                    |
| **Freshness gate** (`pnpm freshness`, `workflows/freshness.yml`)     | Fails weekly and on PRs if a major is behind without a hold, or Node LTS moved                                         | upgrade, or add a hold with the reason |
| **setup-project** (`pnpm setup-project <name>`)                      | A new project from this template starts on today's versions                                                            | run once                               |
| **Auto-upgrade** (`pnpm auto-upgrade`, `workflows/auto-upgrade.yml`) | Weekly: Node LTS, minor/patch, each major alone; keeps what passes, holds what fails and retries next week             | none (an issue opens if it needs you)  |

## A major is held because it breaks the checks (e.g. Next 17)

1. Read the PR's release notes and the package's migration guide.
2. Run the official codemod if there is one, then `pnpm check` and `pnpm test:e2e`:
   - Next.js: `pnpm dlx @next/codemod@latest upgrade latest`
   - React: `npx codemod@latest react/19/migration-recipe` (or the recipe the React blog names for the new major)
   - Tailwind: `npx @tailwindcss/upgrade@latest`
   - Others: search "<package> codemod" or "<package> migration guide"
3. Fix what's left (by hand or with an AI), update `AGENTS.md` and the ADRs if patterns changed, merge.
4. Can't upgrade yet (a peer dependency isn't ready)? Add an entry to `version-holds.json` **and** the `ignore` list in `.github/dependabot.yml`, with the reason. The freshness gate then passes, and it tells you when the hold may be stale.

## Monthly (5 minutes)

- Look at `pnpm freshness` output for "hold may be stale" notes.
- Check the snapshot table in `STARTER-KIT.md` is still right (or ask an AI to run its Prompt 10).
- Update this template too, so new projects start fresh.

## Node.js LTS

When a new LTS major ships, the freshness gate fails. Update `.nvmrc`, `@types/node` (same major) and, when the oldest supported LTS changes, `engines.node` in `package.json`.
