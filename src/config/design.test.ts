import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DIRECTIONS } from "@/app/[locale]/dev/directions/directions";
import { designConfig } from "./design.ts";
import { BORDERS, CONTROL_SHAPES, DENSITIES, designSchema, ELEVATIONS, MOTIONS, TEXTURES } from "./schema.ts";

const css = readFileSync("src/app/globals.css", "utf8");

/** The value each knob has when no rule matches (the plain defaults in globals.css). */
const KNOBS = {
  shape: { values: CONTROL_SHAPES, base: "rounded" },
  border: { values: BORDERS, base: "hairline" },
  elevation: { values: ELEVATIONS, base: "flat" },
  density: { values: DENSITIES, base: "comfortable" },
  motion: { values: MOTIONS, base: "smooth" },
  texture: { values: TEXTURES, base: "none" },
} as const;

describe("design knobs", () => {
  it("every knob value has its rule in globals.css", () => {
    for (const [knob, { values, base }] of Object.entries(KNOBS)) {
      for (const value of values) {
        if (value === base) continue;
        expect(css, `[data-${knob}="${value}"]`).toContain(`data-${knob}="${value}"`);
      }
    }
  });

  it("the project's design is valid", () => {
    expect(() => designSchema.parse(designConfig)).not.toThrow();
  });

  it("the /dev/directions are valid and differ from each other", () => {
    for (const d of DIRECTIONS) expect(() => designSchema.parse(d.design), d.name).not.toThrow();
    const looks = new Set(DIRECTIONS.map((d) => JSON.stringify(d.design)));
    expect(looks.size).toBe(DIRECTIONS.length);
  });
});
