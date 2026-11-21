import { cn } from "cn";

/**
 * A placeholder block with the size and place of the content it stands for.
 * Waits --skeleton-delay (150ms) before showing, so fast loads never flash,
 * then shimmers. For a line of text give it the same text class and
 * `h-[1lh]`, so it is exactly one line tall in every language:
 *
 *   <Skeleton className="h-[1lh] w-3/4 text-4xl" />
 *
 * Put the skeleton next to its component (`VetCard` + `VetCardSkeleton`) so
 * their shapes change together. See docs/loading.md.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("skeleton rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
