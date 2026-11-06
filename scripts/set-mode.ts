/**
 * Switches the render mode: `pnpm mode static` or `pnpm mode server`.
 * Updates `render` in src/config/site.ts and the Vercel config to match.
 */
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const mode = process.argv[2];
if (mode !== "static" && mode !== "server") {
  process.stderr.write("Usage: pnpm mode static|server\n");
  process.exit(1);
}

const sitePath = path.resolve("src/config/site.ts");
const source = readFileSync(sitePath, "utf8");
const next = source.replace(/render: "(static|server)"/, `render: "${mode}"`);
if (next === source && !source.includes(`render: "${mode}"`)) {
  process.stderr.write('Could not find `render: "…"` in src/config/site.ts\n');
  process.exit(1);
}
writeFileSync(sitePath, next);

// Vercel: static mode serves out/ as plain files (so the generated sw.js ships);
// server mode uses Vercel's Next.js integration.
const vercelPath = path.resolve("vercel.json");
if (mode === "static") {
  const config = {
    $schema: "https://openapi.vercel.sh/vercel.json",
    framework: null,
    buildCommand: "pnpm build",
    outputDirectory: "out",
    headers: [
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }] },
      {
        source: "/manifest.webmanifest",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
    ],
  };
  writeFileSync(vercelPath, `${JSON.stringify(config, null, 2)}\n`);
} else {
  rmSync(vercelPath, { force: true });
}

process.stdout.write(`Render mode set to "${mode}". Run \`pnpm check\` to verify the build.\n`);
