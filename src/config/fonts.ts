import { Geist, Geist_Mono } from "next/font/google";

/**
 * ✏️ Fonts. next/font needs literal options, so fonts live in code; swap the
 * imports here (any Google font, or next/font/local for your own files).
 * `--font-sans`, `--font-heading` and `--font-mono` are used by globals.css.
 */
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const heading = Geist({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const fontVariables = `${sans.variable} ${heading.variable} ${mono.variable}`;
