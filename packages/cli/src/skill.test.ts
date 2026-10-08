import { spawnSync } from "node:child_process"
import { readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

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

// Topic packs are open to contributions, so these checks keep a pack from breaking the skill or bloating it.
const MAX_PACK_WORDS = 1200
const packs = readdirSync(new URL("skills/learn/topics", root), {
  withFileTypes: true,
})
  .filter((e) => e.isDirectory())
  .map((e) => e.name)

describe.each(packs)("topic pack %s", (name) => {
  const guide = read(`skills/learn/topics/${name}/guide.md`)
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

  it(`stays under ${MAX_PACK_WORDS} words`, () => {
    expect(guide.split(/\s+/).length).toBeLessThanOrEqual(MAX_PACK_WORDS)
  })

  it("is listed in topics/index.md", () => {
    const index = read("skills/learn/topics/index.md")
    expect(index).toContain(`| \`${name}\` | ${field("description")} |`)
  })

  it("has a docs page", () => {
    expect(read(`docs/skills/${name}.mdx`)).toContain(
      `<include>../../skills/learn/topics/${name}/guide.md</include>`
    )
  })
})

it("topics/index.md lists only packs that exist", () => {
  const listed = [
    ...read("skills/learn/topics/index.md").matchAll(
      /`topics\/([^/]+)\/guide\.md`/g
    ),
  ].map((m) => m[1])
  expect(listed.sort()).toEqual([...packs].sort())
})
