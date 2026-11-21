import { House } from "lucide-react";
import type { CSSProperties } from "react";
import { Planet } from "@/components/illustrations/planet";
import { BackButton } from "@/components/layout/back-button";
import { StatusScene } from "@/components/layout/status-scene";
import { ButtonLink } from "@/components/ui/button-link";
import { NAV_LINKS } from "@/config/navigation";
import { ROUTES } from "@/config/routes";
import type { Translate } from "@/i18n";
import { localeHref } from "@/lib/locale-href";
import { cn } from "@/lib/utils";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Twinkling stars around the 404, a little behind it (they drift the other way). */
function Stars({ className }: { className?: string }) {
  const star = "twinkle";
  return (
    <svg
      viewBox="0 0 400 220"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden="true"
      className={cn("pointer-events-none text-muted-foreground", className)}
    >
      <path d="M40 40 v10 M35 45 h10" className={cn(star, "text-primary")} style={i(0)} />
      <path d="M360 60 v8 M356 64 h8" className={star} style={i(2)} />
      <path d="M330 190 v10 M325 195 h10" className={cn(star, "text-primary")} style={i(4)} />
      <path d="M70 180 v6 M67 183 h6" className={star} style={i(1)} />
      <circle cx="110" cy="20" r="1.5" className={star} style={i(3)} />
      <circle cx="290" cy="24" r="2" className={star} style={i(5)} />
      <circle cx="20" cy="120" r="1.5" className={star} style={i(6)} />
      <circle cx="385" cy="135" r="1.5" className={star} style={i(2)} />
      <circle cx="200" cy="210" r="1.5" className={star} style={i(4)} />
    </svg>
  );
}

/**
 * The 404 page body, shared by app/[locale]/not-found.tsx and
 * app/global-not-found.tsx: "4 🪐 4" floating with the pointer, stars, and a
 * way out (home, back, the main links).
 */
export function NotFoundView({ t, locale, className }: { t: Translate; locale: string; className?: string }) {
  const home = localeHref(locale, ROUTES.home);
  const links = NAV_LINKS.filter((link) => link.href !== ROUTES.home);
  return (
    <StatusScene
      className={className}
      art={
        <div className="relative px-6">
          <Stars className="absolute -top-10 -left-16 -z-10 h-[calc(100%+5rem)] w-[calc(100%+8rem)] parallax [--depth:-10]" />
          <p
            aria-hidden="true"
            className="flex items-center font-heading text-[clamp(5.5rem,26vw,10rem)] leading-none font-semibold tracking-tight text-primary select-none"
          >
            <span className="parallax [--depth:10]">
              <span className="inline-block float" style={i(0)}>
                4
              </span>
            </span>
            <span className="-mx-[0.04em] parallax [--depth:20]">
              <Planet className="size-[1.05em] float text-primary" style={i(1)} />
            </span>
            <span className="parallax [--depth:10]">
              <span className="inline-block float" style={i(2)}>
                4
              </span>
            </span>
          </p>
        </div>
      }
      title={t("notFound.title")}
      body={
        <>
          <p>{t("notFound.body")}</p>
          {links.length > 0 ? (
            <nav aria-label={t("notFound.links")} className="mt-4 flex flex-wrap justify-center gap-1">
              {links.map((link) => (
                <ButtonLink key={link.href} href={localeHref(locale, link.href)} variant="link" size="sm">
                  {t(link.label)}
                </ButtonLink>
              ))}
            </nav>
          ) : null}
        </>
      }
      actions={
        <>
          <ButtonLink href={home} size="lg">
            <House aria-hidden="true" />
            {t("notFound.cta")}
          </ButtonLink>
          <BackButton label={t("notFound.back")} fallbackHref={home} variant="outline" size="lg" />
        </>
      }
    />
  );
}
