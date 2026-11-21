import Link from "next/link";
import { features, site } from "@/config";
import { NAV_LINKS } from "@/config/navigation";
import { InstallLink } from "@/features/pwa";
import { getLocale, getT } from "@/i18n/server";
import { localeHref } from "@/lib/locale-href";

const NETWORK_NAMES: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  x: "X",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  github: "GitHub",
  whatsapp: "WhatsApp",
};

/** Year of the build (module scope, so it is fixed at build time in both render modes). */
const YEAR = new Date().getFullYear();

export async function SiteFooter() {
  const t = await getT();
  const locale = await getLocale();
  return (
    <footer className="mt-auto border-t">
      <div className="container-page flex flex-col gap-6 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p className="m-0">{t("footer.rights", { year: YEAR, name: site.name })}</p>
        <nav aria-label={t("nav.footer")} className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={localeHref(locale, link.href)} className="hover:text-foreground">
              {t(link.label)}
            </Link>
          ))}
          {site.socials.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
              aria-label={t("footer.social", { name: site.name, network: NETWORK_NAMES[s.kind] ?? s.kind })}
            >
              {NETWORK_NAMES[s.kind] ?? s.kind}
            </a>
          ))}
          {features.pwa ? <InstallLink className="hover:text-foreground" /> : null}
        </nav>
      </div>
    </footer>
  );
}
