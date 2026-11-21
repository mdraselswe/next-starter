import type { Metadata } from "next";
import { LOCALES, localePath } from "@/config/locale";
import { pageUrl } from "@/config/routes";
import { stripAccent } from "./rich-text";

/**
 * Per-page metadata with a canonical URL and hreflang links to the same page
 * in every language. Titles may contain [accent] markup. `route` is from ROUTES.
 */
export function pageMetadata(title: string, description: string, route: string, locale: string): Metadata {
  const plain = stripAccent(title);
  const url = pageUrl(localePath(locale, route));
  return {
    title: plain,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(LOCALES.map((l) => [l, pageUrl(localePath(l, route))])),
    },
    openGraph: { title: plain, description, url, locale },
  };
}
