/**
 * First command in a project created from this template:
 *   pnpm setup-project my-app
 *
 * 1. Renames the package.
 * 2. Updates every dependency to its latest version (except majors held in
 *    version-holds.json), so a new project never starts on old versions.
 * 3. Installs the Playwright browser and runs the full check.
 * Then edit src/config/site.ts (see docs/configuration.md).
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const name = process.argv[2];
if (!name || !/^[a-z0-9][a-z0-9-._]*$/.test(name)) {
  process.stderr.write("Usage: pnpm setup-project <package-name>   (lowercase, e.g. coffee-shop)\n");
  process.exit(1);
}

const run = (cmd: string) => {
  process.stdout.write(`\n$ ${cmd}\n`);
  execSync(cmd, { stdio: "inherit" });
};

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
pkg.name = name;
pkg.version = "0.1.0";
writeFileSync("package.json", `${JSON.stringify(pkg, null, 2)}\n`);

const holds: { package: string; below: number }[] = JSON.parse(
  readFileSync("version-holds.json", "utf8"),
).holds;
const held = holds.map((h) => `"!${h.package}"`).join(" ");
run(`pnpm update --latest ${held}`);
// Held packages still get their newest version below the hold.
for (const h of holds) run(`pnpm update "${h.package}@<${h.below}"`);

run("pnpm exec playwright install chromium");
run("pnpm check");

process.stdout.write(`
Done. Next steps:
  1. Edit src/config/site.ts (name, colours, URL), src/config/features.ts, src/content, src/i18n
  2. pnpm mode static|server   (how it is built and hosted)
  3. pnpm dev
  4. Give STARTER-KIT.md to your AI and run Prompt 0 (product spec)
`);
