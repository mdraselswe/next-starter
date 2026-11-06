import { describe, expect, it } from "vitest";
import { toHexColor } from "./color";

describe("toHexColor", () => {
  it("converts oklch white, black and a hue", () => {
    expect(toHexColor("oklch(1 0 0)")).toBe("#ffffff");
    expect(toHexColor("oklch(0 0 0)")).toBe("#000000");
    expect(toHexColor("oklch(62.8% 0.2577 29.23)")).toBe("#ff0000");
  });

  it("passes other formats through", () => {
    expect(toHexColor("#0b0b0f")).toBe("#0b0b0f");
  });
});
