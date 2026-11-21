/**
 * Render mode and host: `pnpm mode <static|server> [--lock] [--host vercel|cloudflare|other]`
 *
 * - Updates `render`, `renderLocked` and `host` in src/config/site.ts.
 * - --lock: the project needs this mode (login, database…), so CI and the
 *   weekly auto-upgrade stop building the other one. Without it, both build.
 * - Writes the host's config: vercel.json (Vercel) or wrangler.jsonc (Cloudflare).
 *   Static hosts that read public/_headers (Cloudflare, Netlify) get the
 *   security headers from scripts/generate-assets.ts.
 */
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const mode = args[0];
const lock = args.includes("--lock");
const hostArg = args.includes("--host") ? args[args.indexOf("--host") + 1] : undefined;

if (
  (mode !== "static" && mode !== "server") ||
  (hostArg && !["vercel", "cloudflare", "other"].includes(hostArg))
) {
  process.stderr.write("Usage: pnpm mode static|server [--lock] [--host vercel|cloudflare|other]\n");
  process.exit(1);
}

const sitePath = path.resolve("src/config/site.ts");
let source = readFileSync(sitePath, "utf8");
const set = (key: string, value: string) => {
  const re = new RegExp(`${key}: [^,\\n]+,`);
  if (!re.test(source)) {
    process.stderr.write(`Could not find \`${key}: …\` in src/config/site.ts\n`);
    process.exit(1);
  }
  source = source.replace(re, `${key}: ${value},`);
};
set("render", `"${mode}"`);
set("renderLocked", String(lock));
if (hostArg) set("host", `"${hostArg}"`);
writeFileSync(sitePath, source);

const host = hostArg ?? /host: "(\w+)"/.exec(source)?.[1] ?? "other";
const NO_CACHE = { key: "Cache-Control", value: "public, max-age=0, must-revalidate" };
const name = JSON.parse(readFileSync("package.json", "utf8")).name as string;

// Vercel: static mode serves out/ as plain files (so the generated sw.js ships);
// server mode uses Vercel's Next.js integration.
const vercelPath = path.resolve("vercel.json");
if (host === "vercel" && mode === "static") {
  const { SECURITY_HEADERS } = await import("../src/config/security.ts");
  const config = {
    $schema: "https://openapi.vercel.sh/vercel.json",
    framework: null,
    buildCommand: "pnpm build",
    outputDirectory: "out",
    headers: [
      { source: "/(.*)", headers: SECURITY_HEADERS },
      { source: "/sw.js", headers: [NO_CACHE] },
      { source: "/manifest.webmanifest", headers: [NO_CACHE] },
    ],
  };
  writeFileSync(vercelPath, `${JSON.stringify(config, null, 2)}\n`);
} else {
  rmSync(vercelPath, { force: true });
}

// Cloudflare: static mode is plain Workers static assets from out/.
// Server mode runs Next.js on Workers through the OpenNext adapter (see docs/deploy.md).
const wranglerPath = path.resolve("wrangler.jsonc");
const today = new Date().toISOString().slice(0, 10);
if (host === "cloudflare") {
  const config =
    mode === "static"
      ? {
          $schema: "node_modules/wrangler/config-schema.json",
          name,
          compatibility_date: today,
          assets: { directory: "./out", not_found_handling: "404-page" },
        }
      : {
          $schema: "node_modules/wrangler/config-schema.json",
          name,
          main: ".open-next/worker.js",
          compatibility_date: today,
          compatibility_flags: ["nodejs_compat", "global_fetch_strictly_public"],
          assets: { directory: ".open-next/assets", binding: "ASSETS" },
        };
  writeFileSync(
    wranglerPath,
    `// Written by \`pnpm mode\`. See docs/deploy.md.\n${JSON.stringify(config, null, 2)}\n`,
  );
} else {
  rmSync(wranglerPath, { force: true });
}

process.stdout.write(
  `Render mode "${mode}"${lock ? " (locked: CI builds only this mode)" : ""}, host "${host}".\n` +
    (host === "cloudflare" && mode === "server"
      ? "Server mode on Cloudflare needs the OpenNext adapter: follow docs/deploy.md.\n"
      : "") +
    "Run `pnpm check` to verify the build.\n",
);
