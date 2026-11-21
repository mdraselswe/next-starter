import { designSchema, type DesignConfig } from "./schema.ts";

/**
 * ✏️ The look of this project, as knobs. Every component reads the tokens
 * these set, so changing a value restyles the whole app (docs/design-system.md).
 *
 * These defaults are deliberately plain: a project that still looks like this
 * has not been designed yet. Pick values with STARTER-KIT Prompt 1 on
 * /dev/directions, then add the project's own fonts, colours and signature.
 */
const design: DesignConfig = {
  radius: "0.625rem",
  controlShape: "rounded",
  border: "hairline",
  elevation: "flat",
  density: "comfortable",
  motion: "smooth",
  texture: "none",
  neutral: { hue: 0, chroma: 0 },
};

export const designConfig = designSchema.parse(design);
