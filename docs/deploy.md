# Deploy

Pick the host once: `pnpm mode <static|server> [--lock] --host <vercel|cloudflare|other>`. It writes the host's config file; then connect the repo in the host's dashboard (you sign in yourself).

| Host       | Static mode                                                                      | Server mode                                               |
| ---------- | -------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Vercel     | `vercel.json` serves `out/` with security headers. Hobby plan: non-commercial    | Vercel's Next.js integration (no file). Commercial: Pro   |
| Cloudflare | `wrangler.jsonc` serves `out/` as Workers static assets; headers from `_headers` | OpenNext adapter (below). Free plan allows commercial use |
| Other      | Upload `out/` to any static host                                                 | Any Node host: `pnpm build && pnpm start`                 |

Set `NEXT_PUBLIC_SITE_URL` on the host if it differs from `site.url`.

## Cloudflare, static

1. `pnpm mode static --host cloudflare`
2. Cloudflare dashboard → Workers & Pages → Create → Import a repository. Build command `pnpm build`, deploy command `npx wrangler deploy`.

## Cloudflare, server (OpenNext)

Check first that the current OpenNext release supports this Next.js major and Cache Components (its README and changelog); if not, use a Node host until it does.

1. `pnpm mode server --lock --host cloudflare` (writes `wrangler.jsonc` for `.open-next/`).
2. `pnpm add -D @opennextjs/cloudflare wrangler`
3. Add `open-next.config.ts`:

   ```ts
   import { defineCloudflareConfig } from "@opennextjs/cloudflare";
   export default defineCloudflareConfig();
   ```

4. Scripts: `"preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview"`, `"deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"`. Add `.open-next/` to `.gitignore`.
5. Build in CI or Cloudflare's build (Linux). OpenNext's build is not supported on plain Windows; use WSL locally if you need `preview`.
6. Free Workers plan: the compressed worker must stay under the size limit (3 MB at the time of writing). Check the size `wrangler deploy --dry-run` prints after big dependencies.

## After the first deploy

- Open `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` on the real domain.
- Check the response headers (`curl -I https://…`) include the security headers.
