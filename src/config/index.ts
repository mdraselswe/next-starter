import { buildEnv, publicEnv } from "./env.ts";
import { featuresConfig } from "./features.ts";
import { siteConfig } from "./site.ts";

/** Resolved configuration: config files plus environment overrides. Import from "@/config". */
export const site = {
  ...siteConfig,
  url: (publicEnv.NEXT_PUBLIC_SITE_URL ?? siteConfig.url).replace(/\/$/, ""),
  render: buildEnv.RENDER_MODE ?? siteConfig.render,
};

export const features = {
  ...featuresConfig,
  installPrompt: {
    ...featuresConfig.installPrompt,
    enabled: featuresConfig.pwa && featuresConfig.installPrompt.enabled,
  },
  offlineBanner: featuresConfig.pwa && featuresConfig.offlineBanner,
};

export const isProduction = buildEnv.NODE_ENV === "production";

export type { RenderMode, ThemeMode } from "./schema.ts";
export { THEME_MODES } from "./schema.ts";
