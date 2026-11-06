import { PageShell } from "@/components/layout/page-shell";
import { site } from "@/config";
import { ROUTES } from "@/config/routes";
import { t } from "@/i18n";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(t("about.title"), t("about.sub"), ROUTES.about);

/** Example page. Copy this folder to add a page, then add it to src/config/routes.ts. */
export default function AboutPage() {
  return (
    <PageShell title={t("about.title")} sub={t("about.sub")}>
      <p className="max-w-2xl text-muted-foreground">{site.description}</p>
    </PageShell>
  );
}
