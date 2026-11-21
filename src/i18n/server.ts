/**
 * Locale-aware helpers for Server Components. The locale is the `[locale]`
 * root parameter, so nothing needs to be passed down as props.
 * Not usable in Server Actions or Route Handlers (pass the locale in instead).
 */
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { DEFAULT_LOCALE, isLocale } from "@/config/locale";
import { formatter, translator } from "./index";

export async function getLocale(): Promise<string> {
  const value = await rootLocale();
  return value && isLocale(value) ? value : DEFAULT_LOCALE;
}

/** For the root layout: a 404 when the first URL segment is not a configured language. */
export async function requireLocale(): Promise<string> {
  const value = await rootLocale();
  if (!value || !isLocale(value)) notFound();
  return value;
}

export async function getT() {
  return translator(await getLocale());
}

export async function getFormatter() {
  return formatter(await getLocale());
}
