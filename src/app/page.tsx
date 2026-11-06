import {
  RefreshCw,
  Server,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button-link";
import { RichText } from "@/components/ui/rich-text";
import { ROUTES } from "@/config/routes";
import { homeContent, type FeatureIcon } from "@/content/home";

const ICONS: Record<FeatureIcon, LucideIcon> = {
  settings: Settings,
  server: Server,
  shield: ShieldCheck,
  refresh: RefreshCw,
  smartphone: Smartphone,
  sparkles: Sparkles,
};

export default function HomePage() {
  const { hero, features } = homeContent;
  return (
    <>
      <section className="container-page grid gap-6 py-20 md:py-32">
        <p className="text-sm font-medium text-primary">{hero.eyebrow}</p>
        <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          <RichText text={hero.title} />
        </h1>
        <p className="max-w-2xl text-lg text-pretty text-muted-foreground">{hero.body}</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={ROUTES.about} size="lg">
            {hero.primaryCta}
          </ButtonLink>
          <ButtonAnchor
            href={hero.secondaryHref}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            variant="outline"
          >
            {hero.secondaryCta}
          </ButtonAnchor>
        </div>
      </section>

      <section className="container-page pb-24">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = ICONS[f.icon];
            return (
              <li key={f.title} className="rounded-xl border bg-card p-6 text-card-foreground">
                <Icon className="mb-4 size-5 text-primary" aria-hidden="true" />
                <h2 className="mb-1 font-semibold">{f.title}</h2>
                <p className="text-sm text-muted-foreground">{f.body}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
