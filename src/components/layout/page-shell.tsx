import type { ReactNode } from "react";
import { RichText } from "@/components/ui/rich-text";

/** Standard page heading + content. Keep loading.tsx in the same shape. */
export function PageShell({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="container-page py-16 md:py-24">
      <header className="mb-10 grid max-w-2xl gap-3">
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          <RichText text={title} />
        </h1>
        {sub ? <p className="text-lg text-pretty text-muted-foreground">{sub}</p> : null}
      </header>
      {children}
    </div>
  );
}
