"use client";

import { CircleCheck, Info, LoaderCircle, OctagonX, TriangleAlert } from "lucide-react";
import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { features } from "@/config";
import { useTheme } from "@/hooks/use-theme";
import { useLocale, useT } from "@/i18n/client";
import { localeDir } from "@/config/locale";

/**
 * Toast notifications. Mounted once in the root layout (features.toaster).
 * Show one from any client component:
 *
 *   import { toast } from "sonner";
 *   toast.success(t("saved"));
 *   toast("…", { position: "bottom-left" }); // any position, per toast
 *
 * Default position: features.toaster.position. Swipe to dismiss on touch;
 * stacked toasts expand on hover. Colours come from the theme tokens.
 */
export function Toaster(props: ToasterProps) {
  const { mode } = useTheme();
  const locale = useLocale();
  const t = useT();
  return (
    <Sonner
      theme={mode}
      position={features.toaster.position}
      dir={localeDir(locale)}
      containerAriaLabel={t("toast.region")}
      className="toaster group"
      icons={{
        success: <CircleCheck className="size-4 text-success" aria-hidden="true" />,
        info: <Info className="size-4 text-info" aria-hidden="true" />,
        warning: <TriangleAlert className="size-4 text-warning" aria-hidden="true" />,
        error: <OctagonX className="size-4 text-destructive" aria-hidden="true" />,
        loading: <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as CSSProperties
      }
      toastOptions={{ classNames: { toast: "cn-toast font-sans" }, closeButtonAriaLabel: t("toast.close") }}
      {...props}
    />
  );
}
