import { spawnSync } from "node:child_process"
import { createHash } from "node:crypto"
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

// Subjects are open to contributions, so these checks keep one from breaking the skill or bloating it.
const MAX_SUBJECT_WORDS = 1200
const subjects = readdirSync(new URL("skills/learn/subjects", root), {
  withFileTypes: true,
})
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
const versions: Record<string, { version: string; hash: string }> = JSON.parse(
  read("skills/learn/subjects/versions.json")
)

describe.each(subjects)("subject %s", (name) => {
  const guide = read(`skills/learn/subjects/${name}/guide.md`)
  const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(guide)?.[1] ?? ""
  const field = (key: string) =>
    new RegExp(`^${key}: *(.*)$`, "m").exec(frontmatter)?.[1]?.trim() ?? ""

  it("has a name matching its folder, and a description", () => {
    expect(field("name")).toBe(name)
    expect(field("description")).not.toBe("")
    // The header is YAML (the docs parse it), so a ": " in a value breaks it.
    expect(frontmatter, 'use no ": " inside a value').not.toMatch(/^\w+: .*: /m)
  })

  it("names example lessons that exist", () => {
    for (const x of field("examples")
      .split(",")
      .filter((x) => x.trim()))
      expect(
        readdirSync(new URL("skills/learn/examples", root)),
        `${name}: no example lesson ${x.trim()}`
      ).toContain(`${x.trim()}.json`)
  })

  it(`stays under ${MAX_SUBJECT_WORDS} words`, () => {
    expect(guide.split(/\s+/).length).toBeLessThanOrEqual(MAX_SUBJECT_WORDS)
  })

  it("is listed in subjects/index.md", () => {
    const index = read("skills/learn/subjects/index.md")
    expect(index).toContain(
      `| \`${name}\` | ${field("description")} | \`subjects/${name}/guide.md\` | ${field("version")} |`
    )
  })

  // Each subject is versioned on its own, so improvements to a guide can be tracked.
  it("has a semver version and a changelog entry for it", () => {
    expect(field("version")).toMatch(/^\d+\.\d+\.\d+$/)
    expect(read(`skills/learn/subjects/${name}/CHANGELOG.md`)).toContain(
      `## ${field("version")}`
    )
  })

  it("bumped its version since the last build, if it changed", () => {
    const recorded = versions[name]
    if (!recorded) throw new Error(`${name}: run skill:build`)
    const hash = createHash("sha256").update(guide).digest("hex").slice(0, 16)
    if (recorded.hash !== hash)
      expect(
        recorded.version,
        `${name}/guide.md changed: bump its version, describe the change in its CHANGELOG.md, and run skill:build`
      ).not.toBe(field("version"))
    expect(recorded.version, `${name}: run skill:build`).toBe(field("version"))
    expect(recorded.hash, `${name}: run skill:build`).toBe(hash)
  })

  it("is listed on the docs' subjects page", () => {
    expect(read("docs/subjects.md")).toContain(`subjects/${name}/guide.md`)
  })
})

it("subjects/index.md lists only subjects that exist", () => {
  const listed = [
    ...read("skills/learn/subjects/index.md").matchAll(
      /`subjects\/([^/]+)\/guide\.md`/g
    ),
  ].map((m) => m[1])
  expect(listed.sort()).toEqual([...subjects].sort())
})

it("subjects/versions.json records only subjects that exist", () => {
  expect(Object.keys(versions).sort()).toEqual([...subjects].sort())
})

// Levels are core, not contributed: one short file per level, read only when it applies.
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

// Modes set a lesson's mix of teaching and questions: one short file per mode, like levels.
const MODES = ["explain", "balanced", "practice"]
const MAX_MODE_WORDS = 400

it("modes/ has index.md and exactly one file per mode", () => {
  expect(readdirSync(new URL("skills/learn/modes", root)).sort()).toEqual(
    [...MODES.map((m) => `${m}.md`), "index.md"].sort()
  )
})

it("SKILL.md points at modes/index.md and reference/planning.md", () => {
  const skill = read("skills/learn/SKILL.md")
  expect(skill).toContain("`modes/index.md`")
  expect(skill).toContain("`reference/planning.md`")
})

describe.each(MODES)("mode %s", (name) => {
  const guide = read(`skills/learn/modes/${name}.md`)

  it(`stays under ${MAX_MODE_WORDS} words`, () => {
    expect(guide.split(/\s+/).length).toBeLessThanOrEqual(MAX_MODE_WORDS)
  })

  it("ends with a drift check", () => {
    expect(guide).toContain("## You've drifted if")
  })

  it("is listed in modes/index.md", () => {
    expect(read("skills/learn/modes/index.md")).toContain(
      `\`modes/${name}.md\``
    )
  })
})
