import type { Metadata } from "next";
import { pageUrl } from "@/config/routes";
import { stripAccent } from "./rich-text";

/** Per-page metadata with canonical URL. Titles may contain [accent] markup. */
export function pageMetadata(title: string, description: string, route: string): Metadata {
  const plain = stripAccent(title);
  return {
    title: plain,
    description,
    alternates: { canonical: pageUrl(route) },
    openGraph: { title: plain, description, url: pageUrl(route) },
  };
}
