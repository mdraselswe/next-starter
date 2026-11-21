import type { ComponentProps, ReactNode } from "react";
import { Parallax } from "@/components/motion/parallax";
import { cn } from "@/lib/utils";

/**
 * The stage for full-page states (404, error, offline, empty): a dotted grid
 * that fades out from the centre, a brand glow, an animated scene that follows
 * the pointer, then the title, text and actions.
 *
 *   <StatusScene art={<Planet />} title={t("…")} body={t("…")} actions={<ButtonLink …/>} />
 *
 * The text appears at once (it is the page's main content); only the actions
 * rise in, a moment later. Pass `className="flex-1"` when it fills a <main>.
 */
export function StatusScene({
  art,
  title,
  body,
  actions,
  children,
  className,
  ...props
}: Omit<ComponentProps<"div">, "title"> & {
  art: ReactNode;
  title: ReactNode;
  body: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <Parallax
      className={cn(
        "relative isolate grid min-h-[70svh] place-content-center justify-items-center gap-5 overflow-hidden px-4 py-20 text-center",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_65%)] bg-size-[22px_22px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[12%] -z-10 mx-auto size-[min(28rem,90vw)] parallax rounded-full bg-primary/12 blur-3xl [--depth:-24]"
      />
      <div className="mb-2">{art}</div>
      <h1 className="max-w-xl text-2xl font-semibold text-balance sm:text-3xl">{title}</h1>
      <div className="max-w-md text-pretty text-muted-foreground">{body}</div>
      {actions ? (
        <div className="mt-2 flex animate-in flex-wrap justify-center gap-3 delay-300 duration-(--motion-slow) ease-out-expo fill-mode-both fade-in slide-in-from-bottom-2">
          {actions}
        </div>
      ) : null}
      {children}
    </Parallax>
  );
}
