import { describe, expect, it } from "vitest";
import { DEFAULT_LOCALE, localePath, PREFIXED_LOCALES, splitLocale } from "@/config/locale";
import { format, formatter, pickLocale, translator } from "./index";
import { CATALOGUE } from "./messages";

describe("i18n", () => {
  it("fills placeholders and keeps unknown ones", () => {
    expect(format("Hi {name} {x}", { name: "Ana" })).toBe("Hi Ana {x}");
  });

  it("translates typed keys per locale", () => {
    expect(translator("en")("pwa.title", { name: "App" })).toBe("Install App");
    expect(translator("bn")("pwa.title", { name: "App" })).toBe("App ইনস্টল করুন");
  });

  it("has the same keys in every language", () => {
    const keys = Object.keys(CATALOGUE.en ?? {}).sort();
    for (const [locale, messages] of Object.entries(CATALOGUE)) {
      expect(Object.keys(messages).sort(), locale).toEqual(keys);
    }
  });

  it("falls back to the default locale for content", () => {
    expect(pickLocale({ [DEFAULT_LOCALE]: "default" }, "xx")).toBe("default");
    expect(pickLocale({ bn: "বাংলা", en: "English" }, "en")).toBe("English");
  });

  it("formats money and dates in the site's currency and time zone", () => {
    expect(formatter("en").money(1250)).toContain("1,250");
    expect(formatter("bn").number(25)).toBe("২৫");
    // 18:30 UTC is 00:30 the next day in Dhaka (UTC+6).
    expect(formatter("en").date(Date.UTC(2026, 0, 1, 18, 30), { day: "numeric" })).toBe("2");
  });
});

// Uses the configured languages, so it holds for any project.
const other = PREFIXED_LOCALES[0];

describe("locale paths", () => {
  it("keeps the default locale unprefixed", () => {
    expect(localePath(DEFAULT_LOCALE, "/about")).toBe("/about");
    expect(splitLocale("/about/")).toEqual({ locale: DEFAULT_LOCALE, path: "/about/" });
  });

  it.runIf(other)("prefixes the other locales", () => {
    const l = other ?? "";
    expect(localePath(l, "/about")).toBe(`/${l}/about`);
    expect(localePath(l, "/")).toBe(`/${l}`);
    expect(splitLocale(`/${l}/about/`)).toEqual({ locale: l, path: "/about/" });
    expect(splitLocale(`/${l}`)).toEqual({ locale: l, path: "/" });
  });
});
