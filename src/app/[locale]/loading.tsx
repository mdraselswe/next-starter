import { PageShellSkeleton } from "@/components/layout/page-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { getT } from "@/i18n/server";

/**
 * Shown while a page in this segment loads. Same shape as PageShell + a card
 * grid. A route whose body looks different gets its own loading.tsx with a
 * skeleton of that body (docs/loading.md).
 */
export default async function Loading() {
  const t = await getT();
  return (
    <PageShellSkeleton label={t("loading.label")}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    </PageShellSkeleton>
  );
}
