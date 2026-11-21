import type { ComponentProps, CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * A plug pulled out of its socket with a spark between them: the error page.
 * The two halves bob out of step (`float`) and the spark flickers (`twinkle`).
 * Set `data-connecting` on the svg (or pass `connecting`) and the halves slide
 * together and the spark goes out: the "trying again" moment.
 * House style: hairline currentColor, `text-primary` accent (see empty-box.tsx).
 */
export function Unplugged({
  connecting = false,
  className,
  ...props
}: ComponentProps<"svg"> & { connecting?: boolean }) {
  const i = (n: number) => ({ "--i": n }) as CSSProperties;
  const half = "transition-[translate] duration-(--motion-slow) ease-spring";
  return (
    <svg
      viewBox="0 0 240 120"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-connecting={connecting || undefined}
      className={cn("group/plug draw overflow-visible text-muted-foreground", className)}
      {...props}
    >
      {/* plug and its cable */}
      <g className={cn(half, "group-data-connecting/plug:translate-x-[9px]")}>
        <g className="float" style={i(0)}>
          <path d="M-10 74 C24 74 34 52 62 58 S84 62 92 60" pathLength={1} style={i(0)} />
          <rect x="92" y="48" width="22" height="24" rx="5" pathLength={1} style={i(1)} />
          <path d="M114 54 H122 M114 66 H122" pathLength={1} style={i(2)} />
        </g>
      </g>
      {/* socket and its cable */}
      <g className={cn(half, "group-data-connecting/plug:-translate-x-[9px]")}>
        <g className="float" style={i(2)}>
          <rect x="140" y="46" width="24" height="28" rx="6" pathLength={1} style={i(1)} />
          <path d="M146 54 H150 M146 66 H150" pathLength={1} style={i(2)} />
          <path d="M164 60 C186 60 196 82 218 76 S240 66 250 66" pathLength={1} style={i(0)} />
        </g>
      </g>
      {/* spark (no pathLength: it flickers instead of drawing) */}
      <g className="text-primary transition-opacity duration-(--motion-fast) group-data-connecting/plug:opacity-0">
        <path
          d="M131 44 L127 56 L134 58 L129 72"
          className="twinkle [--twinkle-duration:1.1s]"
          style={i(3)}
        />
        <circle cx="124" cy="42" r="1.5" className="twinkle" style={i(1)} />
        <circle cx="138" cy="76" r="1.5" className="twinkle" style={i(2)} />
      </g>
    </svg>
  );
}
