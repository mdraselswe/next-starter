"use client";

import { useSyncExternalStore } from "react";
import { site, THEME_MODES, type ThemeMode } from "@/config";
import { readStorage, STORAGE_KEYS, writeStorage } from "@/lib/storage";

const DEFAULT_MODE = site.theme.defaultMode;
const listeners = new Set<() => void>();

const isMode = (value: unknown): value is ThemeMode => THEME_MODES.includes(value as ThemeMode);

function read(): ThemeMode {
  const saved = readStorage<unknown>(STORAGE_KEYS.theme, DEFAULT_MODE);
  return isMode(saved) ? saved : DEFAULT_MODE;
}

/** Adds or removes the `.dark` class (shadcn's dark variant) for a mode. */
export function applyTheme(mode: ThemeMode) {
  const dark =
    mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

function setMode(next: ThemeMode) {
  applyTheme(next);
  writeStorage(STORAGE_KEYS.theme, next);
  listeners.forEach((cb) => cb());
}

/** Light / dark / match-device, saved per project. The pre-paint script is ThemeScript. */
export function useTheme() {
  const mode = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => DEFAULT_MODE,
  );
  const cycle = () =>
    setMode(THEME_MODES[(THEME_MODES.indexOf(read()) + 1) % THEME_MODES.length] ?? DEFAULT_MODE);
  return { mode, setMode, cycle };
}
