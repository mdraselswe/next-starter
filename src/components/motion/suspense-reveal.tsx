import { type ReactNode, Suspense, ViewTransition } from "react";

/**
 * <Suspense> that hands over smoothly: the skeleton fades out, the real
 * content fades in and rises into the same place (React <ViewTransition>,
 * CSS .exit-fade / .enter-rise in globals.css). Use it around every part of a
 * page that waits for data, with a skeleton of the same shape:
 *
 *   <SuspenseReveal fallback={<VetListSkeleton />}>
 *     <VetList area={area} />
 *   </SuspenseReveal>
 *
 * Browsers without View Transitions just swap; reduced motion swaps instantly.
 */
export function SuspenseReveal({ fallback, children }: { fallback: ReactNode; children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <ViewTransition exit="exit-fade" default="none">
          {fallback}
        </ViewTransition>
      }
    >
      <ViewTransition enter="enter-rise" default="none">
        {children}
      </ViewTransition>
    </Suspense>
  );
}
