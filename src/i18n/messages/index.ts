import { bn } from "./bn";
import { en, type Messages } from "./en";

/**
 * ✏️ Every language the starter has text for. To add one: copy en.ts to
 * <locale>.ts (typed as `Messages`, so a missing key is a type error),
 * translate it and add it here. Which of these are built is set in
 * src/config/site.ts (`i18n.locales`, or `pnpm locales`).
 */
export const CATALOGUE: Record<string, Messages> = { bn, en };

export type { MessageKey, Messages } from "./en";
