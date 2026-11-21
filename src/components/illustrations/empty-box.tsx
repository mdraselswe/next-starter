import type { ComponentProps, CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Example hairline illustration (empty states, 404, onboarding).
 *
 * The house style for illustrations: 1.5px strokes, no fills, `currentColor`
 * for the drawing (set it with text-muted-foreground) and `text-primary` for
 * one accent, so it follows the brand colour and light/dark by itself.
 * `pathLength="1"` + `--i` let the `draw` utility draw it stroke by stroke.
 * Decorative: aria-hidden; the text next to it carries the meaning.
 */
export function EmptyBox({ className, ...props }: ComponentProps<"svg">) {
  const i = (n: number) => ({ "--i": n }) as CSSProperties;
  return (
    <svg
      viewBox="0 -24 160 150"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("draw text-muted-foreground", className)}
      {...props}
    >
      {/* shadow (dashed, so not drawn) */}
      <ellipse cx="80" cy="112" rx="56" ry="9" strokeDasharray="2 4" opacity={0.5} />
      {/* box: left face, right face, rim */}
      <path d="M30 45 L80 70 L80 105 L30 80 Z" pathLength={1} style={i(1)} />
      <path d="M80 70 L130 45 L130 80 L80 105" pathLength={1} style={i(2)} />
      <path d="M30 45 L80 20 L130 45" pathLength={1} style={i(3)} />
      {/* open flaps */}
      <path d="M30 45 L14 28 L64 4 L80 20" pathLength={1} style={i(4)} />
      <path d="M130 45 L146 30 L96 6 L80 20" pathLength={1} style={i(5)} />
      {/* accent: a spark rising out of the box */}
      <g className="text-primary" stroke="currentColor">
        <path d="M80 -14 L80 -2 M74 -8 L86 -8" pathLength={1} style={i(6)} />
        <circle cx="100" cy="-16" r="2.5" pathLength={1} style={i(7)} />
        <circle cx="60" cy="0" r="1.5" pathLength={1} style={i(8)} />
      </g>
    </svg>
  );
}
