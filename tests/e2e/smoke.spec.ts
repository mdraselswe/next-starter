import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/about/"];

test.describe("smoke", () => {
  for (const path of PAGES) {
    test(`${path} renders with no accessibility violations`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .analyze();
      expect(violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
    });
  }

  test("unknown pages show the 404", async ({ page }) => {
    const res = await page.goto("/no-such-page/");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("theme toggle cycles and is remembered", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const toggle = page.getByRole("button", { name: /Theme:/ });
    await toggle.click(); // system → light
    await expect(html).not.toHaveClass(/\bdark\b/);
    await page.getByRole("button", { name: /Theme:/ }).click(); // light → dark
    await expect(html).toHaveClass(/\bdark\b/);
    await page.reload();
    await expect(html).toHaveClass(/\bdark\b/);
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
});
