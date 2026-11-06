import { z } from "zod";
import { RENDER_MODES } from "./schema.ts";

/**
 * The only place that reads process.env (ESLint enforces this).
 * Every variable is listed in .env.example. Add server-only secrets to
 * `serverSchema` and import `serverEnv` only from server code.
 *
 * NEXT_PUBLIC_* values are inlined into the browser bundle at build time, so
 * they must be read with a literal `process.env.NEXT_PUBLIC_X`.
 */
const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
});

const buildSchema = z.object({
  RENDER_MODE: z.enum(RENDER_MODES).optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const serverSchema = z.object({
  // EXAMPLE_API_KEY: z.string().min(1),
});

export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
});

export const buildEnv = buildSchema.parse({
  RENDER_MODE: process.env.RENDER_MODE || undefined,
  NODE_ENV: process.env.NODE_ENV,
});

/** Server-only values. Never import this from a client component. */
export const serverEnv = () => serverSchema.parse(process.env);
