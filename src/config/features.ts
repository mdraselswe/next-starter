import { featuresSchema, type FeaturesConfig } from "./schema.ts";

/** ✏️ Feature switches. Turn things off here instead of deleting code. */
const features: FeaturesConfig = {
  themeToggle: true,
  pwa: true,
  installPrompt: { enabled: true, delaySeconds: 25, snoozeDays: 14 },
  offlineBanner: true,
};

export const featuresConfig = featuresSchema.parse(features);
