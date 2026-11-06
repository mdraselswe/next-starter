/**
 * Converts the colour formats allowed in site config to hex, for places that
 * don't understand oklch() (SVG rasterised by sharp, the web manifest).
 */
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const toHex = (x: number) =>
  Math.round(clamp(x) * 255)
    .toString(16)
    .padStart(2, "0");
const gamma = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);

export function oklchToHex(l: number, c: number, h: number): string {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const r = 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
  const g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
  const bl = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;
  return `#${toHex(gamma(r))}${toHex(gamma(g))}${toHex(gamma(bl))}`;
}

/** "oklch(0.55 0.2 264)" or "oklch(55% 0.2 264deg)" → "#…"; other formats pass through. */
export function toHexColor(value: string): string {
  const match = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/[^)]*)?\)$/i.exec(value.trim());
  if (!match) return value;
  const [, l = "0", pct, c = "0", h = "0"] = match;
  return oklchToHex(pct ? Number(l) / 100 : Number(l), Number(c), Number(h));
}
