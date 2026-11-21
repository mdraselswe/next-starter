"use client";

import type { ComponentProps, PointerEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * A surface with a soft brand-coloured glow that follows the pointer, so cards
 * feel touchable. No animation library: the pointer position goes into two CSS
 * variables and a radial gradient reads them. Touch devices and keyboard users
 * see the plain card; the glow is decoration only.
 */
export function Spotlight({ className, children, onPointerMove, ...props }: ComponentProps<"div">) {
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
    onPointerMove?.(event);
  };
  return (
    <div
      onPointerMove={move}
      className={cn(
        "group/spot relative isolate overflow-hidden",
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:opacity-0 before:transition-opacity before:duration-(--motion-base)",
        "before:bg-[radial-gradient(320px_circle_at_var(--spot-x,50%)_var(--spot-y,50%),color-mix(in_oklch,var(--primary)_14%,transparent),transparent_70%)]",
        "[@media(hover:hover)]:hover:before:opacity-100",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
