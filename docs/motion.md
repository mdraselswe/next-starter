# Motion, icons and illustration guide

How this starter makes interfaces feel alive without making them slow. Preview everything at **`/dev`** (Motion section). Tokens live in `src/app/globals.css`; components in `src/components/motion/` and `src/components/illustrations/`.

## Principles

1. **Every animation has a job:** feedback (a press, a save), orientation (where did this panel come from), focus (look here), or one moment of delight per page. Decoration that delays the task is out.
2. **One signature moment per page** (a drawn hero, a morphing card, a scroll story). Everything else stays quiet.
3. **Animate `transform` and `opacity` only.** Never width, height, top/left or margins (layout jank). `filter: blur` sparingly.
4. **150–400 ms.** Small things fast, big things slower. Exits faster than entrances.
5. **Reduced motion is a real mode.** Content must be complete and visible without any animation. The global rule in `globals.css` stops CSS animation; JS animation checks `useReducedMotion()` / `matchMedia`.
6. **The LCP element is never hidden at load.** Don't fade in the hero heading or hero image; animate the things around it.
7. **Test on a mid-range Android phone** (most of our users), not only a laptop. 60 fps or cut it.

## Pick the lightest layer that does the job

| Layer               | Tool                                                                                   | Use for                                                                                   | Cost                           |
| ------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------ |
| 0. CSS              | tokens, `reveal`, `draw`, Tailwind `transition-*`, `tw-animate-css`, `@starting-style` | hover/press, menus, scroll reveals, drawing SVG lines, skeleton shimmer                   | 0 KB JS                        |
| 1. View Transitions | React `<ViewTransition>` (`PageTransition`)                                            | page changes, a list card growing into its detail page, Suspense skeleton → content       | 0 KB JS                        |
| 2. Motion           | `motion/react` (installed)                                                             | gestures (drag, swipe sheets), springs, layout/reorder, `AnimatePresence` exits, counters | ~ tens of KB, client leaf only |
| 3. GSAP             | `gsap` + `@gsap/react` (add when needed)                                               | long timelines, scroll-scrubbed stories, SVG morphs, text splitting on marketing pages    | ~ 25–70 KB, per page           |
| 4. Canvas / WebGL   | Rive, dotLottie, Three.js / React Three Fiber (add when needed)                        | interactive mascots, 3D hero, particle backgrounds                                        | 100 KB–1 MB, lazy only         |

Rule of thumb: an app screen (dashboard, forms, chat) stays in layers 0–2. Layers 3–4 belong to landing/marketing pages and are loaded only on those pages.

## Tokens

```css
/* globals.css */
--motion-fast: 150ms; /* hover, press */
--motion-base: 250ms; /* menus, toggles */
--motion-slow: 400ms; /* page transitions, panels */
--motion-stagger: 60ms;
/* Tailwind utilities: ease-out-quart, ease-out-expo, ease-in-out-quart, ease-spring */
```

Use them in classes: `transition-transform duration-(--motion-fast) ease-out-quart`. A project changes its whole feel with the `motion` knob in `src/config/design.ts` (`crisp`, `smooth`, `bouncy`): it sets the `--motion-*` durations plus `--ease-ui` (menus, dialogs, tabs) and `--ease-press` (buttons, switch). Use those two in new components instead of a fixed curve (docs/design-system.md → Design knobs).

## What is built in

