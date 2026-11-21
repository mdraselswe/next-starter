import { buildEnv, publicEnv } from "./env.ts";
import { designConfig } from "./design.ts";
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
};

/** The project's look as knobs (src/config/design.ts). */
export const design = designConfig;

export const isProduction = buildEnv.NODE_ENV === "production";

export type { DesignConfig, Host, RenderMode, ThemeMode, ToastPosition } from "./schema.ts";
export {
  BORDERS,
  CONTROL_SHAPES,
  DENSITIES,
  ELEVATIONS,
  HOSTS,
  MOTIONS,
  TEXTURES,
  THEME_MODES,
  TOAST_POSITIONS,
} from "./schema.ts";
