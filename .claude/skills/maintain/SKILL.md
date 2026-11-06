---
name: maintain
description: Weekly unattended maintenance. Keeps the repo on the latest versions: fixes failing Dependabot PRs, takes held or missed majors, moves Node LTS, and ships the result through a maintain/** branch that merges itself when CI passes.
---

# Maintain (runs unattended, nobody reviews)

Goal: the repo ends on the newest versions with CI green, without a person. Work only in this repo. Never use `--force`, `--legacy-peer-deps`, `--no-verify`, or weaken lint/types/tests to make something pass. Rule 0 of AGENTS.md applies: check real docs and changelogs, not memory.

## 0. Setup

```bash
corepack enable && pnpm install --frozen-lockfile && pnpm exec playwright install --with-deps chromium
```

If `gh` is installed and logged in, use it to read PRs and CI. If not, skip the parts that need it and work from `pnpm outdated` / `pnpm freshness` (step 2 covers the same ground).

## 1. Open Dependabot PRs with a failing check (needs gh)

`gh pr list --author app/dependabot --json number,title,headRefName,statusCheckRollup`. For each PR whose `check` failed:

- `git fetch origin <headRefName> && git switch <headRefName>`, `pnpm install`
- Read the failure (`gh run view --log-failed`), the package's release notes / migration guide, and run its codemod if one exists (docs/updating.md).
- Fix the code, then `pnpm check`, `pnpm build && pnpm test:e2e`, `RENDER_MODE=server pnpm build`.
- Commit (`fix(deps): adapt to <pkg> <version>`) and `git push origin <headRefName>`. The PR already has auto-merge on.
- Can't fix it safely (a peer dependency doesn't support it yet)? Add a hold (step 3) on a maintain branch and close the PR with a comment saying why.

## 2. Anything still behind

On a new branch `maintain/<YYYY-MM-DD>` from `origin/main`:

- `pnpm freshness` and `pnpm outdated`. Follow `.claude/skills/update-dependencies/SKILL.md` for every outdated package that Dependabot hasn't already opened a PR for: patch/minor with `pnpm update`, each major separately with its codemod and migration guide.
- Node: if `pnpm freshness` says a newer LTS exists, update `.nvmrc`, the `@types/node` major, docs mentioning the version (AGENTS.md, README.md, ADR 0003), and `engines.node` if the oldest supported LTS changed.
- GitHub Actions: check each `uses:` in `.github/workflows/*.yml` against its latest major tag.

## 3. Holds (version-holds.json)

For each hold, check whether the blocker is fixed (e.g. `pnpm view typescript-eslint peerDependencies`, `pnpm view eslint-config-next peerDependencies`, and the plugins it depends on). If fixed: upgrade, remove the hold from `version-holds.json` **and** the `ignore` list in `.github/dependabot.yml`. A new hold needs both files too, with the reason and today's date.

## 4. Template freshness (monthly, first run of the month)

Scaffold a throw-away app in a temp directory with `pnpm create next-app@latest` (default answers) and compare its `next.config.ts`, `tsconfig.json`, `eslint.config.mjs` and `package.json` scripts with ours. Adopt new defaults that work in both render modes; record a real decision change as a new ADR in `docs/adr/`. Then refresh shadcn primitives: re-add each one in `src/components/ui` with `npx shadcn@latest add <name> --overwrite` and re-run the checks.

## 5. Ship

If step 2–4 changed anything:

- Everything must pass: `pnpm check`, `pnpm build && pnpm test:e2e`, `RENDER_MODE=server pnpm build`, `pnpm freshness`.
- Update the STARTER-KIT.md snapshot table and AGENTS.md stack line if versions in them changed.
- Commit with Conventional Commits (`build(deps): …`, `chore: …`) and `git push -u origin maintain/<YYYY-MM-DD>`.
  `.github/workflows/maintain-pr.yml` opens the PR and turns on auto-merge; it merges when CI passes. Do not push to `main` directly.

## 6. Report

Finish with a short summary: what was updated, what was fixed, what is held and why, anything that needs a person (only if truly blocked).
