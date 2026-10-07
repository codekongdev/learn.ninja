import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { run } from "./cli"

// Entry point. In the skill bundle this file sits at scripts/learn.mjs, next to ../schema/.
const here = dirname(fileURLToPath(import.meta.url))

const code = await run(process.argv.slice(2), {
  cwd: process.cwd(),
  env: process.env,
  fetch,
  out: (line) => console.log(line),
  err: (line) => console.error(line),
  schemaPath: join(here, "..", "schema", "lesson.schema.json"),
})
process.exit(code)
