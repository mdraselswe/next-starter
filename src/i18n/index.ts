import { site } from "@/config";
import { en, type MessageKey, type Messages } from "./messages/en";

/** Register locales here. Each must satisfy `Messages`, so a missing key is a type error. */
const CATALOGUE: Record<string, Messages> = { en };

export type TranslateVars = Record<string, string | number>;

/** Fills `{name}` placeholders. Exported for tests. */
export function format(template: string, vars?: TranslateVars): string {
  return vars
    ? template.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? `{${name}}`))
    : template;
}

export const locale = site.locale in CATALOGUE ? site.locale : "en";
const messages = CATALOGUE[locale] ?? en;

/** Typed translator: t("nav.home"), t("footer.rights", { year, name }). */
export function t(key: MessageKey, vars?: TranslateVars): string {
  return format(messages[key], vars);
}

export type { MessageKey };
