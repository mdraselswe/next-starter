/**
 * Upgrades everything it safely can, with no AI and no person:
 *   pnpm auto-upgrade
 *
 * 1. Node.js: moves .nvmrc and @types/node to the newest LTS major.
 * 2. Minor/patch: all at once (one by one if the batch fails).
 * 3. Majors, one at a time, including held ones:
 *    passes the checks → kept (a hold that is no longer needed is removed);
 *    fails → rolled back and held in version-holds.json + Dependabot ignore,
 *    and tried again on the next run.
 * "Checks" = typecheck, lint, unit tests, and a build in both render modes.
 * Writes auto-upgrade-report.md (used by .github/workflows/auto-upgrade.yml).
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import {
  type Hold,
  latestNodeLts,
  major,
  outdated,
  pinnedNode,
  readHolds,
  writeHolds,
} from "./lib/versions.ts";

type Result = "ok" | "failed" | "install-failed";

const FILES = ["package.json", "pnpm-lock.yaml", ".nvmrc", "version-holds.json", ".github/dependabot.yml"];
const today = new Date().toISOString().slice(0, 10);
const upgraded: string[] = [];
const newlyHeld: string[] = [];
const unheld: string[] = [];
const skipped: string[] = [];

const log = (line: string) => process.stdout.write(`\n▶ ${line}\n`);
const run = (cmd: string, env: Record<string, string> = {}) => {
  try {
    execSync(cmd, { stdio: "inherit", env: { ...process.env, ...env } });
    return true;
  } catch {
    return false;
  }
};

const snapshot = () => new Map(FILES.filter((f) => existsSync(f)).map((f) => [f, readFileSync(f, "utf8")]));
const restore = (saved: Map<string, string>) => {
  for (const [file, text] of saved) writeFileSync(file, text);
  run("pnpm install");
};

const verify = () =>
  run("pnpm typecheck") &&
  run("pnpm lint") &&
  run("pnpm test") &&
  run("pnpm build", { RENDER_MODE: "static" }) &&
  run("pnpm build", { RENDER_MODE: "server" });

/** Sets exact versions in package.json and installs. Returns false if the install fails. */
function setVersions(versions: Record<string, string>) {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  for (const [name, version] of Object.entries(versions)) {
    for (const section of ["dependencies", "devDependencies", "optionalDependencies"]) {
      if (pkg[section]?.[name]) pkg[section][name] = version;
    }
  }
  writeFileSync("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
  return run("pnpm install");
}

/** Tries a change; keeps it if install + checks pass, otherwise rolls it back. */
function attempt(label: string, change: () => boolean): Result {
  log(`Trying ${label}`);
  const saved = snapshot();
  if (!change()) {
    restore(saved);
    return "install-failed";
  }
  if (verify()) return "ok";
  restore(saved);
  return "failed";
}

/** Newest published version matching a spec like "@types/node@26". */
function newestIn(spec: string): string | undefined {
  try {
    const out = JSON.parse(execSync(`pnpm view "${spec}" version --json`, { encoding: "utf8" }));
    return Array.isArray(out) ? out.at(-1) : out;
  } catch {
    return undefined;
  }
}

// 1. Node.js LTS
const lts = await latestNodeLts();
if (lts !== undefined && pinnedNode() < lts) {
  const types = newestIn(`@types/node@${lts}`);
  const result = attempt(`Node ${lts} LTS`, () => {
    writeFileSync(".nvmrc", `${lts}\n`);
    return types ? setVersions({ "@types/node": types }) : true;
  });
  if (result === "ok") upgraded.push(`Node.js LTS → ${lts} (.nvmrc, @types/node ${types})`);
  else skipped.push(`Node.js ${lts}: ${result}`);
}

// 2. Minor/patch (@types/node follows the Node LTS major instead of "latest")
const behind = Object.entries(outdated()).filter(([name]) => name !== "@types/node");
const minor = behind.filter(([, o]) => major(o.latest) === major(o.current));
if (minor.length) {
  const all = Object.fromEntries(minor.map(([n, o]) => [n, o.latest]));
  if (attempt(`${minor.length} minor/patch updates`, () => setVersions(all)) === "ok") {
    upgraded.push(...minor.map(([n, o]) => `${n} ${o.current} → ${o.latest}`));
  } else {
    for (const [name, o] of minor) {
      const result = attempt(`${name} ${o.latest}`, () => setVersions({ [name]: o.latest }));
      if (result === "ok") upgraded.push(`${name} ${o.current} → ${o.latest}`);
      else skipped.push(`${name} ${o.latest}: ${result}`);
    }
  }
}

// 3. Majors, one at a time (held ones too, so holds that are no longer needed go away)
let holds: Hold[] = readHolds();
for (const [name, o] of behind.filter(([, o]) => major(o.latest) > major(o.current))) {
  const hold = holds.find((h) => h.package === name);
  const result = attempt(`${name} ${o.current} → ${o.latest} (major)`, () =>
    setVersions({ [name]: o.latest }),
  );
  if (result === "ok") {
    upgraded.push(`${name} ${o.current} → ${o.latest} (major)`);
    if (hold) {
      holds = holds.filter((h) => h !== hold);
      unheld.push(`${name} (was: ${hold.reason})`);
    }
  } else if (result === "failed" && !hold) {
    holds.push({
      package: name,
      below: major(o.latest),
      reason: `auto-upgrade: ${name} ${o.latest} failed the checks (tried again weekly)`,
      since: today,
    });
    newlyHeld.push(`${name} ${o.latest}`);
  } else if (result === "install-failed") {
    skipped.push(`${name} ${o.latest}: install failed (maybe newer than minimumReleaseAge)`);
  }
}
writeHolds(holds);
run("pnpm exec prettier --write package.json version-holds.json .github/dependabot.yml");

// Report
const section = (title: string, lines: string[]) =>
  lines.length ? `### ${title}\n\n${lines.map((l) => `- ${l}`).join("\n")}\n\n` : "";
const text =
  section("Upgraded", upgraded) +
  section("Newly held (broke the checks, tried again weekly)", newlyHeld) +
  section("Hold removed (works now)", unheld) +
  section("Skipped", skipped) +
  section(
    "Still held",
    holds.map((h) => `${h.package} < ${h.below}: ${h.reason}`),
  );
const summary = text || "Everything is up to date.\n";
writeFileSync("auto-upgrade-report.md", summary);
process.stdout.write(`\n${summary}`);
