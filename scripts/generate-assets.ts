/**
 * Generates config-driven public files before `dev` and `build`:
 * robots.txt, sitemap.xml, manifest.webmanifest, app icons and a basic
 * service worker. They are build output (git-ignored); edit src/config instead.
 *
 * Why not Next metadata routes (app/robots.ts…)? In static mode they need
 * `dynamic = "force-static"`, which server mode (Cache Components) rejects.
 * Files in public/ work the same in both modes.
 *
 * Run with Node's built-in TypeScript support: `node scripts/generate-assets.ts`.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { features, site } from "../src/config/index.ts";
import { pageUrl, ROUTES, SITEMAP_ROUTES } from "../src/config/routes.ts";
import { toHexColor } from "./lib/color.ts";

const PUBLIC = path.resolve("public");
const ICONS = path.join(PUBLIC, "icons");
mkdirSync(ICONS, { recursive: true });

const write = (file: string, content: string | Buffer) => writeFileSync(path.join(PUBLIC, file), content);
const abs = (route: string) => new URL(pageUrl(route), `${site.url}/`).toString();

// robots.txt + sitemap.xml
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
write(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${SITEMAP_ROUTES.map(
    (r) =>
      `  <url><loc>${abs(r)}</loc><changefreq>weekly</changefreq><priority>${r === ROUTES.home ? "1.0" : "0.7"}</priority></url>`,
  ).join("\n")}\n</urlset>\n`,
);

// App icon: a rounded tile in the brand colour with the first letter of the short name.
const mode = site.theme.defaultMode === "dark" ? "dark" : "light";
const brand = toHexColor(site.theme.primary.light);
const onBrand = toHexColor(site.theme.primaryForeground.light);
const bg = toHexColor(site.theme.background[mode]);
const letter = (site.shortName.trim()[0] ?? "A").toUpperCase().replace(/[<&>]/g, "");

function iconSvg({ size, radius, scale }: { size: number; radius: number; scale: number }) {
  const r = size * radius;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${r}" fill="${brand}"/><text x="50%" y="50%" dy="0.35em" text-anchor="middle" font-family="Inter, Segoe UI, Helvetica, Arial, sans-serif" font-weight="700" font-size="${size * 0.5 * scale}" fill="${onBrand}">${letter}</text></svg>`;
}

write("icons/icon.svg", iconSvg({ size: 64, radius: 0.22, scale: 1 }));
const png = (svg: string) => sharp(Buffer.from(svg)).png().toBuffer();
const [icon192, icon512, maskable, apple] = await Promise.all([
  png(iconSvg({ size: 192, radius: 0.22, scale: 1 })),
  png(iconSvg({ size: 512, radius: 0.22, scale: 1 })),
  // Maskable: full-bleed square, letter inside the 80% safe zone.
  png(iconSvg({ size: 512, radius: 0, scale: 0.8 })),
  // Apple adds its own rounded corners.
  png(iconSvg({ size: 180, radius: 0, scale: 1 })),
]);
write("icons/icon-192.png", icon192);
write("icons/icon-512.png", icon512);
write("icons/icon-maskable-512.png", maskable);
write("icons/apple-touch-icon.png", apple);

// Web manifest + a service worker that caches pages as they are visited.
// (Static builds replace out/sw.js with one that precaches the whole site.)
if (features.pwa) {
  const manifest = {
    id: "/",
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    lang: site.locale,
    dir: site.dir,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: bg,
    theme_color: bg,
    icons: [
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  write("manifest.webmanifest", `${JSON.stringify(manifest, null, 2)}\n`);
  const template = readFileSync(path.resolve("scripts/sw.template.js"), "utf8");
  write(
    "sw.js",
    template.replace("__VERSION__", `runtime-${Date.now()}`).replace("__PRECACHE__", JSON.stringify(["/"])),
  );
} else {
  rmSync(path.join(PUBLIC, "manifest.webmanifest"), { force: true });
  rmSync(path.join(PUBLIC, "sw.js"), { force: true });
}

process.stdout.write(
  `generate-assets: robots, sitemap, icons${features.pwa ? ", manifest, sw" : ""} (${site.render} mode)\n`,
);
