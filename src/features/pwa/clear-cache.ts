/**
 * Deletes every page the service worker saved for offline use. Call it on
 * sign-out (and account switch) so the next person on this device can't open
 * the previous person's cached pages. Private paths (site.privatePaths) are
 * never cached in the first place; this also clears public pages that showed
 * signed-in details such as a name in the header.
 */
export async function clearOfflineCache(): Promise<void> {
  if (typeof window === "undefined" || !("caches" in window)) return;
  const keys = await caches.keys();
  await Promise.all(keys.filter((k) => k.startsWith("site-")).map((k) => caches.delete(k)));
  navigator.serviceWorker?.controller?.postMessage({ type: "clear-cache" });
}
