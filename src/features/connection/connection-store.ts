/**
 * Connection status as a tiny external store (for useSyncExternalStore).
 *
 * "offline"  the browser lost the network
 * "back"     it just came back; shown briefly, then
 * "online"   normal (nothing to show)
 *
 * Listens only while something is subscribed. "back" appears only after a
 * real drop, never on first load.
 */
export type ConnectionStatus = "online" | "offline" | "back";

/** How long "Back online" stays before it hides itself. */
export const BACK_ONLINE_MS = 3000;

let status: ConnectionStatus = "online";
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function set(next: ConnectionStatus) {
  if (next === status) return;
  status = next;
  listeners.forEach((cb) => cb());
}

function onOffline() {
  clearTimeout(timer);
  set("offline");
}

function onOnline() {
  if (status !== "offline") return;
  set("back");
  timer = setTimeout(() => set("online"), BACK_ONLINE_MS);
}

export function subscribe(cb: () => void) {
  if (listeners.size === 0) {
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    if (!navigator.onLine) status = "offline";
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
    if (listeners.size === 0) {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
      clearTimeout(timer);
      status = "online";
    }
  };
}

export const getStatus = (): ConnectionStatus => status;
/** The server always renders "online" (nothing), so hydration matches. */
export const getServerStatus = (): ConnectionStatus => "online";
