import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Read environment variables only through src/config/env.ts (validated, listed in .env.example).
      "no-restricted-properties": [
        "error",
        { object: "process", property: "env", message: "Use src/config/env.ts (or @/config)." },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // Features expose a public API through their index file.
              group: ["@/features/*/*"],
              message: "Import from the feature's index (e.g. '@/features/pwa').",
            },
          ],
        },
      ],
    },
  },
  {
    // Inside a feature, relative imports between its own files are expected.
    files: ["src/features/**"],
    rules: { "no-restricted-imports": "off" },
  },
  {
    // The only places allowed to read process.env.
    files: ["src/config/env.ts", "scripts/**", "playwright.config.ts"],
    rules: { "no-restricted-properties": "off" },
  },
  {
    files: ["scripts/**"],
    rules: { "no-console": "off" },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "public/**",
    "next-env.d.ts",
  ]),
]);
