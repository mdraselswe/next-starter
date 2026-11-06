"use client";

import { useSyncExternalStore } from "react";

/** Tiny shared "is the install card open" store (no state library needed). */
let open = false;
const listeners = new Set<() => void>();
const set = (next: boolean) => {
  open = next;
  listeners.forEach((cb) => cb());
};

export const showInstallCard = () => set(true);
export const hideInstallCard = () => set(false);

export function useInstallCardOpen(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => open,
    () => false,
  );
}
