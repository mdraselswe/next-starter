import { describe, expect, it } from "vitest";
import { format, t } from "./index";

describe("i18n", () => {
  it("fills placeholders and keeps unknown ones", () => {
    expect(format("Hi {name} {x}", { name: "Ana" })).toBe("Hi Ana {x}");
  });

  it("translates typed keys", () => {
    expect(t("pwa.title", { name: "App" })).toBe("Install App");
  });
});