| Piece                       | Where                                    | Notes                                                                                                                                                                             |
| --------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reveal` utility            | `globals.css`                            | Fade-and-rise as an element scrolls in. Pure CSS scroll-driven animation. Stagger with `style={{ "--i": index }}`. Never on above-the-fold content.                               |
| `draw` utility              | `globals.css`                            | Draws an SVG stroke by stroke. Each shape needs `pathLength={1}`; order with `--i`.                                                                                               |
| `PageTransition`            | `components/motion/page-transition.tsx`  | Fade + lift on navigation. `PageShell` uses it; wrap custom pages yourself. The header stays still (`view-transition-name: site-header`).                                         |
| `Spotlight`                 | `components/motion/spotlight.tsx`        | Pointer-following brand glow on cards. CSS variables only.                                                                                                                        |
| `NumberTicker`              | `components/motion/number-ticker.tsx`    | Counts up in the page language (৳, Bangla digits) when it scrolls into view; server HTML has the final number.                                                                    |
| Press spring                | classes                                  | `transition-transform duration-(--motion-base) ease-spring active:scale-90` on buttons that deserve it (like, add to cart).                                                       |
| `EmptyBox`                  | `components/illustrations/empty-box.tsx` | Example hairline illustration for empty states.                                                                                                                                   |
| `Planet`, `Unplugged`       | `components/illustrations/`              | The 404 "0" (ringed planet, orbiting moon) and the error scene (plug and socket with a flickering spark; `connecting` slides them together).                                      |
| `StatusScene`               | `components/layout/status-scene.tsx`     | Stage for full-page states: fading dot grid, brand glow, pointer parallax, title, text, actions that rise in. 404 and error use it; reuse it for offline/empty/maintenance pages. |
| `Parallax`                  | `components/motion/parallax.tsx`         | Children with the `parallax` utility drift with the pointer by `--depth` px (negative = the other way). Mouse/pen only, never with reduced motion.                                |
| `float`, `twinkle`, `orbit` | `globals.css`                            | Ambient loops: bob, fade in and out, turn around `transform-origin`. Offset siblings with `--i`. They end where they start, so reduced motion leaves them at rest.                |
| `InlineScript`              | `components/ui/inline-script.tsx`        | For pre-paint scripts in layouts; inert on client navigations (no React warning).                                                                                                 |
| `SuspenseReveal`            | `components/motion/suspense-reveal.tsx`  | Skeleton fades out, content fades in and rises in place. See [docs/loading.md](loading.md).                                                                                       |
| `ConnectionBanner`          | `features/connection`                    | Pill at the top when the network drops, turns green "Back online" when it returns, hides after 3 s. `features.offlineBanner`.                                                     |

## Components: how each one moves

All shadcn primitives in `components/ui` are tuned to the tokens. Open them on `/dev` → Components. When you add a new one with `npx shadcn@latest add <name>`, change its `duration-*` / `ease-*` classes to match this table.

| Component                 | Enter                                                                                     | Exit            |
| ------------------------- | ----------------------------------------------------------------------------------------- | --------------- |
| Dialog (modal)            | backdrop fade + panel fade/zoom 95→100, `--motion-base`, `ease-out-expo`                  | `--motion-fast` |
| Sheet (side panel)        | slides from its edge, `--motion-slow`, `ease-out-expo`                                    | `--motion-base` |
| Popover, Select, Dropdown | fade + zoom from the trigger side, `--motion-base`                                        | `--motion-fast` |
| Tooltip                   | fade + small zoom after a short delay                                                     | fast fade       |
| Switch                    | thumb slides with `ease-spring` (small overshoot)                                         | same            |
| Button                    | press by the elevation knob (`--press-scale`, `--ease-press`); `effect="shine" \| "beam"` | springs back    |
| Input, Textarea           | focus ring fades in                                                                       |                 |
| Tabs                      | active pill moves between triggers                                                        |                 |
| Toast (sonner)            | slides in from its edge, stacks, expands on hover, swipe to dismiss                       | slides out      |

Rules: exit faster than enter; open from the trigger (`origin-(--transform-origin)` in Base UI); with reduced motion these become plain fades or nothing.

**Toasts at any position.** Default: `features.toaster.position` (`top-center`, `top-left`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`). Per toast: `toast.success(t("saved"), { position: "bottom-right" })`. While saving: `toast.promise(save(), { loading, success, error })`. Text always through `t()`.

**Carousel.** Not installed by default: it adds `embla-carousel`, and most pages don't need one. When a page does: `npx shadcn@latest add carousel`; keep native swipe, show prev/next buttons for keyboard users, no autoplay (or pause on hover/focus and when reduced motion is on). Often a CSS scroll-snap row (`flex snap-x snap-mandatory overflow-x-auto`) is enough and costs nothing.

