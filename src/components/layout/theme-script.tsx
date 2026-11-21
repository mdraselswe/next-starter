"use client";

import { useLayoutEffect } from "react";
import { InlineScript } from "@/components/ui/inline-script";
import { site } from "@/config";
import { applyTheme, readTheme } from "@/hooks/use-theme";
import { STORAGE_KEYS } from "@/lib/storage";

const code = `(function(){var d=${JSON.stringify(site.theme.defaultMode)},m=d;try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEYS.theme)}));if(s==="light"||s==="dark"||s==="system")m=s}catch(e){}var q=matchMedia("(prefers-color-scheme: dark)"),r=document.documentElement;function a(){var cur=m;try{var s=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEYS.theme)}));if(s)cur=s}catch(e){}var k=cur==="dark"||(cur==="system"&&q.matches);r.classList.toggle("dark",k);r.style.colorScheme=k?"dark":"light"}a();q.addEventListener("change",a)})()`;

/**
 * Applies the saved (or default) theme before first paint, so there is no
 * light/dark flash, and follows the device while the mode is "system".
 * The inline script runs during HTML parsing; <html> has suppressHydrationWarning
 * (Next docs: "Preventing flash before hydration").
 *
 * Changing language swaps the root layout (`app/[locale]`), and React resets
 * <html>'s class and style; the layout effect puts the theme back before paint.
 */
export function ThemeScript() {
  useLayoutEffect(() => applyTheme(readTheme()), []);
  return <InlineScript html={code} />;
}
