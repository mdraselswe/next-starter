/* Service worker. Generated from scripts/sw.template.js by scripts/generate-assets.ts
   (and, in static mode, scripts/postbuild.ts); do not edit public/sw.js or out/sw.js. */
const VERSION = "__VERSION__";
const PRECACHE = __PRECACHE__;
/**
 * Paths that belong to one signed-in person (site.privatePaths, with and
 * without each locale prefix). They are never cached, so a shared device
 * can't show someone else's account offline or after sign-out.
 */
const PRIVATE = __PRIVATE__;
const CACHE = `site-${VERSION}`;
/** How long a page request may take before the cached copy is shown. */
const NETWORK_TIMEOUT_MS = 3500;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k.startsWith("site-") && k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

/** The page calls clearOfflineCache() (src/features/pwa) on sign-out. */
self.addEventListener("message", (event) => {
  if (event.data?.type === "clear-cache") {
    event.waitUntil(
      caches
        .keys()
        .then((keys) => Promise.all(keys.filter((k) => k.startsWith("site-")).map((k) => caches.delete(k)))),
    );
  }
});

const isPrivate = (url) =>
  PRIVATE.some((p) => url.pathname === p || url.pathname.startsWith(p.endsWith("/") ? p : `${p}/`));

const isImmutable = (url) =>
  url.pathname.startsWith("/_next/static/") ||
  url.pathname.startsWith("/images/") ||
  /\.(png|svg|webp|woff2?)$/.test(url.pathname);

/** Router payloads: `?_rsc=` varies per build, the file does not. */
const isRouterData = (url, request) => url.pathname.endsWith(".txt") || request.headers.get("RSC") === "1";

/** Only shared, public responses are stored: never `no-store` / `private` ones or anything behind a cookie login. */
function cacheable(response) {
  if (!response.ok || response.type !== "basic") return false;
  const control = response.headers.get("Cache-Control") ?? "";
  return !/\b(no-store|private)\b/i.test(control);
}

async function fromCache(request) {
  const cache = await caches.open(CACHE);
  return (await cache.match(request)) ?? (await cache.match(request, { ignoreSearch: true }));
}

async function store(request, response) {
  if (cacheable(response)) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

/** Pages: fresh from the network when it answers quickly, otherwise the saved copy. */
async function page(request) {
  const network = fetch(request).then((res) => store(request, res));
  const timeout = new Promise((resolve) => setTimeout(resolve, NETWORK_TIMEOUT_MS));
  try {
    const res = await Promise.race([network, timeout]);
    if (res) return res;
  } catch {
    /* offline: fall through to the cache */
  }
  const cached = await fromCache(request);
  if (cached) return cached;
  try {
    return await network;
  } catch {
    return (await fromCache(new Request("/"))) ?? Response.error();
  }
}

async function cacheFirst(request) {
  return (await fromCache(request)) ?? store(request, await fetch(request));
}

async function staleWhileRevalidate(request) {
  const cached = await fromCache(request);
  const network = fetch(request)
    .then((res) => store(request, res))
    .catch(() => undefined);
  return cached ?? (await network) ?? Response.error();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // maps embed, fonts CDN etc. stay online-only
  if (request.headers.has("Authorization")) return;

  // Private pages and their router data: network only. Offline, a navigation shows the home page.
  if (isPrivate(url)) {
    if (request.mode === "navigate") {
      event.respondWith(
        fetch(request).catch(async () => (await fromCache(new Request("/"))) ?? Response.error()),
      );
    }
    return;
  }

  if (request.mode === "navigate") event.respondWith(page(request));
  else if (isImmutable(url)) event.respondWith(cacheFirst(request));
  else if (isRouterData(url, request)) event.respondWith(staleWhileRevalidate(request));
  else event.respondWith(fetch(request).catch(async () => (await fromCache(request)) ?? Response.error()));
});
