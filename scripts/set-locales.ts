/**
 * Sets the site's languages: `pnpm locales <default> [others…]`
 *   pnpm locales bn en   → Bangla at /, English at /en/
 *   pnpm locales en      → English only, no language switcher
 *
 * Updates `i18n.defaultLocale` / `i18n.locales` in src/config/site.ts and
 * preloads the Bangla font only when Bangla is the default (src/config/fonts.ts).
 * Every language needs src/i18n/messages/<locale>.ts registered in messages/index.ts.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const [defaultLocale, ...rest] = process.argv.slice(2);
const tag = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;

if (!defaultLocale || ![defaultLocale, ...rest].every((l) => tag.test(l))) {
  process.stderr.write("Usage: pnpm locales <default> [others…]   e.g. pnpm locales bn en\n");
  process.exit(1);
}

const locales = [defaultLocale, ...rest.filter((l) => l !== defaultLocale)];

const missing = locales.filter((l) => !existsSync(path.resolve(`src/i18n/messages/${l}.ts`)));
if (missing.length > 0) {
  process.stderr.write(
    `No UI text for: ${missing.join(", ")}.\n` +
      `Copy src/i18n/messages/en.ts to <locale>.ts (export const <locale> = {…} satisfies Messages),\n` +
      `translate it, register it in src/i18n/messages/index.ts, then run this again.\n`,
  );
  process.exit(1);
}

const sitePath = path.resolve("src/config/site.ts");
const site = readFileSync(sitePath, "utf8");
const nextSite = site
  .replace(/defaultLocale: "[^"]*"/, `defaultLocale: "${defaultLocale}"`)
  .replace(/locales: \[[^\]]*\]/, `locales: [${locales.map((l) => `"${l}"`).join(", ")}]`);
if (!/defaultLocale: "/.test(site) || !/locales: \[/.test(site)) {
  process.stderr.write("Could not find i18n.defaultLocale / i18n.locales in src/config/site.ts\n");
  process.exit(1);
}
writeFileSync(sitePath, nextSite);

const fontsPath = path.resolve("src/config/fonts.ts");
const fonts = readFileSync(fontsPath, "utf8");
const bengaliFirst = defaultLocale === "bn";
writeFileSync(
  fontsPath,
  fonts.replace(
    /(Noto_Sans_Bengali\(\{[\s\S]*?preload: )(true|false)/,
    `$1${bengaliFirst ? "true" : "false"}`,
  ),
);

process.stdout.write(
  `Languages: ${locales.join(", ")} (default ${defaultLocale}, served at /; others at /<locale>/).\n` +
    `Also translate src/content/* for each language, then run \`pnpm check\`.\n`,
);
