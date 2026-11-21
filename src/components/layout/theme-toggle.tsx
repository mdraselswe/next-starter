"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useT } from "@/i18n/client";

const ICONS = { system: Monitor, light: Sun, dark: Moon } as const;

/** Cycles system → light → dark. */
export function ThemeToggle() {
  const { mode, cycle } = useTheme();
  const t = useT();
  const Icon = ICONS[mode];
  const label = t(`theme.${mode}`);
  return (
    <Button variant="ghost" size="icon" onClick={cycle} aria-label={label} title={label}>
      <Icon aria-hidden="true" />
    </Button>
  );
}
