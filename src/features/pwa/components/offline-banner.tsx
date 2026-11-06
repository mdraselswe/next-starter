"use client";

import { WifiOff } from "lucide-react";
import { useSyncExternalStore } from "react";
import { t } from "@/i18n";

function subscribe(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

/** A small pill under the header while the device is offline. */
export function OfflineBanner() {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
  if (online) return null;
  return (
    <div
      role="status"
      className="fixed top-[calc(env(safe-area-inset-top,0px)+4.5rem)] left-1/2 z-50 flex -translate-x-1/2 animate-in items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium whitespace-nowrap text-background shadow-lg fade-in slide-in-from-top-2"
    >
      <WifiOff className="size-4" aria-hidden="true" />
      {t("pwa.offline")}
    </div>
  );
}
