/**
 * First command in a project created from this template:
 *   pnpm setup-project my-app
 *
 * 1. Renames the package.
 * 2. Runs auto-upgrade: every dependency (and Node LTS) moves to its latest
 *    version that passes the checks, so a new project never starts old even
 *    if the template fell behind.
 * 3. Installs the Playwright browser and runs the full check.
 * Then edit src/config/site.ts (see docs/configuration.md).
 */
import { execSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";

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

// Only needed in the template itself.
rmSync("NEW-PROJECT.md", { force: true });

run("pnpm install");
run("node scripts/auto-upgrade.ts");

run("pnpm exec playwright install chromium");
run("pnpm check");

process.stdout.write(`
Done. Next steps:
  1. Edit src/config/site.ts (name, colours, URL), src/config/features.ts, src/content, src/i18n
  2. pnpm mode static|server   (how it is built and hosted)
  3. pnpm dev
  4. pnpm github-setup   (once the GitHub repo exists: auto-merge + required CI)
  5. Give STARTER-KIT.md to your AI and run Prompt 0 (product spec)
`);
