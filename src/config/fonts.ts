import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";

/**
 * ✏️ Fonts. next/font needs literal options, so fonts live in code; swap the
 * imports here (any Google font, or next/font/local for your own files).
 *
 * Latin text uses Geist; Bangla text falls through to Noto Sans Bengali
 * (globals.css puts both in each stack). The Bengali font only covers Bengali
 * code points (unicode-range), so a page without Bangla never downloads it.
 * `preload` is true when Bangla is the default language (`pnpm locales` sets it).
 */
const sans = Geist({ subsets: ["latin"], variable: "--font-latin", display: "swap" });
const heading = Geist({ subsets: ["latin"], variable: "--font-latin-heading", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-latin-mono", display: "swap" });
const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  display: "swap",
  preload: true,
});

export const fontVariables = `${sans.variable} ${heading.variable} ${mono.variable} ${bengali.variable}`;
