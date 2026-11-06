/**
 * One-time GitHub settings so updates merge themselves (needs the gh CLI, logged in):
 *   pnpm github-setup
 *
 * - Allow auto-merge, delete merged branches
 * - Let GitHub Actions open pull requests (maintenance branches, see
 *   .github/workflows/maintain-pr.yml)
 * - Ruleset on the default branch: the CI "check" job must pass; no deletion
 *   or force-push. Repository admins (you) can still push directly.
 * Safe to run again: the ruleset is only created when missing.
 */
import { execFileSync } from "node:child_process";

const RULESET = "main: CI must pass";

const gh = (args: string[], input?: string) =>
  execFileSync("gh", args, { encoding: "utf8", input, stdio: ["pipe", "pipe", "inherit"] });

const repo = gh(["repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner"]).trim();
process.stdout.write(`Configuring ${repo}\n`);

gh([
  "api",
  "-X",
  "PATCH",
  `repos/${repo}`,
  "-F",
  "allow_auto_merge=true",
  "-F",
  "delete_branch_on_merge=true",
]);
gh([
  "api",
  "-X",
  "PUT",
  `repos/${repo}/actions/permissions/workflow`,
  "-f",
  "default_workflow_permissions=read",
  "-F",
  "can_approve_pull_request_reviews=true",
]);

const existing: string[] = JSON.parse(gh(["api", `repos/${repo}/rulesets`, "-q", "[.[].name]"]));
if (existing.includes(RULESET)) {
  process.stdout.write(`Ruleset "${RULESET}" already exists\n`);
} else {
  const ruleset = {
    name: RULESET,
    target: "branch",
    enforcement: "active",
    conditions: { ref_name: { include: ["~DEFAULT_BRANCH"], exclude: [] } },
    bypass_actors: [{ actor_id: 5, actor_type: "RepositoryRole", bypass_mode: "always" }],
    rules: [
      { type: "deletion" },
      { type: "non_fast_forward" },
      {
        type: "required_status_checks",
        parameters: {
          strict_required_status_checks_policy: false,
          required_status_checks: [{ context: "check" }],
        },
      },
    ],
  };
  gh(["api", "-X", "POST", `repos/${repo}/rulesets`, "--input", "-"], JSON.stringify(ruleset));
  process.stdout.write(`Created ruleset "${RULESET}"\n`);
}
process.stdout.write("Done: auto-merge on, Actions may open PRs, CI required on the default branch.\n");
