/**
 * Runs after `next build`. In static mode:
 * 1. Flattens prefetch segment files on Windows (Next 16 writes
 *    `about/__next.about/__PAGE__.txt` there, the client asks for
 *    `about/__next.about.__PAGE__.txt`). No-op on Linux/macOS.
 * 2. Writes out/sw.js that precaches every exported file, so the whole site
 *    works offline after the first visit. The cache version is a hash of the build.
 */
import { createHash } from "node:crypto";
import {
  existsSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { features, site } from "../src/config/index.ts";

const OUT = path.resolve("out");
if (site.render !== "static" || !existsSync(OUT)) process.exit(0);

function flatten(dir: string, prefix: string, target: string) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) flatten(full, `${prefix}.${name}`, target);
    else renameSync(full, path.join(target, `${prefix}.${name}`));
  }
  rmdirSync(dir);
}

function fixSegments(dir: string) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith("__next.")) flatten(full, name, dir);
    else if (name !== "_next") fixSegments(full);
  }
}
fixSegments(OUT);

if (features.pwa) {
  const SKIP = new Set(["sw.js", "robots.txt", "sitemap.xml", "404.html"]);
  const SKIP_DIRS = ["404/", "_not-found/"];
  const files = (dir: string, base = ""): string[] =>
    readdirSync(dir).flatMap((name) => {
      const rel = base ? `${base}/${name}` : name;
      const full = path.join(dir, name);
      return statSync(full).isDirectory() ? files(full, rel) : [rel];
    });
  const all = files(OUT)
    .filter((rel) => !SKIP.has(rel) && !SKIP_DIRS.some((d) => rel.startsWith(d)))
    .sort();
  const urlFor = (rel: string) =>
    rel === "index.html"
      ? "/"
      : rel.endsWith("/index.html")
        ? `/${rel.slice(0, -"index.html".length)}`
        : `/${rel}`;

  const hash = createHash("sha256");
  for (const rel of all) hash.update(rel).update(readFileSync(path.join(OUT, rel)));
  const version = hash.digest("hex").slice(0, 12);

  const sw = readFileSync(path.resolve("scripts/sw.template.js"), "utf8")
    .replace("__VERSION__", version)
    .replace("__PRECACHE__", JSON.stringify(all.map(urlFor)));
  writeFileSync(path.join(OUT, "sw.js"), sw);
  process.stdout.write(`postbuild: sw.js precaches ${all.length} files (version ${version})\n`);
}
