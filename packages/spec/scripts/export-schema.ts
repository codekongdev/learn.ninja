// Writes the lesson JSON Schema to schema/lesson.schema.json. Run: npm run schema -w @workspace/spec
import { writeFileSync } from "node:fs"

import { lessonJsonSchema } from "../src/json-schema"

const out = new URL("../schema/lesson.schema.json", import.meta.url)
writeFileSync(out, JSON.stringify(lessonJsonSchema(), null, 2) + "\n")
console.log(`Wrote ${out.pathname}`)
