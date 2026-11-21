"use client";

import { createContext, use, type ReactNode } from "react";
import { DEFAULT_LOCALE } from "@/config/locale";
import { formatter, translator } from "./index";

const LocaleContext = createContext(DEFAULT_LOCALE);

/** Set once in the root layout; client components read it with the hooks below. */
export function LocaleProvider({ locale, children }: { locale: string; children: ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useLocale(): string {
  return use(LocaleContext);
}

export function useT() {
  return translator(useLocale());
}

export function useFormatter() {
  return formatter(useLocale());
}
