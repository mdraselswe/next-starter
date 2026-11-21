"use client";

import { Languages } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LOCALES, localeName, localePath, splitLocale } from "@/config/locale";
import { useLocale, useT } from "@/i18n/client";
import { cn } from "@/lib/utils";

/**
 * Links to the current page in the other languages. Hidden with one language,
 * a single link with two, a menu with more.
 */
export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useT();
  const { path } = splitLocale(usePathname());
  const others = LOCALES.filter((l) => l !== locale);
  // The same page under app/[locale] in another language, so the cast is safe.
  const hrefFor = (l: string) => localePath(l, path) as Route;

  const [only] = others;
  if (!only) return null;

  if (others.length === 1) {
    return (
      <Link
        href={hrefFor(only)}
        hrefLang={only}
        lang={only}
        aria-label={`${t("locale.switch")}: ${localeName(only)}`}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}
      >
        <Languages aria-hidden="true" />
        {localeName(only)}
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label={t("locale.switch")}>
            <Languages aria-hidden="true" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-40">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l}
            render={<Link href={hrefFor(l)} hrefLang={l} lang={l} />}
            aria-current={l === locale ? "true" : undefined}
          >
            {localeName(l)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
