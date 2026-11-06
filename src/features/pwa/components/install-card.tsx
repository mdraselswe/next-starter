"use client";

import {
  AppWindow,
  Download,
  EllipsisVertical,
  MonitorDown,
  Share,
  SquarePlus,
  X,
  type LucideIcon,
} from "lucide-react";
import { Fragment, useEffect, useId } from "react";
import { Button } from "@/components/ui/button";
import { features, site } from "@/config";
import { t, type MessageKey } from "@/i18n";
import { readStorage, STORAGE_KEYS, writeStorage } from "@/lib/storage";
import { hideInstallCard, showInstallCard, useInstallCardOpen } from "../install-store";
import type { InstallPlatform } from "../platform";
import { useInstall } from "../use-install";

const DAY_MS = 24 * 60 * 60 * 1000;

const STEPS: Partial<Record<InstallPlatform, [LucideIcon, MessageKey][]>> = {
  ios: [
    [Share, "pwa.ios1"],
    [SquarePlus, "pwa.ios2"],
    [AppWindow, "pwa.ios3"],
  ],
  android: [
    [EllipsisVertical, "pwa.android1"],
    [Download, "pwa.android2"],
    [AppWindow, "pwa.android3"],
  ],
  desktop: [
    [MonitorDown, "pwa.desktop1"],
    [EllipsisVertical, "pwa.desktop2"],
    [AppWindow, "pwa.desktop3"],
  ],
  "mac-safari": [
    [SquarePlus, "pwa.mac1"],
    [AppWindow, "pwa.mac2"],
  ],
};

/** Step copy with `[Label]` shown as the button name to look for. */
function StepText({ text }: { text: string }) {
  return text.split(/(\[[^\]]+\])/g).map((part, i) =>
    part.startsWith("[") ? (
      <b key={i} className="font-semibold text-foreground">
        {part.slice(1, -1)}
      </b>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

function dismiss() {
  writeStorage(STORAGE_KEYS.installDismissed, Date.now());
  hideInstallCard();
}

/**
 * "Install the app" card: pops up once after a short visit (then snoozes) and
 * opens from the footer link. Uses the browser's own prompt where there is
 * one, otherwise shows the steps for this device.
 */
export function InstallCard() {
  const { platform, install } = useInstall();
  const open = useInstallCardOpen();
  const titleId = useId();
  const { delaySeconds, snoozeDays, enabled } = features.installPrompt;

  useEffect(() => {
    if (!enabled || !platform || platform === "installed" || platform === "unsupported") return;
    if (Date.now() - readStorage<number>(STORAGE_KEYS.installDismissed, 0) < snoozeDays * DAY_MS) return;
    const id = setTimeout(showInstallCard, delaySeconds * 1000);
    return () => clearTimeout(id);
  }, [platform, enabled, delaySeconds, snoozeDays]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && dismiss();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open || !platform || platform === "installed") return null;

  const steps = STEPS[platform];
  const name = site.name;

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] z-50 mx-auto max-w-sm animate-in rounded-xl border bg-popover p-5 text-popover-foreground shadow-2xl fade-in slide-in-from-bottom-4 sm:right-5 sm:left-auto sm:mx-0"
    >
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={dismiss}
        aria-label={t("pwa.close")}
        className="absolute top-3 right-3"
      >
        <X aria-hidden="true" />
      </Button>

      <div className="flex items-center gap-3.5 pr-8">
        {/* eslint-disable-next-line @next/next/no-img-element -- generated static app icon */}
        <img src="/icons/icon-192.png" alt="" width={48} height={48} className="size-12 rounded-xl" />
        <div className="grid gap-0.5">
          <h2 id={titleId} className="text-base font-semibold">
            {t("pwa.title", { name })}
          </h2>
          <p className="text-sm text-muted-foreground">{t("pwa.sub")}</p>
        </div>
      </div>

      {platform === "prompt" ? (
        <div className="mt-5 flex gap-2">
          <Button size="lg" className="flex-1" onClick={() => void install().then(hideInstallCard)}>
            <Download aria-hidden="true" />
            {t("pwa.install")}
          </Button>
          <Button size="lg" variant="ghost" onClick={dismiss}>
            {t("pwa.later")}
          </Button>
        </div>
      ) : steps ? (
        <ol className="mt-5 grid list-none gap-3 p-0">
          {steps.map(([Icon, key], i) => (
            <li key={key} className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-muted text-primary">
                <Icon className="size-4" aria-hidden="true" />
                <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
              </span>
              <span>
                <StepText text={t(key, { name })} />
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">{t("pwa.unsupported")}</p>
      )}
    </section>
  );
}

/** Footer link that opens the install card; hidden once installed. */
export function InstallLink({ className }: { className?: string }) {
  const { platform } = useInstall();
  if (!platform || platform === "installed") return null;
  return (
    <button type="button" onClick={showInstallCard} className={className}>
      {t("pwa.footer")}
    </button>
  );
}
