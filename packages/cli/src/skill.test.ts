import { spawnSync } from "node:child_process"
import { readdirSync, readFileSync } from "node:fs"

import { describe, expect, it } from "vitest"

import { SKILL_VERSION } from "./cli"

// skills/learn is what people install. These tests fail when it's stale: run `npm run skill:build -w @workspace/cli`.

const root = new URL("../../../", import.meta.url)
const read = (p: string) => readFileSync(new URL(p, root), "utf8")
const script = new URL("skills/learn/scripts/learn.mjs", root).pathname

describe("skills/learn", () => {
  it("has the current JSON Schema", () => {
    expect(read("skills/learn/schema/lesson.schema.json")).toBe(
      read("packages/spec/schema/lesson.schema.json")
    )
  })

  it("has every example lesson, unchanged", () => {
    const examples = readdirSync(new URL("examples", root))
      .filter((f) => f.endsWith(".json"))
      .sort()
    expect(readdirSync(new URL("skills/learn/examples", root)).sort()).toEqual(
      examples
    )
    for (const f of examples)
      expect(read(`skills/learn/examples/${f}`)).toBe(read(`examples/${f}`))
  })

  it("bundles the current CLI version", () => {
    const result = spawnSync(process.execPath, [script, "--version"], {
      encoding: "utf8",
    })
    expect(result.stdout.trim()).toBe(SKILL_VERSION)
  })

  it.each(readdirSync(new URL("skills/learn/examples", root)))(
    "bundled script validates %s",
    (file) => {
      const result = spawnSync(
        process.execPath,
        [
          script,
          "validate",
          new URL(`skills/learn/examples/${file}`, root).pathname,
        ],
        { encoding: "utf8" }
      )
      expect(result.status, result.stderr).toBe(0)
    }
  )

  it("names the skill in SKILL.md", () => {
    expect(read("skills/learn/SKILL.md")).toMatch(
      /^---\nname: learn\ndescription: .+\n---/
    )
  })
})
