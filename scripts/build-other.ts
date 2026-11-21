/**
 * `pnpm build:other`: builds the render mode the project is NOT set to, so
 * shared code stays portable. Skipped when the mode is locked
 * (`renderLocked: true`, set with `pnpm mode <mode> --lock`). CI and the weekly
 * auto-upgrade run it after the normal build.
 */
import { execSync } from "node:child_process";
import { siteConfig } from "../src/config/site.ts";

if (siteConfig.renderLocked) {
  process.stdout.write(`build:other skipped: render mode is locked to "${siteConfig.render}".\n`);
  process.exit(0);
}

const other = siteConfig.render === "static" ? "server" : "static";
process.stdout.write(`build:other: building in ${other} mode\n`);
execSync("pnpm build", { stdio: "inherit", env: { ...process.env, RENDER_MODE: other } });
