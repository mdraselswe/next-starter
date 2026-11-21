import { PageShell } from "@/components/layout/page-shell";
import { ROUTES } from "@/config/routes";
import { getLocale, getT } from "@/i18n/server";
import { pageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const t = await getT();
  return pageMetadata(t("about.title"), t("about.sub"), ROUTES.about, await getLocale());
}

/** Example page. Copy this folder to add a page, then add it to src/config/routes.ts. */
export default async function AboutPage() {
  const t = await getT();
  return (
    <PageShell title={t("about.title")} sub={t("about.sub")}>
      <p className="max-w-2xl text-muted-foreground">{t("meta.description")}</p>
    </PageShell>
  );
}
