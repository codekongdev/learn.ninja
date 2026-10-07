// Prepares the example lessons for Storybook (KaTeX formulas, Shiki highlighting), the same way the
// web app does on the server, and writes src/stories/prepared.generated.json.
// Run: npm run stories:prepare -w @workspace/player
import { readdirSync, readFileSync, writeFileSync } from "node:fs"

import { validateLesson } from "@workspace/spec"

import { prepareLesson } from "../src/prepare"
import type { Prepared } from "../src/prepared"

const dir = new URL("../../../examples/", import.meta.url)
const merged: Prepared = { math: {}, code: {} }

for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const result = validateLesson(readFileSync(new URL(file, dir), "utf8"))
  if (!result.ok) throw new Error(`${file} is invalid`)
  const prepared = await prepareLesson(result.lesson)
  Object.assign(merged.math, prepared.math)
  Object.assign(merged.code, prepared.code)
}

const out = new URL("../src/stories/prepared.generated.json", import.meta.url)
writeFileSync(out, JSON.stringify(merged))
console.log(
  `Prepared ${Object.keys(merged.math).length} formulas and ${Object.keys(merged.code).length} code blocks`
)
