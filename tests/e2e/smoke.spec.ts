import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { features, site } from "../../src/config/index.ts";
import { DEFAULT_LOCALE, localePath, PREFIXED_LOCALES } from "../../src/config/locale.ts";
import { CATALOGUE } from "../../src/i18n/messages/index.ts";

/** Served URL of a route in a locale (`/about` → `/en/about/`). */
const url = (locale: string, route: string) => {
  const p = localePath(locale, route);
  return p.endsWith("/") ? p : `${p}/`;
};
const text = (locale: string) => {
  const messages = CATALOGUE[locale];
  if (!messages) throw new Error(`No messages for ${locale}`);
  return messages;
};

const ROUTES = ["/", "/about"];
const OTHER = PREFIXED_LOCALES[0];

test.describe("smoke", () => {
  for (const locale of site.i18n.locales) {
    for (const route of ROUTES) {
      const path = url(locale, route);
      test(`${path} renders in ${locale} with no accessibility violations`, async ({ page }) => {
        // Check the settled page: scroll reveals and transitions are off with reduced motion.
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(path);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        const { violations } = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
          .analyze();
        expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
      });
    }
  }

  test("unknown pages show the 404", async ({ page }) => {
    for (const path of ["/no-such-page/", ...(OTHER ? [`/${OTHER}/no-such-page/`] : [])]) {
      const res = await page.goto(path);
      expect(res?.status(), path).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
    // A way out: home and back.
    const messages = text(DEFAULT_LOCALE);
    await page.goto("/no-such-page/");
    await expect(page.getByRole("button", { name: messages["notFound.back"] })).toBeVisible();
    await page.getByRole("link", { name: messages["notFound.cta"] }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(messages["notFound.title"]);
  });

  test("links navigate inside the default language", async ({ page }) => {
    await page.goto("/");
    await page
      .getByRole("navigation", { name: text(DEFAULT_LOCALE)["nav.footer"] })
      .getByRole("link", { name: text(DEFAULT_LOCALE)["nav.about"] })
      .click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(text(DEFAULT_LOCALE)["about.title"]);
  });

  test("language switcher keeps the page, the theme, and changes the language", async ({
    page,
    isMobile,
  }) => {
    test.skip(!OTHER || site.i18n.locales.length !== 2, "needs exactly two languages");
    test.skip(isMobile, "same component on desktop");
    const other = OTHER ?? "";
    const html = page.locator("html");
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(url(DEFAULT_LOCALE, "/about"));
    const messages = text(DEFAULT_LOCALE);
    const theme = new RegExp(messages["theme.system"].split(":")[0] ?? "Theme");
    const button = page.getByRole("button", { name: theme });
    // A click before hydration is lost, so click again until the app reacts.
    await expect(async () => {
      if ((await button.getAttribute("aria-label")) === messages["theme.system"]) await button.click();
      await expect(button).toHaveAttribute("aria-label", messages["theme.light"], { timeout: 1000 });
    }).toPass(); // system → light
    await button.click(); // light → dark
    await expect(html).toHaveClass(/\bdark\b/);
    await page.getByRole("link", { name: new RegExp(text(DEFAULT_LOCALE)["locale.switch"]) }).click();
    await expect(page).toHaveURL(new RegExp(`/${other}/about/$`));
    await expect(page.locator("html")).toHaveAttribute("lang", other);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(text(other)["about.title"]);
    await expect(html).toHaveClass(/\bdark\b/); // the root layout swap must not reset the theme
    await page.getByRole("link", { name: new RegExp(text(other)["locale.switch"]) }).click();
    await expect(page).toHaveURL(/\/about\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", DEFAULT_LOCALE);
    await expect(html).toHaveClass(/\bdark\b/);
    expect(errors).toEqual([]);
  });

  test("theme toggle cycles and is remembered", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const theme = new RegExp(text(DEFAULT_LOCALE)["theme.system"].split(":")[0] ?? "Theme");
    const messages = text(DEFAULT_LOCALE);
    const button = page.getByRole("button", { name: theme });
    // A click before hydration is lost, so click again until the app reacts.
    await expect(async () => {
      if ((await button.getAttribute("aria-label")) === messages["theme.system"]) await button.click();
      await expect(button).toHaveAttribute("aria-label", messages["theme.light"], { timeout: 1000 });
    }).toPass(); // system → light
    await expect(html).not.toHaveClass(/\bdark\b/);
    await button.click(); // light → dark
    await expect(html).toHaveClass(/\bdark\b/);
    await page.reload();
    await expect(html).toHaveClass(/\bdark\b/);
  });

  test("connection banner shows offline, then back online, then hides", async ({ page, context }) => {
    test.skip(!features.offlineBanner, "offline banner is off");
    const messages = text(DEFAULT_LOCALE);
    await page.goto("/");
    const offline = features.pwa ? messages["connection.offlineCached"] : messages["connection.offline"];
    // Events before hydration are missed, so drop the connection again until the banner reacts.
    await expect(async () => {
      await context.setOffline(false);
      await context.setOffline(true);
      await expect(page.getByText(offline)).toBeVisible({ timeout: 1000 });
    }).toPass();
    await context.setOffline(false);
    const back = page.getByText(messages["connection.online"]);
    await expect(back).toBeVisible();
    await expect(back).toBeHidden({ timeout: 6000 });
  });

  test("generated SEO and PWA files exist", async ({ request }) => {
    for (const file of [
      "/robots.txt",
      "/sitemap.xml",
      "/manifest.webmanifest",
      "/icons/icon-192.png",
      "/sw.js",
    ]) {
      expect((await request.get(file)).status(), file).toBe(200);
    }
  });

  test("private paths are kept out of robots and the offline cache", async ({ request }) => {
    const [first] = site.privatePaths;
    test.skip(!first, "no private paths configured");
    const robots = await (await request.get("/robots.txt")).text();
    const sw = await (await request.get("/sw.js")).text();
    expect(robots).toContain(`Disallow: ${first}`);
    expect(sw).toContain(JSON.stringify(first));
    if (OTHER) expect(sw).toContain(JSON.stringify(`/${OTHER}${first}`));
  });
});

test.describe("server mode", () => {
  test.skip(site.render !== "server", "server mode only");

  test("the default language has one URL", async ({ request }) => {
    const res = await request.get(`/${DEFAULT_LOCALE}/about/`, { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toMatch(/^\/about\/?$/);
  });

  test("security headers are sent", async ({ request }) => {
    const headers = (await request.get("/")).headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["strict-transport-security"]).toContain("max-age=");
  });
});
