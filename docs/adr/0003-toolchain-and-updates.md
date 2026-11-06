# 0003. Toolchain, version holds and automatic updates

**Status:** accepted · **Date:** 2026-11-06

## Context

Projects must stay on current versions without relying on memory or a paid AI, and majors sometimes can't be taken because peers lag.

## Decision

- Scaffolded with the official `create-next-app` and `shadcn` CLIs (Base UI is shadcn's default base).
- pnpm with exact versions (`saveExact`) and `minimumReleaseAge` (1 day); Dependabot with a 3-day cooldown.
- Dependabot weekly; every update (majors too) auto-merges on green CI, because the user does not review PRs. A ruleset makes the CI `check` required, so a breaking update waits instead of merging.
- No AI is required: a weekly `auto-upgrade` workflow moves Node LTS, takes minor/patch, tries each major alone, keeps what passes typecheck/lint/tests/both builds, and holds (then retries weekly) what fails. It pushes to a branch, dispatches full CI, and fast-forwards `main` only when green; otherwise it opens an issue. Holds are written to both `version-holds.json` and Dependabot's ignore list by the script.
- New projects are started by any AI tool from `NEW-PROJECT.md` (tool-agnostic instructions), not a tool-specific skill.
- `version-holds.json` lists held majors with reasons; `pnpm freshness` fails CI on any other outdated major or an old Node LTS.
- Runtime: Node 26 LTS in `.nvmrc` and CI, `@types/node` on the same major; `engines` allows Node 24 LTS too.
- Held at creation: TypeScript 7 (typescript-eslint supports < 6.1), ESLint 10 (eslint-config-next plugins).

## Consequences

- Patch/minor updates need no attention; majors surface as PRs and a failing check, never silently.
- A major that breaks our code is held automatically, so "latest" means "latest that passes the checks"; a person or any AI fixes it when the issue asks.
