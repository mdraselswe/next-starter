---
name: rebrand
description: Turn the starter (or an existing project) into a new brand/project by changing config only.
---

# Rebrand / start a new project

1. `pnpm setup-project <package-name>` (renames, updates to the latest versions, runs the full check). Skip if already done.
2. `src/config/site.ts`: name, shortName, description, url, locale, dir, contact, socials, seo, and `theme`:
   - `primary` / `primaryForeground` per theme in OKLCH; check WCAG AA contrast in light and dark
   - `background` per theme (also used for the app icon and browser UI), `radius`, `defaultMode`
3. `src/config/fonts.ts`: pick display/text fonts (next/font/google or next/font/local).
4. `src/config/features.ts`: turn features on/off.
5. `src/i18n/messages/en.ts` (UI text) and `src/content/` (page copy). Add a locale if needed.
6. Optional deeper look: other tokens in `src/app/globals.css` (`:root`, `.dark`). Use tweakcn.com to generate a shadcn theme and paste the variables.
7. `pnpm mode static|server` for hosting.
8. `pnpm check && pnpm test:e2e`. Look at `public/icons/icon-512.png` to confirm the app icon.
9. Replace README's first section with the project's own description.
