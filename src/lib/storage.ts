import { site } from "@/config";

/** Storage keys are namespaced per project so several apps on one domain don't clash. */
const ns = (key: string) => `${site.shortName.toLowerCase().replace(/\W+/g, "-")}:${key}`;

export const STORAGE_KEYS = {
  theme: ns("theme"),
  installDismissed: ns("install-dismissed"),
} as const;

/** localStorage that never throws (private windows, blocked storage, SSR). */
export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable or full */
  }
}
