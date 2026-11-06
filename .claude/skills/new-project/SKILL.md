---
name: new-project
description: Start a brand-new project from the mdraselswe/next-starter template — creates the private GitHub repo, sets it up on the latest versions, applies the brand, turns on automatic updates, and then plans and builds the product with STARTER-KIT.md. Use when the user says "new project", "notun project", or describes a new site/app to build.
---

# New project from next-starter

The user does nothing by hand. Ask only for what you can't decide yourself, in **one** question round, and reply in the user's language (Bangla if they write Bangla).

## 1. What you need (ask only the missing ones)

- **Project idea**: what it is and who it's for (one or two sentences is enough).
- **Name**: suggest one if not given; repo/package name is lowercase-with-dashes.
- Everything else (render mode, colours, fonts, pages) you propose yourself later in Prompt 0/1 of STARTER-KIT.md.

Render mode: `server` if the idea needs login, a database, payments, admin, or data that changes per request; otherwise `static`. Say which you picked and why in one line.

## 2. Create the repo (in the parent folder of the user's projects, e.g. `E:\Code\Personal`)

```bash
gh repo create mdraselswe/<name> --template mdraselswe/next-starter --private --clone
```

If cloning fails right after creation (the template copy takes a few seconds), wait and run `gh repo clone mdraselswe/<name>`. Then work inside `<name>/` (open it as the session folder if your app supports that).

## 3. Set up

```bash
pnpm install
pnpm setup-project <name>     # latest versions, playwright, full check
pnpm github-setup              # auto-merge, CI required on main, Actions may open PRs
pnpm mode static               # or: pnpm mode server
```

`setup-project` must end green. If an update breaks something, fix it (see `.claude/skills/update-dependencies`) — never pin back without a hold.

## 4. Brand and plan

1. Read `AGENTS.md` and `STARTER-KIT.md`. Prompts 3–4 (scaffold, tooling) are already done by the template.
2. Run **Prompt 0** (product brief) and **Prompt 1** (design direction) with the user's idea; show the brief and the design in a short, simple form and get one "ok".
3. Apply the brand with `.claude/skills/rebrand/SKILL.md` (site.ts, colours, fonts, features, copy). Replace the README's first section with this project's description.
4. Continue with the remaining STARTER-KIT prompts (pages and features) using `add-page` / `add-feature` skills.

## 5. Ship and keep it updated

- `pnpm check`, `pnpm build && pnpm test:e2e`, Conventional Commit, `git push`.
- Dependabot, auto-merge and the freshness check came with the template and `pnpm github-setup`.
- Offer once: a weekly cloud routine that runs `.claude/skills/maintain` on this repo (same as next-starter's), so majors and failing updates are fixed without the user. It needs GitHub connected to claude.ai (https://claude.ai/connect-github).
- Deploy: static → any static host (or Vercel); server → Vercel. Ask before connecting a host account; the user signs in themselves.

## 6. Tell the user

In simple words: the repo link, the local folder, how to see it (`pnpm dev` → http://localhost:3000, or you start it for them), and what happens next.
