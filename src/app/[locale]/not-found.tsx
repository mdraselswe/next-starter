import { NotFoundView } from "@/components/layout/not-found-view";
import { getLocale, getT } from "@/i18n/server";

export default async function NotFound() {
  return <NotFoundView t={await getT()} locale={await getLocale()} />;
}
