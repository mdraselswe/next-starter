"use client";

import { Wifi, WifiOff } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { features } from "@/config";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/utils";
import { useConnectionStatus } from "../use-connection-status";

const SPRING = { type: "spring", bounce: 0.25, visualDuration: 0.35 } as const;

/**
 * A pill under the header: slides in when the connection drops, turns green
 * with "Back online" when it returns, then slides away by itself.
 * The live region is always in the page so screen readers announce both.
 */
export function ConnectionBanner() {
  const t = useT();
  const status = useConnectionStatus();
  const offline = status === "offline";

  return (
    <MotionConfig reducedMotion="user">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+4.5rem)] z-50 flex justify-center px-4"
      >
        <AnimatePresence>
          {status !== "online" && (
            <motion.div
              key="pill"
              layout
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.95 }}
              transition={SPRING}
              data-status={status}
              className={cn(
                "flex items-center gap-2 overflow-hidden rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-colors duration-(--motion-base)",
                offline ? "bg-foreground text-background" : "bg-success text-success-foreground",
              )}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={status}
                  layout="position"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={SPRING}
                  className="flex items-center gap-2"
                >
                  {offline ? (
                    <WifiOff className="size-4 shrink-0 animate-pulse" aria-hidden="true" />
                  ) : (
                    <Wifi className="size-4 shrink-0" aria-hidden="true" />
                  )}
                  {offline
                    ? t(features.pwa ? "connection.offlineCached" : "connection.offline")
                    : t("connection.online")}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
