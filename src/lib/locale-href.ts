import type { Route } from "next";
import { localePath } from "@/config/locale";

/**
 * A typed link to a page of this site in a locale: localeHref("en", ROUTES.about) → "/en/about".
 * `route` comes from ROUTES (checked by typedRoutes); the prefixed result is a
 * real page under app/[locale], so the cast is safe.
 */
export function localeHref(locale: string, route: string): Route {
  return localePath(locale, route) as Route;
}
