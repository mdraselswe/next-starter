import { Heart } from "lucide-react";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { EmptyBox } from "@/components/illustrations/empty-box";
import { PageShell } from "@/components/layout/page-shell";
import { NumberTicker } from "@/components/motion/number-ticker";
import { SuspenseReveal } from "@/components/motion/suspense-reveal";
import { Spotlight } from "@/components/motion/spotlight";
import { Button } from "@/components/ui/button";
import { ButtonAnchor } from "@/components/ui/button-link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { isProduction } from "@/config";
import { localePath } from "@/config/locale";
import { getFormatter, getLocale, getT } from "@/i18n/server";
import { cn } from "@/lib/utils";
import { ComponentGallery } from "./component-gallery";
import { CrashButton } from "./crash-button";

/**
 * Design-system preview: every colour token, the type scale in both scripts,
 * each UI component's variants and the motion kit, in the current theme. Development only
 * (a 404 in production builds; robots.txt disallows /dev).
 * Add a section here whenever you add a component to src/components/ui.
 */
export const metadata = { robots: { index: false } };

const COLORS = [
  ["background", "bg-background text-foreground"],
  ["card", "bg-card text-card-foreground"],
  ["primary", "bg-primary text-primary-foreground"],
  ["secondary", "bg-secondary text-secondary-foreground"],
  ["muted", "bg-muted text-muted-foreground"],
  ["accent", "bg-accent text-accent-foreground"],
  ["destructive", "bg-destructive/10 text-destructive"],
  ["success", "bg-success text-success-foreground"],
  ["warning", "bg-warning text-warning-foreground"],
  ["info", "bg-info text-info-foreground"],
] as const;

const VARIANTS = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const;

const EASINGS = ["ease-out-quart", "ease-out-expo", "ease-in-out-quart", "ease-spring"] as const;

/** A card and its skeleton: same box, same line heights, so nothing jumps. */
function VetCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dr. Ayesha Rahman</CardTitle>
        <CardDescription>Small animals · Mirpur</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">Available today, 4–8 pm</CardContent>
    </Card>
  );
}

function VetCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-[1lh] w-2/3 font-heading text-base leading-snug" />
        <Skeleton className="h-[1lh] w-1/2 text-sm" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[1lh] w-3/5 text-sm" />
      </CardContent>
    </Card>
  );
}

async function SlowVetCard() {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return <VetCard />;
}

export default async function DevPage() {
  if (isProduction) notFound();
  const t = await getT();
  const f = await getFormatter();
  const locale = await getLocale();
  return (
    <PageShell title={t("dev.title")} sub={t("dev.sub")}>
      <div className="grid gap-12">
        <a
          href={localePath(locale, "/dev/directions/")}
          className="rounded-2xl border border-dashed p-4 text-sm hover:bg-muted"
        >
          <span className="font-medium">Design directions →</span>{" "}
          <span className="text-muted-foreground">
            three looks for this project made of the design knobs (src/config/design.ts), side by side.
          </span>
        </a>
        <section className="grid gap-4">
          <h2 className="text-xl font-semibold">Colours</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {COLORS.map(([name, classes]) => (
              <li key={name} className={cn("rounded-lg border p-4 text-sm font-medium", classes)}>
                {name}
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold">Type</h2>
          <p className="font-heading text-4xl font-semibold">Heading · শিরোনাম</p>
          <p className="text-lg">Body text in Latin and বাংলা লেখা, same line.</p>
          <p className="text-sm text-muted-foreground">
            {f.money(1250)} · {f.number(1234567)} · {f.dateTime(Date.UTC(2026, 0, 1, 18, 30))}
          </p>
          <code className="font-mono text-sm">font-mono 0123456789</code>
        </section>

        <section className="grid gap-4">
          <h2 className="text-xl font-semibold">Button</h2>
          <div className="flex flex-wrap gap-3">
            {VARIANTS.map((v) => (
              <Button key={v} variant={v}>
                {v}
              </Button>
            ))}
            <Button disabled>disabled</Button>
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-xl font-semibold">Components</h2>
          <ComponentGallery />
        </section>

        <section className="grid gap-4">
          <h2 className="text-xl font-semibold">Loading (docs/loading.md)</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <VetCard />
            <VetCardSkeleton />
            <SuspenseReveal fallback={<VetCardSkeleton />}>
              <SlowVetCard />
            </SuspenseReveal>
          </div>
          <p className="text-sm text-muted-foreground">
            Card · its skeleton · SuspenseReveal (1.5 s, skeleton fades out, card rises in). Connection
            banner: DevTools → Network → Offline, then back to No throttling.
          </p>
        </section>

        <section className="grid gap-6">
          <h2 className="text-xl font-semibold">Motion (docs/motion.md)</h2>

          <div className="grid gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Easing tokens: hover a row (duration-(--motion-slow))
            </h3>
            <ul className="grid gap-2">
              {EASINGS.map((e) => (
                <li key={e} className="group flex items-center gap-3 rounded-lg border p-3 text-sm">
                  <span className="w-36 font-mono">{e}</span>
                  <span className="relative h-2 flex-1 rounded-full bg-muted">
                    <span
                      className={cn(
                        "absolute top-0 left-0 size-2 rounded-full bg-primary transition-[left] duration-(--motion-slow) group-hover:left-[calc(100%-0.5rem)]",
                        e,
                      )}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Spotlight className="grid place-items-center gap-2 rounded-xl border bg-card p-6 text-center">
              <EmptyBox className="w-32" />
              <p className="text-sm text-muted-foreground">draw + Spotlight (pointer glow)</p>
            </Spotlight>
            <div className="grid place-items-center gap-1 rounded-xl border bg-card p-6 text-center">
              <NumberTicker value={12480} className="font-heading text-4xl font-semibold" />
              <NumberTicker value={1250} format="money" className="text-lg text-primary" />
              <p className="text-sm text-muted-foreground">NumberTicker (motion)</p>
            </div>
            <div className="grid place-items-center gap-3 rounded-xl border bg-card p-6 text-center">
              <Button
                variant="outline"
                size="icon"
                aria-label="Like"
                className="transition-transform duration-(--motion-base) ease-spring active:scale-90"
              >
                <Heart aria-hidden="true" />
              </Button>
              <p className="text-sm text-muted-foreground">Press: active:scale-90 ease-spring</p>
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3">
            {[0, 1, 2].map((n) => (
              <li
                key={n}
                className="reveal rounded-xl border bg-muted p-6 text-sm"
                style={{ "--i": n } as CSSProperties}
              >
                reveal · --i: {n}
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-4">
          <h2 className="text-xl font-semibold">404 and error pages</h2>
          <p className="text-sm text-muted-foreground">
            Animated scenes (StatusScene + Planet / Unplugged). Move the pointer over them; go offline on the
            error page and back online to see it retry by itself.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonAnchor href={localePath(locale, "/no-such-page/")} variant="outline">
              Open a missing page
            </ButtonAnchor>
            <CrashButton />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
