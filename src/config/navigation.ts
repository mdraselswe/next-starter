import type { Route } from "next";
import type { MessageKey } from "@/i18n";
import { ROUTES } from "./routes";

export interface NavLink {
  href: Route;
  label: MessageKey;
}

/** ✏️ Header and footer links. Labels are i18n keys. */
export const NAV_LINKS: readonly NavLink[] = [
  { href: ROUTES.home, label: "nav.home" },
  { href: ROUTES.about, label: "nav.about" },
];
