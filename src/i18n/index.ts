/**
 * Translation and formatting that work anywhere once you know the locale.
 * - Server Components: `const t = await getT()` from "@/i18n/server"
 * - Client Components: `const t = useT()` from "@/i18n/client"
 * - Anywhere else (tests, metadata with a known locale): `translator(locale)`
 */
import { site } from "@/config";
import { DEFAULT_LOCALE, LOCALES } from "@/config/locale";
import { CATALOGUE, type MessageKey, type Messages } from "./messages";

export type TranslateVars = Record<string, string | number>;
export type Translate = (key: MessageKey, vars?: TranslateVars) => string;

const missing = LOCALES.filter((l) => !(l in CATALOGUE));
if (missing.length > 0) {
  throw new Error(
    `No messages for locale(s) ${missing.join(", ")}. Add src/i18n/messages/<locale>.ts and register it in messages/index.ts.`,
  );
}

/** Fills `{name}` placeholders. Exported for tests. */
export function format(template: string, vars?: TranslateVars): string {
  return vars
    ? template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`))
    : template;
}

export function messagesFor(locale: string): Messages {
  return CATALOGUE[locale] ?? CATALOGUE[DEFAULT_LOCALE] ?? (Object.values(CATALOGUE)[0] as Messages);
}

/** Typed translator for one locale: translator("bn")("nav.home"). */
export function translator(locale: string): Translate {
  const messages = messagesFor(locale);
  return (key, vars) => format(messages[key], vars);
}

/** Number, money and date formatting for a locale, in the site's time zone and currency. */
export function formatter(locale: string) {
  const { timeZone, currency } = site.i18n;
  return {
    number: (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, options).format(value),
    /** Amount in the main unit (taka, dollars). Store money as integer minor units and divide first. */
    money: (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, { style: "currency", currency, ...options }).format(value),
    date: (value: Date | number, options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }) =>
      new Intl.DateTimeFormat(locale, { timeZone, ...options }).format(value),
    dateTime: (value: Date | number) =>
      new Intl.DateTimeFormat(locale, { timeZone, dateStyle: "medium", timeStyle: "short" }).format(value),
    relative: (value: number, unit: Intl.RelativeTimeFormatUnit) =>
      new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(value, unit),
  };
}

export type Formatter = ReturnType<typeof formatter>;

/**
 * Picks the entry for a locale from localized content (`{ bn: …, en: … }`),
 * falling back to the default locale. Use for src/content files.
 */
export function pickLocale<T>(content: Partial<Record<string, T>>, locale: string): T {
  const value = content[locale] ?? content[DEFAULT_LOCALE] ?? Object.values(content)[0];
  if (value === undefined) throw new Error("Localized content is empty");
  return value;
}

export type { MessageKey, Messages };
