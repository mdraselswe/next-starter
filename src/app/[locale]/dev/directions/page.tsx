import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { isProduction } from "@/config";
import { DirectionPreview } from "./direction-preview";
import { DIRECTIONS } from "./directions";

/**
 * Design directions for this project, side by side, built from the design
 * knobs and the real components. Development only.
 *
 * Workflow (STARTER-KIT Prompt 1): the AI researches the product and its
 * references, writes three directions into directions.ts, you compare them
 * here (light and dark, hover, press, type), pick or mix, and the chosen
 * values go into src/config/design.ts + site.theme + fonts.ts.
 */
export default function DirectionsPage() {
  if (isProduction) notFound();
  return (
    <PageShell
      title="Design directions"
      sub="Three looks for this project, made of design knobs and the real components. Pick one or mix, then copy its values into src/config/design.ts."
    >
      <nav aria-label="Directions" className="mb-8 flex flex-wrap gap-2">
        {DIRECTIONS.map((d) => (
          <a key={d.id} href={`#${d.id}`} className="rounded-full border px-3 py-1 text-sm hover:bg-muted">
            {d.name}
          </a>
        ))}
      </nav>
      <div className="grid gap-16">
        {DIRECTIONS.map((d) => (
          <section key={d.id} id={d.id} aria-labelledby={`${d.id}-title`} className="grid scroll-mt-24 gap-5">
            <header className="grid gap-1">
              <h2 id={`${d.id}-title`} className="font-heading text-2xl font-semibold">
                {d.name}
              </h2>
              <p className="max-w-2xl text-muted-foreground">{d.summary}</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">From:</span> {d.references.join(" · ")}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Signature:</span> {d.signature.join(" · ")}
              </p>
            </header>
            <DirectionPreview direction={d} />
            <details className="text-sm">
              <summary className="cursor-pointer text-muted-foreground">
                Knob values (src/config/design.ts)
              </summary>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-4 text-xs">
                {JSON.stringify({ design: d.design, primary: d.primary }, null, 2)}
              </pre>
            </details>
          </section>
        ))}
      </div>
      <p className="mt-12 text-sm text-muted-foreground">
        Popups (dialog, select, toasts) open outside these previews, so they show the project&apos;s current
        look. Fonts come from src/config/fonts.ts.
      </p>
    </PageShell>
  );
}
