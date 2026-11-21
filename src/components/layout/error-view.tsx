"use client";

import { Check, Copy, House, RotateCw } from "lucide-react";
import { useEffect, useEffectEvent, useState } from "react";
import { Unplugged } from "@/components/illustrations/unplugged";
import { StatusScene } from "@/components/layout/status-scene";
import { Button } from "@/components/ui/button";
import { ButtonAnchor } from "@/components/ui/button-link";
import { isProduction } from "@/config";
import { useConnectionStatus } from "@/features/connection";
import type { Translate } from "@/i18n";
import { cn } from "@/lib/utils";

/** How long the plug takes to slide in before the page is fetched again. */
const CONNECT_MS = 450;

/**
 * The error page body, shared by app/[locale]/error.tsx and app/global-error.tsx.
 *
 * - "Try again": the plug slides into the socket, then `retry()` fetches and
 *   renders the segment again.
 * - Offline: says so and retries by itself when the connection returns.
 * - Shows the error digest (copyable) so a user can quote it to support;
 *   the message itself only in development (production hides server details).
 * - "Go home" is a full page load: the safest reset after an error.
 */
export function ErrorView({
  error,
  retry,
  t,
  homeHref,
  className,
}: {
  error: unknown;
  retry: () => void;
  t: Translate;
  homeHref: string;
  className?: string;
}) {
  const status = useConnectionStatus();
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const digest = error instanceof Error && "digest" in error ? String(error.digest) : undefined;

  const tryAgain = () => {
    setConnecting(true);
    const wait = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : CONNECT_MS;
    setTimeout(() => {
      retry();
      // Still failing? Pull the plug out again so the button works next time.
      setTimeout(() => setConnecting(false), CONNECT_MS);
    }, wait);
  };

  const onOnline = useEffectEvent(() => tryAgain());
  useEffect(() => {
    const listener = () => onOnline();
    addEventListener("online", listener);
    return () => removeEventListener("online", listener);
  }, []);

  useEffect(() => {
    // Hook for an error reporter (Sentry…): src/infrastructure/<vendor>.
    console.error(error);
  }, [error]);

  const copy = async () => {
    if (!digest) return;
    await navigator.clipboard.writeText(digest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <StatusScene
      role="alert"
      className={className}
      art={
        <div className="parallax [--depth:14]">
          <Unplugged connecting={connecting} className="w-64 sm:w-80" />
        </div>
      }
      title={t("error.title")}
      body={
        <>
          <p>{status === "offline" ? t("error.offline") : t("error.body")}</p>
          {digest ? (
            <p className="mt-3 inline-flex items-center gap-1 font-mono text-xs">
              {t("error.code", { code: digest })}
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={copy}
                aria-label={copied ? t("error.copied") : t("error.copy")}
                title={copied ? t("error.copied") : t("error.copy")}
              >
                {copied ? <Check aria-hidden="true" className="text-success" /> : <Copy aria-hidden="true" />}
              </Button>
            </p>
          ) : null}
          {!isProduction && error instanceof Error ? (
            <details className="mt-4 max-w-md rounded-lg border bg-muted/50 p-3 text-start text-xs">
              <summary className="cursor-pointer font-medium">{t("error.details")}</summary>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">{error.message}</pre>
            </details>
          ) : null}
        </>
      }
      actions={
        <>
          <Button size="lg" onClick={tryAgain} disabled={connecting || status === "offline"}>
            <RotateCw aria-hidden="true" className={cn(connecting && "animate-spin")} />
            {connecting ? t("error.retrying") : t("error.retry")}
          </Button>
          <ButtonAnchor href={homeHref} variant="outline" size="lg">
            <House aria-hidden="true" />
            {t("error.home")}
          </ButtonAnchor>
        </>
      }
    />
  );
}
