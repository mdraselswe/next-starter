# Design system: theme and component guide

Preview everything at **`/dev`** (`pnpm dev`, then http://localhost:3000/dev/), and design directions at **`/dev/directions`**. Both are 404s in production.

## Theme: how colour flows

```text
src/config/site.ts theme.primary / primaryForeground / background   (per light & dark, OKLCH)
  → CSS variables on <html> (--brand, --brand-dark, --page-bg…)       brand-style.ts
  → shadcn tokens in globals.css (:root / .dark: --primary, --background…)
  → Tailwind classes (bg-primary, text-primary-foreground, ring…)
```

| Token                                                                        | Use for                                              | From        |
| ---------------------------------------------------------------------------- | ---------------------------------------------------- | ----------- |
| `background` / `foreground`                                                  | page                                                 | site.ts     |
| `primary` / `primary-foreground`                                             | main actions, links, focus ring, sidebar active item | site.ts     |
| `card`, `popover`, `secondary`, `muted`, `accent`, `border`, `input`, `ring` | surfaces and quiet UI                                | globals.css |
| `destructive`                                                                | delete, errors                                       | globals.css |
| `success` / `success-foreground`                                             | verified, paid, done                                 | globals.css |
| `warning` / `warning-foreground`                                             | pending, needs attention                             | globals.css |
| `info` / `info-foreground`                                                   | neutral notices, "sponsored"-style labels            | globals.css |
| `chart-1…5`                                                                  | charts (see the dataviz rules before using)          | globals.css |

Rules: tokens only (no raw colours in components); every new token gets a light **and** dark value with AA contrast; brand-specific values come from `site.ts`, the rest live in `globals.css`. Generate a full palette with [tweakcn](https://tweakcn.com) and paste the variables if a project needs more than the brand colour.

## Design knobs: every project its own look

The starter gives quality (states, motion timing, accessibility) and **knobs**, never a fixed look. Three layers:

1. **Quality floor (same in every project, users feel it but don't "see" it):** focus, hover, press, disabled, loading and error states; motion timing; reduced motion; skeletons; toasts; offline banner.
2. **Knobs (different per project):** `src/config/design.ts`, plus colours in `site.theme` and fonts in `fonts.ts`.
3. **Signature (made by hand per project):** illustration or mascot, one or two signature interactions, the hero, the 404/error/empty scenes, layout rhythm.

| Knob           | Values                                      | Changes                                                                           |
| -------------- | ------------------------------------------- | --------------------------------------------------------------------------------- |
| `radius`       | e.g. `"0.625rem"`                           | every corner (cards, menus, dialogs scale from it)                                |
| `controlShape` | `rounded`, `pill`                           | buttons, inputs, selects, tabs                                                    |
| `border`       | `none`, `hairline`, `bold`                  | lines on controls, cards, menus (none: fills and shadows; bold: 2px, text colour) |
| `elevation`    | `flat`, `soft`, `tactile`, `offset`, `glow` | shadows, hover lift, press (tactile: light from above; offset: sticker shadow)    |
| `density`      | `compact`, `comfortable`, `airy`            | control heights, padding, card padding                                            |
| `motion`       | `crisp`, `smooth`, `bouncy`                 | durations and easings (`--motion-*`, `--ease-ui`, `--ease-press`)                 |
| `texture`      | `none`, `grain`, `grid`, `dots`             | page background                                                                   |
| `neutral`      | `{ hue, chroma }`                           | tint of every grey (warm, cool, or pure)                                          |

How it works: `<html>` gets `data-elevation="tactile"` and friends (`brand-style.ts`); `globals.css` turns each into tokens (`--shadow-control`, `--control-h`, `--ease-press`…); `components/ui` read only those tokens. So a new shadcn component should use the tokens too: `rounded-(--control-radius)`, `h-(--control-h)`, `border-(length:--border-w) border-(--line)`, `shadow-(--shadow-card)`, `ease-(--ease-ui)`. Any element with `data-design` + the attributes previews another look inside the page (that is how `/dev/directions` works).

**Opt-in effects** (work with any knobs): `<Button effect="shine">` (a light sweeps across), `<Button effect="beam">` (a light runs around the border), `<Card interactive>` (lifts on hover), the `edge` utility (a light layer on any element's border line, for your own glow effects), `animate-wiggle` / `animate-pop` / `animate-hop` / `animate-shake` for little reactions.

### Choosing the look (new project)

STARTER-KIT Prompt 1: the AI researches the product's own references, writes **three new directions** into `src/app/[locale]/dev/directions/directions.ts` (knob values, primary colour, references, signature ideas), and you compare them on **`/dev/directions`** with the real components. Pick or mix; the values go into `design.ts`, `site.theme` and `fonts.ts`. The three directions that ship with the starter are only examples; never reuse them as they are.

### Don't look like the starter (checklist before launch)

- [ ] `design.ts` is not the default (the defaults are deliberately plain).
- [ ] Own font pairing in `fonts.ts` (not Geist alone).
- [ ] Own primary colour and neutral tint; AA contrast in light and dark.
- [ ] At least one signature interaction that belongs to this product.
- [ ] Own illustration style; the starter's 404 planet and error plug are replaced.
- [ ] The home page's first screen doesn't follow the starter's hero layout.

## Type

- Fonts in `src/config/fonts.ts`: Geist for Latin, **Noto Sans Bengali** for Bangla. Both are in every stack (`font-sans`, `font-heading`), so mixed lines render correctly. The Bangla font is preloaded only when Bangla is the default language (`pnpm locales`); otherwise it downloads only on pages that contain Bangla.
- `:lang(bn)` gets a taller line height (vowel signs above and below the line).
- Headings: `font-heading`, `text-balance`. Paragraphs: `text-pretty`, `max-w-2xl` for reading width.

## Components

| Where                           | What                                                                                                                                                                                                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/ui/`            | shadcn primitives (Base UI): button, input, textarea, label, select, checkbox, switch, dialog, sheet, popover, tooltip, dropdown-menu, tabs, card, badge, avatar, separator, skeleton, sonner (toasts). Add more with `npx shadcn@latest add <name>` |
| `src/components/layout/`        | header, footer, theme toggle, language switcher, page shell, status scene (404, error)                                                                                                                                                               |
| `src/components/motion/`        | page transition, suspense reveal, spotlight, parallax, number ticker (docs/motion.md)                                                                                                                                                                |
| `src/components/illustrations/` | hairline SVG illustrations (docs/motion.md)                                                                                                                                                                                                          |
| `src/features/<name>/`          | feature-specific components, exported through the feature's `index.ts`                                                                                                                                                                               |

Adding a component:

1. `npx shadcn@latest add <name>`; keep its token classes, never hard-code colours.
2. Text through `t()` / `useT()`; no strings in the component.
3. Check: 360px wide, light and dark, keyboard only, screen reader label, `prefers-reduced-motion`.
4. Loading state: a `XSkeleton` twin in the same file and shape, shown through `SuspenseReveal` ([docs/loading.md](loading.md)). Empty and error states for data components. Motion: match the component table in [docs/motion.md](motion.md#components-how-each-one-moves).
5. Add its variants to `/dev` (`src/app/[locale]/dev/page.tsx`).

Forms: zod schema shared by client and server; Server Action with `useActionState` for submit state; errors under each field with `aria-describedby`; never trust client-side validation alone.

## Motion, icons, illustrations

See **[docs/motion.md](motion.md)**: when to use CSS, View Transitions, Motion, GSAP or WebGL; motion tokens; icon rules; the illustration house style; adding animated components from registries such as Magic UI.

## Brand guide (per project)

The starter has no brand. Each project writes `docs/05-design-direction.md` (STARTER-KIT Prompt 1): logo, colours, type, tone of voice (in each language), motion personality (which easing, how playful), photo/illustration style, do/don't examples. Its values go into `site.ts`, `fonts.ts` and `globals.css`, never into components.
