"use client";

import { ErrorView } from "@/components/layout/error-view";
import { ROUTES } from "@/config/routes";
import { useLocale, useT } from "@/i18n/client";
import { localeHref } from "@/lib/locale-href";

/** Shown when a page throws while rendering. The header and footer stay. */
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  return <ErrorView error={error} retry={retry} t={useT()} homeHref={localeHref(useLocale(), ROUTES.home)} />;
}
