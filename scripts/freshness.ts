/**
 * Freshness gate: `pnpm freshness`. Fails when the project has fallen behind,
 * so stale versions can't go unnoticed (CI runs it weekly and on every PR).
 *
 * Fails on:
 * - a dependency with a newer MAJOR version that is not listed in version-holds.json
 * - .nvmrc behind the newest Node.js LTS major
 * Warns on: outdated minor/patch versions (Dependabot handles those).
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

interface Hold {
  package: string;
  below: number;
  reason: string;
}
interface Outdated {
  current: string;
  latest: string;
}

const holds: Hold[] = JSON.parse(readFileSync("version-holds.json", "utf8")).holds;
const major = (v: string) => Number.parseInt(v.replace(/^\D+/, ""), 10);

const problems: string[] = [];
const notes: string[] = [];

// 1. Dependencies. `pnpm outdated` exits 1 when anything is outdated, so read stdout either way.
let raw = "{}";
try {
  raw = execSync("pnpm outdated --format json", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
} catch (error) {
  raw = (error as { stdout?: string }).stdout || "{}";
}
const outdated: Record<string, Outdated> = JSON.parse(raw);

for (const [name, { current, latest }] of Object.entries(outdated)) {
  if (major(latest) > major(current)) {
    const hold = holds.find((h) => h.package === name);
    if (hold && major(latest) >= hold.below)
      notes.push(`held   ${name} ${current} (latest ${latest}): ${hold.reason}`);
    else problems.push(`major  ${name} ${current} → ${latest}: upgrade it, or add a hold with the reason`);
  } else {
    notes.push(`minor  ${name} ${current} → ${latest} (Dependabot will open a PR)`);
  }
}

// Holds whose blocker may be gone: the held major is no longer newer than what we can use.
for (const hold of holds) {
  if (!outdated[hold.package])
    notes.push(`check  hold on ${hold.package} may be stale (nothing newer is blocked)`);
}

// 2. Node.js LTS.
try {
  const releases: { version: string; lts: string | false }[] = await (
    await fetch("https://nodejs.org/dist/index.json")
  ).json();
  const latestLts = Math.max(...releases.filter((r) => r.lts).map((r) => major(r.version)));
  const pinned = major(readFileSync(".nvmrc", "utf8").trim());
  if (pinned < latestLts)
    problems.push(
      `node   .nvmrc is ${pinned}, newest LTS is ${latestLts}: update .nvmrc, engines and @types/node`,
    );
} catch {
  notes.push("node   could not reach nodejs.org to check the LTS version");
}

for (const line of notes) process.stdout.write(`  ${line}\n`);
if (problems.length) {
  process.stderr.write(`\nFreshness check failed:\n${problems.map((p) => `  ✗ ${p}`).join("\n")}\n`);
  process.exit(1);
}
process.stdout.write("\nFreshness check passed.\n");
