import { t } from "@/i18n";

/** Skeleton in the same shape as PageShell, so content replaces it without a jump. */
export default function Loading() {
  return (
    <div role="status" aria-label={t("loading.label")} className="container-page py-16 md:py-24">
      <div className="mb-10 grid max-w-2xl gap-3">
        <span className="h-12 w-3/4 animate-pulse rounded-lg bg-muted" />
        <span className="h-5 w-1/2 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <span key={i} className="h-36 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
