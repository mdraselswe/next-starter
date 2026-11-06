import { describe, expect, it } from "vitest";
import { major, withIgnoreList } from "./versions.ts";

const yml = `updates:
  - package-ecosystem: npm
    groups:
      minor-and-patch:
        update-types: [minor, patch]
    ignore:
      - dependency-name: typescript
        versions: [">=7"]
  - package-ecosystem: github-actions
`;
const hold = (pkg: string, below: number) => ({ package: pkg, below, reason: "", since: "" });

describe("major", () => {
  it("reads the major from a version or range", () => {
    expect(major("16.4.5")).toBe(16);
    expect(major("^7.0.2")).toBe(7);
  });
});

describe("withIgnoreList", () => {
  it("replaces the ignore entries", () => {
    const out = withIgnoreList(yml, [hold("eslint", 10), hold("next", 17)]);
    expect(out).toContain('- dependency-name: eslint\n        versions: [">=10"]');
    expect(out).toContain('- dependency-name: next\n        versions: [">=17"]');
    expect(out).not.toContain("typescript");
    expect(out).toContain("  - package-ecosystem: github-actions");
  });

  it("removes the block when there are no holds, and adds it back", () => {
    const empty = withIgnoreList(yml, []);
    expect(empty).not.toContain("ignore:");
    const again = withIgnoreList(empty, [hold("typescript", 7)]);
    expect(again).toBe(yml);
  });
});
