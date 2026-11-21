import type { ComponentProps, CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * A ringed planet with a moon on a slow orbit. The 404 page uses it as the "0".
 * House style (see empty-box.tsx): hairline strokes in currentColor; the planet
 * body is filled with the page background so the back of the ring hides
 * behind it. Draws itself in (`draw`), then the moon keeps circling (`orbit`).
 */
export function Planet({ className, ...props }: ComponentProps<"svg">) {
  const i = (n: number) => ({ "--i": n }) as CSSProperties;
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("draw overflow-visible", className)}
      {...props}
    >
      {/* moon orbit (dashed, so not drawn) and the moon */}
      <circle cx="60" cy="60" r="55" strokeWidth={1} strokeDasharray="1 6" opacity={0.4} />
      <g className="orbit" style={{ transformOrigin: "60px 60px" }}>
        <circle cx="60" cy="5" r="4" className="fill-background" strokeWidth={2} />
      </g>
      {/* back half of the ring, behind the planet */}
      <path d="M12 66 A48 14 0 0 1 108 54" transform="rotate(-14 60 60)" pathLength={1} style={i(3)} />
      {/* planet body + surface lines */}
      <circle cx="60" cy="60" r="28" className="fill-background" pathLength={1} style={i(0)} />
      <g strokeWidth={1.25} opacity={0.6}>
        <path d="M40 46 Q60 52 80 46" pathLength={1} style={i(1)} />
        <path d="M34 62 Q60 70 86 62" pathLength={1} style={i(2)} />
        <circle cx="70" cy="76" r="3" pathLength={1} style={i(2)} />
      </g>
      {/* front half of the ring, over the planet */}
      <path d="M12 66 A48 14 0 0 0 108 54" transform="rotate(-14 60 60)" pathLength={1} style={i(4)} />
    </svg>
  );
}
