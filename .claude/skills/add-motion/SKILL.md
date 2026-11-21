---
name: add-motion
description: Add an animation, transition, animated component, icon or illustration the starter's way (docs/motion.md): lightest layer first, tokens, reduced motion, no slow pages.
---

# Add motion, an animated component, an icon or an illustration

Read `docs/motion.md` first. Then:

1. **Name the job** of the animation (feedback, orientation, focus, or the page's one delight moment). No job → don't add it.
2. **Pick the lightest layer** (stop at the first that works):
   - CSS: Tailwind `transition-*` with `duration-(--motion-fast|base|slow)` and `ease-out-quart|ease-out-expo|ease-spring`; `reveal` for scroll-in; `draw` for SVG lines; `tw-animate-css` (`animate-in fade-in`) for mount.
   - Page change or list → detail morph: `<ViewTransition>` (`PageTransition`, shared `name`).
   - Gestures, springs, exit animations, layout/reorder: `motion/react` in a small `"use client"` component.
   - Long scroll story / timeline on a marketing page: `pnpm add gsap @gsap/react`, `useGSAP` with `scope`, `gsap.matchMedia()` for reduced motion.
   - Mascot / 3D: Rive, dotLottie or React Three Fiber via `next/dynamic(…, { ssr: false })` with a same-size poster.
3. **From a registry** (`npx shadcn@latest add @magicui/<name>`, `@animate-ui`, `@motion-primitives`, `@lucide-animated`…): swap raw colours for tokens, our durations/easings, text via `t()`, add a reduced-motion path, check its imports.
4. **Rules:** animate `transform`/`opacity` only; never the LCP element at load; never hide content that only appears after animation (reduced motion must show everything); no layout shift.
5. **Icons:** Lucide only, `size-4/5/6`, colour via text tokens, `aria-hidden` when decorative, `aria-label` from `t()` on icon-only buttons.
6. **Illustrations:** hairline SVG component in `src/components/illustrations/`, `currentColor` + one `text-primary` accent, `pathLength={1}` and `--i` on shapes for `draw`, `aria-hidden`.
7. Preview it on `/dev` (Motion section), with reduced motion on (DevTools → Rendering → prefers-reduced-motion) and on a phone-sized viewport.
8. Run `pnpm check`, then `pnpm build && pnpm test:e2e`.
