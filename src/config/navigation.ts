import type { MessageKey } from "@/i18n";
import { ROUTES, type AppRoute } from "./routes";

export interface NavLink {
  /** A page from ROUTES (no locale prefix); components add the locale with `localeHref`. */
  href: AppRoute;
  label: MessageKey;
}

/** ✏️ Header and footer links. Labels are i18n keys. */
export const NAV_LINKS: readonly NavLink[] = [
  { href: ROUTES.home, label: "nav.home" },
  { href: ROUTES.about, label: "nav.about" },
];
