# 0003. Toolchain, version holds and automatic updates

**Status:** accepted · **Date:** 2026-11-06

## Context

Projects must stay on current versions without relying on memory or a paid AI, and majors sometimes can't be taken because peers lag.

## Decision

- Scaffolded with the official `create-next-app` and `shadcn` CLIs (Base UI is shadcn's default base).
- pnpm with exact versions (`saveExact`) and `minimumReleaseAge` (1 day); Dependabot with a 3-day cooldown.
- Dependabot weekly; patch/minor auto-merge on green CI; majors reviewed (codemods first, see docs/updating.md).
- `version-holds.json` lists held majors with reasons; `pnpm freshness` fails CI on any other outdated major or an old Node LTS.
- Runtime: Node 26 LTS in `.nvmrc` and CI, `@types/node` on the same major; `engines` allows Node 24 LTS too.
- Held at creation: TypeScript 7 (typescript-eslint supports < 6.1), ESLint 10 (eslint-config-next plugins).

## Consequences

- Patch/minor updates need no attention; majors surface as PRs and a failing check, never silently.
- Holds must be kept in sync in two files (version-holds.json and dependabot.yml).
