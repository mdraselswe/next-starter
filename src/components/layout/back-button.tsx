"use client";

import { ArrowLeft } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

/** Goes back in history, or to `fallbackHref` when this page was opened directly. */
export function BackButton({
  label,
  fallbackHref,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick" | "children"> & { label: string; fallbackHref: string }) {
  const back = () => {
    if (history.length > 1) history.back();
    else location.assign(fallbackHref);
  };
  return (
    <Button onClick={back} {...props}>
      <ArrowLeft aria-hidden="true" className="rtl:rotate-180" />
      {label}
    </Button>
  );
}
