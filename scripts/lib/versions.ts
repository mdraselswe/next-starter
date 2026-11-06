/** Shared helpers for freshness.ts and auto-upgrade.ts (version holds, outdated, Node LTS). */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

export interface Hold {
  package: string;
  below: number;
  reason: string;
  since: string;
}
export interface Outdated {
  current: string;
  latest: string;
}

const HOLDS_FILE = "version-holds.json";
const DEPENDABOT_FILE = ".github/dependabot.yml";

export const major = (version: string) => Number.parseInt(version.replace(/^\D+/, ""), 10);

export function readHolds(): Hold[] {
  return JSON.parse(readFileSync(HOLDS_FILE, "utf8")).holds;
}

/** Writes version-holds.json and mirrors the holds into Dependabot's npm ignore list. */
export function writeHolds(holds: Hold[]) {
  const file = JSON.parse(readFileSync(HOLDS_FILE, "utf8"));
  file.holds = holds;
  writeFileSync(HOLDS_FILE, `${JSON.stringify(file, null, 2)}\n`);
  writeFileSync(DEPENDABOT_FILE, withIgnoreList(readFileSync(DEPENDABOT_FILE, "utf8"), holds));
}

/** Replaces the `ignore:` block of the npm entry with one entry per hold. */
export function withIgnoreList(yml: string, holds: Hold[]) {
  const entries = holds
    .map((h) => `      - dependency-name: ${h.package}\n        versions: [">=${h.below}"]\n`)
    .join("");
  const block = / {4}ignore:\n(?: {6}- dependency-name: .*\n {8}versions: .*\n)*/;
  if (block.test(yml)) return yml.replace(block, entries ? `    ignore:\n${entries}` : "");
  if (!entries) return yml;
  // No ignore block yet: add one right after the npm groups.
  return yml.replace(/(update-types: \[minor, patch\]\n)/, `$1    ignore:\n${entries}`);
}

/** `pnpm outdated` exits 1 when anything is outdated, so read stdout either way. */
export function outdated(): Record<string, Outdated> {
  let raw = "{}";
  try {
    raw = execSync("pnpm outdated --format json", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch (error) {
    raw = (error as { stdout?: string }).stdout || "{}";
  }
  return JSON.parse(raw);
}

/** Newest Node.js LTS major, or undefined when nodejs.org can't be reached. */
export async function latestNodeLts(): Promise<number | undefined> {
  try {
    const releases: { version: string; lts: string | false }[] = await (
      await fetch("https://nodejs.org/dist/index.json")
    ).json();
    return Math.max(...releases.filter((r) => r.lts).map((r) => major(r.version)));
  } catch {
    return undefined;
  }
}

export const pinnedNode = () => major(readFileSync(".nvmrc", "utf8").trim());
