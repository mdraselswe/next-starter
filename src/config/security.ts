/**
 * HTTP security headers for every response. Server mode sends them from
 * next.config.ts; static mode writes them into the host config (`pnpm mode`):
 * public/_headers (Cloudflare, Netlify) or vercel.json.
 *
 * Not included: Content-Security-Policy. A strict CSP needs per-request nonces
 * (server mode only) and a list of every third-party origin the project uses,
 * so each project adds its own (see docs/security.md).
 */
export const SECURITY_HEADERS: { key: string; value: string }[] = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];
