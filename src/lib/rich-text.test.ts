import { describe, expect, it } from "vitest";
import { splitAccent, stripAccent } from "./rich-text";

describe("rich text", () => {
  it("splits accent words", () => {
    expect(splitAccent("Build on a [solid] base")).toEqual([
      { text: "Build on a ", accent: false },
      { text: "solid", accent: true },
      { text: " base", accent: false },
    ]);
  });

  it("strips markup for plain titles", () => {
    expect(stripAccent("A [b] c")).toBe("A b c");
  });
});
