/** `pnpm start`: serves the production build in the current render mode (after `pnpm build`). */
import { spawn } from "node:child_process";
import { site } from "../src/config/index.ts";

const port = process.env.PORT ?? "3000";
const command = site.render === "static" ? `serve out -l ${port} --no-clipboard` : `next start -p ${port}`;

// One command string (resolved from node_modules/.bin by the shell); no user input is interpolated.
spawn(command, { stdio: "inherit", shell: true }).on("exit", (code) => process.exit(code ?? 0));
