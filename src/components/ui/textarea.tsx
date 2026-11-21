import * as React from "react";
import { cn } from "cn";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-(--control-radius) border-(length:--border-w) border-(--field-line) bg-(--field-bg) px-(--control-px) py-2 text-base shadow-(--shadow-field) transition-[color,background-color,border-color,box-shadow] duration-(--motion-fast) outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:shadow-(--shadow-field-focus) focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