**Anything else** (drawer, accordion, combobox, calendar, command menu): add with the shadcn CLI, retune it to the table above, add it to `/dev`, check keyboard and reduced motion.

## Connection status

`ConnectionBanner` (in the root layout when `features.offlineBanner` is on) listens to the browser's `online` / `offline` events. Offline: a dark pill slides down with a pulsing icon. Back: it turns green, says "Back online" and leaves after 3 seconds. It is a polite live region, so screen readers announce both. The browser only knows whether the network link is up: "online" on a captive Wi-Fi or with no data balance can still fail, so every data call still needs its own error state (and a toast).

## 404 and error pages

Both are alive, not apologetic: something to look at, then a clear way out.

- **404** (`components/layout/not-found-view.tsx`, used by `app/[locale]/not-found.tsx` and `app/global-not-found.tsx`): "4 🪐 4" where the 0 is the `Planet`, digits and planet bob out of step, stars twinkle, everything drifts with the pointer. Actions: Home, Back (history, or home when opened directly), and the main `NAV_LINKS`.
- **Error** (`components/layout/error-view.tsx`, used by `app/[locale]/error.tsx` and `app/global-error.tsx`): the `Unplugged` scene. "Try again" slides the plug into the socket, then calls Next's `retry()` (fetches and renders the segment again). Offline: says so, disables the button, and retries by itself when the connection returns. Shows the error digest with a copy button (for support); the message only in development. "Go home" is a full page load.
- `global-error.tsx` replaces the whole document when the root layout fails, so it brings its own `<html>`, styles and theme, and reads the language from the URL.
- Try them on `/dev` → "404 and error pages".
- Per project: swap the illustrations for the brand's (Jotno: a puppy sniffing a trail for 404, a chewed cable for errors), keep `StatusScene`, the actions and the behaviour.

## Page and shared-element transitions

Navigations in the App Router are React transitions, so `<ViewTransition>` animates them with no library ([Next guide](../node_modules/next/dist/docs/01-app/02-guides/view-transitions.md)).

- **Shared element** (the signature move for list → detail): give the thumbnail and the detail hero the same name on both pages.

  ```tsx
  <ViewTransition name={`vet-${vet.id}`} share="morph" default="none">
    <Image … />
  </ViewTransition>
  ```

- **Direction:** `<Link transitionTypes={["nav-forward"]}>` and map `nav-forward` / `nav-back` in the page's `<ViewTransition enter={…} exit={…}>` (CSS recipe in the guide).
- **Skeleton → content:** wrap the Suspense fallback in `<ViewTransition exit="…">` and the content in `<ViewTransition enter="…">`.
- Put `<ViewTransition>` in pages, not layouts. Use `default="none"` on named ones so they don't run on unrelated transitions.

## Motion (`motion/react`)

- Only inside small `"use client"` leaves. Import from `motion/react`.
- `AnimatePresence` for things that leave (toasts, list items, step-by-step forms).
- `layout` / `layoutId` for reordering and tabs underlines.
- Drag and swipe: bottom sheets, image carousels, "swipe to dismiss".
- `useReducedMotion()`: skip or shorten the animation when true.
- Springs over long durations for physical things: `transition={{ type: "spring", bounce: 0.2, visualDuration: 0.3 }}`.

## GSAP (marketing pages only)

```bash
pnpm add gsap @gsap/react
```

