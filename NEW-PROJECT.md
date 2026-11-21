# New project from next-starter — instructions for an AI agent

Any AI coding tool (Claude Code, Cursor, Codex, Copilot, …) can follow this file. The person gives you this file's path and their idea; you do the rest. They don't want to do things by hand: run every command yourself, ask only what you can't decide, and talk in their language (Bangla if they write Bangla).

**Starter:** local folder `E:\Code\Personal\next-starter` (GitHub: `mdraselswe/next-starter`, private).
**Where you are:** the folder the person opened for the new project. It should be empty (a `.git`, `.cursor`, `.claude`, `.vscode` or similar tool folder is fine). If it is not empty, stop and ask.

## 1. Ask once (only what's missing)

- **Idea:** what it is and who it's for, in a sentence or two.
- **Name:** default to the current folder's name (lowercase-with-dashes).
- **GitHub:** create a private GitHub repo? Default **yes** if `gh auth status` works, otherwise local only (can be added later, step 6).
- **Feel:** 3–5 words for how it should feel (e.g. "warm, caring, playful") and 2–3 sites or apps they like. If they have none, find references yourself in Prompt 1. Never default to the starter's look or its example directions.
- **Languages:** the default language (served at `/`) and any others (served at `/<code>/`), e.g. "Bangla, plus English" → `bn en`. Suggest the language the person writes in. Also the time zone and currency if not obvious (Bangladesh: `Asia/Dhaka`, `BDT`).

Decide yourself and say it in one line: render mode **server** if the idea needs login, a database, payments, an admin area or per-request data (then also `--lock`, since it can never be static); otherwise **static**. Host: **Cloudflare** when the budget is free tier and the site is commercial (Vercel's free plan is non-commercial); otherwise ask.

## 2. Get the code

First refresh the local starter so you copy the newest version (skip silently if it fails, e.g. offline):

```bash
git -C "E:/Code/Personal/next-starter" pull --ff-only
```

**With GitHub** (owner = `gh api user -q .login`):

```bash
gh repo create <owner>/<name> --template mdraselswe/next-starter --private
git clone https://github.com/<owner>/<name>.git .
```

The template copy takes a few seconds; if the clone finds an empty repo, wait 5 s and retry (up to a minute). If `gh repo create --template` fails (no access to the starter on GitHub), fall back to the local way and do step 6.

**Local only:**

```bash
git clone --depth 1 "E:/Code/Personal/next-starter" .
rm -rf .git && git init -b main
```

## 3. Set up (all must end without errors)

```bash
corepack enable
pnpm install
pnpm setup-project <name>
pnpm locales bn en      # default first; e.g. `pnpm locales en` for English only
pnpm mode static --host cloudflare   # or: pnpm mode server --lock --host cloudflare
# then set i18n.timeZone, i18n.currency and privatePaths in src/config/site.ts
```

`setup-project` renames the package, upgrades everything to the newest versions that pass the checks (`pnpm auto-upgrade`), installs the Playwright browser and runs `pnpm check`. If something fails, read the error and fix it; never use `--force`, `--legacy-peer-deps` or `--no-verify`.

## 4. Build the product

1. Read `AGENTS.md` (the project rules; your tool may load it automatically) and `STARTER-KIT.md`.
2. Prompts 3–4 of STARTER-KIT (scaffold, tooling) are already done by the template. Run **Prompt 0** (product brief) and **Prompt 1** (design direction) with the person's idea. In Prompt 1, write three new directions for this product into `src/app/[locale]/dev/directions/directions.ts` and ask the person to compare them on `/dev/directions` (run `pnpm dev`). Show each as a short, plain summary and wait for an "ok" (or changes) before building.
3. Apply the brand by following `.claude/skills/rebrand/SKILL.md` (it is plain Markdown; any tool can follow it): `src/config/site.ts`, the chosen direction into `src/config/design.ts`, colours, fonts, features, copy. Then build the direction's signature (illustration, one or two signature interactions, own 404/error/empty scenes) and go through the "Don't look like the starter" checklist in docs/design-system.md. Replace the README's first section with this project's description.
4. Continue with the remaining STARTER-KIT prompts. For pages and features follow `.claude/skills/add-page/SKILL.md` and `.claude/skills/add-feature/SKILL.md`.
5. Before every commit: `pnpm check`, and `pnpm build && pnpm test:e2e`. Commit with Conventional Commits (e.g. `feat: booking page`).

## 5. First commit and push

```bash
git add -A
git commit -m "feat: start <name> from next-starter"
git push -u origin main      # GitHub only
pnpm github-setup            # GitHub only: auto-merge + CI required on main
```

From now on the project keeps itself up to date with no AI: Dependabot PRs merge themselves when CI passes, and the weekly **Auto-upgrade** workflow takes every new version (majors too) that passes the checks. If something needs a person, GitHub opens an issue titled "Auto-upgrade needs attention".

## 6. GitHub later (if you started local only)

```bash
gh repo create <name> --private --source . --push
pnpm github-setup
```

## 7. Tell the person (simply)

- Where the project is (folder, and GitHub link if any).
- How to see it: `pnpm dev` → http://localhost:3000 (offer to start it).
- What was decided (render mode, design) and what comes next.
- Deploying: ask before connecting any hosting account; they sign in themselves.
