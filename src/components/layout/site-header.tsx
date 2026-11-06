"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { features, site } from "@/config";
import { NAV_LINKS } from "@/config/navigation";
import { ROUTES } from "@/config/routes";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const isActive = (pathname: string, href: string) => pathname === href || pathname === `${href}/`;

export function SiteHeader() {
  const pathname = usePathname();

  const links = (className: string) =>
    NAV_LINKS.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        aria-current={isActive(pathname, link.href) ? "page" : undefined}
        className={cn(
          className,
          isActive(pathname, link.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {t(link.label)}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-page flex h-14 items-center gap-4">
        <Link href={ROUTES.home} className="font-heading text-lg font-semibold tracking-tight">
          {site.name}
        </Link>
        <nav aria-label="Main" className="ml-6 hidden items-center gap-6 text-sm font-medium md:flex">
          {links("transition-colors")}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          {features.themeToggle ? <ThemeToggle /> : null}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden" aria-label={t("nav.menu")}>
                  <Menu aria-hidden="true" />
                </Button>
              }
            />
            <SheetContent side="right" className="w-72">
              <SheetTitle className="px-4 pt-4">{site.name}</SheetTitle>
              <nav aria-label="Mobile" className="grid gap-1 p-4">
                {links("rounded-md px-3 py-2 text-base font-medium")}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
