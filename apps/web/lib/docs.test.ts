import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

import { getLesson } from "./lessons"
import { contentTypeFor, skillFiles, skillIndex } from "./skill-files"

// Checks on the docs/ folder and the served skill, so a docs edit can't ship a broken demo or page.

const DOCS = path.join(process.cwd(), "../../docs")

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
  )
}

const files = walk(DOCS)
const pages = files.filter((f) => /\.mdx?$/.test(f))

describe("docs", () => {
  it.each(pages.map((f) => [path.relative(DOCS, f), f]))(
    "%s has a title and description",
    (_, file) => {
      const text = readFileSync(file, "utf8")
      expect(text).toMatch(/^---\ntitle: .+\ndescription: .+\n/)
    }
  )

  it("every <BrickPreview> points to a real example lesson and brick", () => {
    const previews = pages.flatMap((file) =>
      [
        ...readFileSync(file, "utf8").matchAll(
          /<BrickPreview\s+lesson="([^"]+)"\s+brick="([^"]+)"/g
        ),
      ].map((m) => ({
        file: path.relative(DOCS, file),
        lesson: m[1]!,
        brick: m[2]!,
      }))
    )
    // The docs have no demos right now; this still guards any that come back.
    for (const p of previews) {
      const lesson = getLesson(p.lesson)
      expect(lesson, `${p.file}: no example lesson "${p.lesson}"`).toBeTruthy()
      const ids = [lesson!.hook, ...lesson!.bricks, lesson!.challenge].map(
        (b) => b.id
      )
      expect(
        ids,
        `${p.file}: no brick "${p.brick}" in "${p.lesson}"`
      ).toContain(p.brick)
    }
  })

  it("every page listed in a meta.json exists", () => {
    for (const meta of files.filter((f) => f.endsWith("meta.json"))) {
      const dir = path.dirname(meta)
      const { pages: listed } = JSON.parse(readFileSync(meta, "utf8")) as {
        pages: string[]
      }
      for (const entry of listed) {
        if (entry === "..." || entry.startsWith("---")) continue
        const name = entry.replace(/^\.\.\./, "")
        const exists =
          files.includes(path.join(dir, `${name}.md`)) ||
          files.includes(path.join(dir, `${name}.mdx`)) ||
          files.some((f) => f.startsWith(path.join(dir, name) + path.sep))
        expect(exists, `${path.relative(DOCS, meta)} lists "${entry}"`).toBe(
          true
        )
      }
    }
  })
})

describe("served skill", () => {
  it("lists every file in skills/learn, with SKILL.md's description", () => {
    const index = skillIndex()
    expect(index.skills).toHaveLength(1)
    const [skill] = index.skills
    expect(skill!.name).toBe("learn")
    expect(skill!.description.length).toBeGreaterThan(20)
    expect(skill!.files).toEqual(skillFiles())
    expect(skill!.files).toContain("SKILL.md")
    expect(skill!.files).toContain("scripts/learn.mjs")
  })

  it("serves files with sensible types", () => {
    expect(contentTypeFor("SKILL.md")).toMatch(/^text\/markdown/)
    expect(contentTypeFor("scripts/learn.mjs")).toMatch(/^text\/javascript/)
    expect(contentTypeFor("schema/lesson.schema.json")).toMatch(
      /^application\/json/
    )
  })
})
