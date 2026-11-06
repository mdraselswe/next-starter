"use client";

import { Button } from "@/components/ui/button";
import { t } from "@/i18n";

/** Shown when a page throws while rendering. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div
      role="alert"
      className="container-page grid min-h-[60svh] place-content-center justify-items-center gap-4 py-24 text-center"
    >
      <h1 className="text-2xl font-semibold">{t("error.title")}</h1>
      <p className="text-muted-foreground">{t("error.body")}</p>
      <Button size="lg" onClick={reset}>
        {t("error.retry")}
      </Button>
    </div>
  );
}
