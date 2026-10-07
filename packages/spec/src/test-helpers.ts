import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

export const EXAMPLES_DIR = fileURLToPath(
  new URL("../../../examples", import.meta.url)
)

export function exampleFiles(): string[] {
  return readdirSync(EXAMPLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
}

export function readExample(file: string): string {
  return readFileSync(join(EXAMPLES_DIR, file), "utf8")
}

/** A deep copy of an example lesson as plain data, for tests that break it on purpose. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadExample(file: string): any {
  return JSON.parse(readExample(file))
}
