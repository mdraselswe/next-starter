import { ButtonLink } from "@/components/ui/button-link";
import { ROUTES } from "@/config/routes";
import { t } from "@/i18n";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[60svh] place-content-center justify-items-center gap-4 py-24 text-center">
      <p className="font-heading text-7xl font-semibold text-primary">404</p>
      <h1 className="text-2xl font-semibold">{t("notFound.title")}</h1>
      <p className="text-muted-foreground">{t("notFound.body")}</p>
      <ButtonLink href={ROUTES.home} size="lg">
        {t("notFound.cta")}
      </ButtonLink>
    </div>
  );
}
