/**
 * Freshness gate: `pnpm freshness`. Fails when the project has fallen behind,
 * so stale versions can't go unnoticed (CI runs it weekly and on every PR).
 *
 * Fails on:
 * - a dependency with a newer MAJOR version that is not listed in version-holds.json
 * - .nvmrc behind the newest Node.js LTS major
 * Warns on: outdated minor/patch versions (Dependabot and auto-upgrade handle those).
 */
import { latestNodeLts, major, outdated, pinnedNode, readHolds } from "./lib/versions.ts";

const holds = readHolds();
const behind = outdated();
const problems: string[] = [];
const notes: string[] = [];

for (const [name, { current, latest }] of Object.entries(behind)) {
  if (major(latest) > major(current)) {
    const hold = holds.find((h) => h.package === name);
    if (hold && major(latest) >= hold.below)
      notes.push(`held   ${name} ${current} (latest ${latest}): ${hold.reason}`);
    else problems.push(`major  ${name} ${current} → ${latest}: run pnpm auto-upgrade, or add a hold`);
  } else {
    notes.push(`minor  ${name} ${current} → ${latest} (Dependabot / auto-upgrade will take it)`);
  }
}

for (const hold of holds) {
  if (!behind[hold.package])
    notes.push(`check  hold on ${hold.package} may be stale (nothing newer is blocked)`);
}

const lts = await latestNodeLts();
if (lts === undefined) notes.push("node   could not reach nodejs.org to check the LTS version");
else if (pinnedNode() < lts)
  problems.push(`node   .nvmrc is ${pinnedNode()}, newest LTS is ${lts}: run pnpm auto-upgrade`);

for (const line of notes) process.stdout.write(`  ${line}\n`);
if (problems.length) {
  process.stderr.write(`\nFreshness check failed:\n${problems.map((p) => `  ✗ ${p}`).join("\n")}\n`);
  process.exit(1);
}
process.stdout.write("\nFreshness check passed.\n");
