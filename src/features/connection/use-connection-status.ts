"use client";

import { useSyncExternalStore } from "react";
import { type ConnectionStatus, getServerStatus, getStatus, subscribe } from "./connection-store";

/** "online" | "offline" | "back" (for 3 s after the connection returns). Server HTML: "online". */
export function useConnectionStatus(): ConnectionStatus {
  return useSyncExternalStore(subscribe, getStatus, getServerStatus);
}
