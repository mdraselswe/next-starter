import { type ReactNode, ViewTransition } from "react";
import { PageTransition } from "@/components/motion/page-transition";
import { RichText } from "@/components/ui/rich-text";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const CONTAINER = "container-page py-16 md:py-24";
const HEADER = "mb-10 grid max-w-2xl gap-3";
const TITLE = "font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl";
const SUB = "text-lg text-pretty text-muted-foreground";

/** Standard page heading + content, with the page transition. PageShellSkeleton is its loading twin. */
export function PageShell({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <PageTransition>
      <div className={CONTAINER}>
        <header className={HEADER}>
          <h1 className={TITLE}>
            <RichText text={title} />
          </h1>
          {sub ? <p className={SUB}>{sub}</p> : null}
        </header>
        {children}
      </div>
    </PageTransition>
  );
}

/**
 * PageShell's skeleton: same container, same heading sizes (one line each,
 * `h-[1lh]` in the heading's own text size), so the page lands without a jump.
 * Pass a skeleton of the page body as children. It fades out as the page
 * fades in (exit-fade / enter-rise).
 */
export function PageShellSkeleton({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <ViewTransition exit="exit-fade" default="none">
      <div role="status" aria-label={label} className={CONTAINER}>
        <div className={HEADER}>
          <Skeleton className={cn(TITLE, "h-[1lh] w-3/4")} />
          <Skeleton className={cn(SUB, "h-[1lh] w-1/2")} />
        </div>
        {children}
      </div>
    </ViewTransition>
  );
}
