import type { CSSProperties } from "react";
import { design as projectDesign, site, type DesignConfig } from "@/config";

/** Brand values from config as CSS variables on <html>; globals.css maps them onto the shadcn tokens. */
export const brandStyle = {
  "--brand": site.theme.primary.light,
  "--brand-dark": site.theme.primary.dark,
  "--brand-foreground": site.theme.primaryForeground.light,
  "--brand-foreground-dark": site.theme.primaryForeground.dark,
  "--page-bg": site.theme.background.light,
  "--page-bg-dark": site.theme.background.dark,
  ...designStyle(projectDesign),
} as CSSProperties;

/** Classes for <html>: font variables and the default dark mode. */
export { fontVariables } from "@/config/fonts";

/** Design knobs as CSS variables (the numeric ones). */
export function designStyle(design: DesignConfig): CSSProperties {
  return {
    "--radius": design.radius,
    "--nh": String(design.neutral.hue),
    "--nc": String(design.neutral.chroma),
  } as CSSProperties;
}

/**
 * Design knobs as data attributes; globals.css turns each into tokens
 * (shadows, borders, control heights, easings…). On <html> for the whole
 * app; on any element (with designStyle) to preview another look inside it.
 */
export function designAttributes(design: DesignConfig) {
  return {
    "data-shape": design.controlShape,
    "data-border": design.border,
    "data-elevation": design.elevation,
    "data-density": design.density,
    "data-motion": design.motion,
    "data-texture": design.texture,
  } as const;
}

/** The project's own design attributes for <html>. */
export const htmlDesignAttributes = designAttributes(projectDesign);
