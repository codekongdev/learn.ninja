import { spawnSync } from "node:child_process"
import { readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import { LEVELS } from "@workspace/spec"

import { SKILL_VERSION } from "./cli"

// skills/learn is what people install. These tests fail when it's stale: run `npm run skill:build -w @workspace/cli`.

const root = new URL("../../../", import.meta.url)
const read = (p: string) => readFileSync(new URL(p, root), "utf8")
const script = fileURLToPath(new URL("skills/learn/scripts/learn.mjs", root))

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
          fileURLToPath(new URL(`skills/learn/examples/${file}`, root)),
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

// Levels: one short file per level, read only when it applies.
const MAX_LEVEL_WORDS = 400

it("levels/ has index.md and exactly one file per level", () => {
  expect(readdirSync(new URL("skills/learn/levels", root)).sort()).toEqual(
    [...LEVELS.map((l) => `${l}.md`), "index.md"].sort()
  )
})

it("SKILL.md points at levels/index.md", () => {
  expect(read("skills/learn/SKILL.md")).toContain("`levels/index.md`")
})

describe.each(LEVELS)("level %s", (name) => {
  const guide = read(`skills/learn/levels/${name}.md`)

  it(`stays under ${MAX_LEVEL_WORDS} words`, () => {
    expect(guide.split(/\s+/).length).toBeLessThanOrEqual(MAX_LEVEL_WORDS)
  })

  it("ends with a drift check", () => {
    expect(guide).toContain("## You've drifted if")
  })

  it("names example lessons that exist", () => {
    const examples = readdirSync(new URL("skills/learn/examples", root))
    for (const [, slug] of guide.matchAll(/`examples\/([^`]+)\.json`/g))
      expect(examples, `${name}: no example lesson ${slug}`).toContain(
        `${slug}.json`
      )
  })

  it("is listed in levels/index.md, the format reference, and the docs", () => {
    expect(read("skills/learn/levels/index.md")).toContain(
      `\`levels/${name}.md\``
    )
    expect(
      read("skills/learn/reference/lesson-format.md").match(
        /^\| `level`.*$/m
      )?.[0]
    ).toContain(`\`${name}\``)
    expect(read("docs/lessons/levels.md")).toContain(`\`${name}\``)
  })
})

it("SKILL.md points at reference/planning.md", () => {
  expect(read("skills/learn/SKILL.md")).toContain("`reference/planning.md`")
})