- All plugins (ScrollTrigger, SplitText, MorphSVG, DrawSVG…) are free; check the current licence once per project.
- Client component, `useGSAP(() => { … }, { scope: ref })` so everything is cleaned up on unmount.
- Wrap scroll stories in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)` and give the reduced version a static layout.
- Load the page section with `next/dynamic` if it is below the fold.

**Smooth scrolling (Lenis):** only on a scroll-story landing page, never in the app (it fights sticky elements, anchors and assistive tech). `pnpm add lenis`, start it in one client component, stop it under reduced motion.

## Canvas and 3D (lazy, with a poster)

| Need                                                     | Tool                                                                           |
| -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Interactive character/mascot that reacts (hover, states) | [Rive](https://rive.app) `@rive-app/react-canvas`: small files, state machines |
| Simple looping animation from a designer (After Effects) | dotLottie `@lottiefiles/dotlottie-react` (`.lottie`, not JSON)                 |
| Real 3D (product, globe, map)                            | `three` + `@react-three/fiber` + `@react-three/drei`                           |

Rules for all three: `next/dynamic(() => import(…), { ssr: false })`; show a static poster image first (same size, so no layout shift); mount only when in view; pause when off screen or the tab is hidden; reduced motion → poster only; cap pixel ratio (`dpr={[1, 1.5]}`) and use `frameloop="demand"` when the scene is idle. Budget: the page must still load fast on 4G.

## Icons

- **One set:** Lucide (`lucide-react`, shadcn default). Don't mix sets on a page.
- Sizes with `size-4` (inline, buttons), `size-5` (list/cards), `size-6` (empty states). Colour via text tokens (`text-primary`, `text-muted-foreground`).
- Stroke width for the whole app: `--icon-stroke` in `globals.css` (1.5 lighter, 2 default). Match the illustration stroke.
- Decorative icons get `aria-hidden="true"`; icon-only buttons get an `aria-label` from `t()`.
- Animated icons: `npx shadcn add @lucide-animated/<name>` (same shapes, animated on hover). Use for a few key actions, not everywhere.
- Brand/product logos: SVG files in `public/` or `src/components/brand/`, never icon-font.

## Illustrations

House style (change per project in the brand guide, keep it consistent):

- Hairline strokes (1.5px), no fills or one flat tint, `currentColor` for lines + one accent in `text-primary`, so it follows the brand colour and dark mode with no extra files.
- Make each shape `pathLength={1}` and add `--i` so `draw` can animate it.
- Every illustration is decorative (`aria-hidden`); the text next to it carries the meaning.
- Sources: draw in Figma → export SVG → SVGO → a component in `src/components/illustrations/`. Libraries such as [Liniqo](https://liniqo.com) (hairline, accent follows your colour, has an MCP server for agents) are fine when the licence allows; check it per project.
- Where to use: empty states, onboarding, 404/error, success screens, feature sections. Not in dense app screens.
- Photos: real ones of your users/service beat stock. Always `next/image` with width/height.

## Components from registries

The shadcn CLI knows these namespaces (checked 2026-11-21 in the official index): `@magicui`, `@animate-ui`, `@motion-primitives`, `@react-bits`, `@kokonutui`, `@cult-ui`, `@eldoraui`, `@smoothui`, `@skiper-ui`, `@lucide-animated`, `@aceternity`.

```bash
npx shadcn@latest add @magicui/border-beam
npx shadcn@latest add @animate-ui/<name>
```

[21st.dev](https://21st.dev) and [Motion Brew](https://motion-brew.com) give a copy command or prompt per component; [Uiverse](https://uiverse.io) gives HTML/CSS/Tailwind for single elements.

After adding anything:

1. Replace raw colours with tokens (`bg-primary`, `text-muted-foreground`…), durations/easings with ours.
2. Text through `t()`; no hard-coded strings.
3. Add a reduced-motion path and keyboard/screen-reader support if missing.
4. Check what it imports (a "button" that pulls in three.js is a no).
5. Add it to `/dev`, run `pnpm check`.
6. Respect the licence (React Bits: Commons Clause; Aceternity: some paid).

## Checklist for any animated piece

- [ ] Has a job (feedback, orientation, focus, one delight moment)
- [ ] `transform`/`opacity` only; no layout shift (CLS 0)
- [ ] Uses the tokens; 150–400 ms
- [ ] Reduced motion: complete, static version
- [ ] Not on the LCP element at load
- [ ] Heavy code lazy-loaded with a poster
- [ ] Smooth on a mid-range Android phone
- [ ] Previewed on `/dev`
