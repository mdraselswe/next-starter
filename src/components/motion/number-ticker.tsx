"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useEffectEvent, useRef } from "react";
import { useFormatter } from "@/i18n/client";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  /** "money" formats in site.i18n.currency (value in the main unit, e.g. taka). */
  format?: "number" | "money";
  className?: string;
};

/**
 * Counts up to `value` the first time it scrolls into view, in the page's
 * language (Bangla digits on bn pages). The server HTML already has the final
 * number, so search engines, screen readers and reduced-motion users get it as is.
 */
export function NumberTicker({ value, format = "number", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const f = useFormatter();
  const show = (n: number) => (format === "money" ? f.money(n) : f.number(n));

  const write = useEffectEvent((n: number) => {
    if (ref.current) ref.current.textContent = show(Math.round(n));
  });

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, value, { duration: 1.2, ease: [0.16, 1, 0.3, 1], onUpdate: (n) => write(n) });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span className={cn("tabular-nums", className)}>
      <span ref={ref} aria-hidden="true">
        {show(value)}
      </span>
      <span className="sr-only">{show(value)}</span>
    </span>
  );
}
