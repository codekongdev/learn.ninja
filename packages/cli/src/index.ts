import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { run } from "./cli"

// Entry point. In the skill bundle this file sits at scripts/learn.mjs, inside the installed skill's folder.
const here = dirname(fileURLToPath(import.meta.url))

const code = await run(process.argv.slice(2), {
  cwd: process.cwd(),
  env: process.env,
  fetch,
  out: (line) => console.log(line),
  err: (line) => console.error(line),
  skillDir: join(here, ".."),
})
process.exit(code)
