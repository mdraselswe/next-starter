"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { t } from "@/i18n";

const ICONS = { system: Monitor, light: Sun, dark: Moon } as const;

/** Cycles system → light → dark. */
export function ThemeToggle() {
  const { mode, cycle } = useTheme();
  const Icon = ICONS[mode];
  const label = t(`theme.${mode}`);
  return (
    <Button variant="ghost" size="icon" onClick={cycle} aria-label={label} title={label}>
      <Icon aria-hidden="true" />
    </Button>
  );
}
