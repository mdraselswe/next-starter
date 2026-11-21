"use client";

import type { ComponentProps, PointerEvent } from "react";

/**
 * Children with the `parallax` utility drift a few pixels with the pointer,
 * each by its own `--depth`, so a scene gets depth:
 *
 *   <Parallax>
 *     <Stars className="parallax [--depth:-6]" />
 *     <Planet className="parallax [--depth:14]" />
 *   </Parallax>
 *
 * Writes --px / --py (-1…1 from the centre) on the wrapper; no re-render, no
 * library. Only for a mouse or pen, and never with reduced motion.
 */
export function Parallax({ onPointerMove, onPointerLeave, ...props }: ComponentProps<"div">) {
  const move = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (event.pointerType === "touch" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 2 - 1;
    const y = ((event.clientY - box.top) / box.height) * 2 - 1;
    event.currentTarget.style.setProperty("--px", x.toFixed(3));
    event.currentTarget.style.setProperty("--py", y.toFixed(3));
  };
  const leave = (event: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    event.currentTarget.style.setProperty("--px", "0");
    event.currentTarget.style.setProperty("--py", "0");
  };
  return <div onPointerMove={move} onPointerLeave={leave} {...props} />;
}
