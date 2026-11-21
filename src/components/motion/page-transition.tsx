import { type ReactNode, ViewTransition } from "react";

/**
 * Fades and lifts page content on navigation, using the browser's View
 * Transitions through React's <ViewTransition> (no animation library).
 * Wrap each page's content (PageShell already does); not the layout, because
 * layouts stay mounted and never enter or exit. The CSS is in globals.css
 * (.enter-rise / .exit-fade). Browsers without support just swap the page.
 *
 * For shared-element morphs (a vet's photo in a list growing into the profile
 * header), give both elements <ViewTransition name="vet-42">. See docs/motion.md.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="enter-rise" exit="exit-fade" default="none">
      {children}
    </ViewTransition>
  );
}
