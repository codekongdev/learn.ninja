import { describe, expect, it } from "vitest"

import { applyPatches, parsePath, PatchError } from "./drafts"

describe("parsePath", () => {
  it("reads the checker's path syntax", () => {
    expect(parsePath("katas[2].options[0].feedback")).toEqual([
      "katas",
      2,
      "options",
      0,
      "feedback",
    ])
    expect(parsePath("title")).toEqual(["title"])
    expect(parsePath("grid[1][0]")).toEqual(["grid", 1, 0])
    expect(parsePath("[0].id")).toEqual([0, "id"])
  })

  it("refuses malformed and prototype paths", () => {
    for (const bad of [
      "",
      "a..b",
      "a]b",
      "a[x]",
      "a[1]b",
      "a.[1]",
      "a.",
      ".a",
      "a[1",
      "__proto__.x",
      "a.constructor",
    ])
      expect(() => parsePath(bad), bad).toThrow(PatchError)
  })
})

describe("applyPatches", () => {
  const lesson = { title: "A", katas: [{ id: 1 }, { id: 2 }] }

  it("sets, inserts, and removes without touching the original", () => {
    const out = applyPatches(lesson, [
      { op: "set", path: "title", value: "B" },
      { op: "set", path: "katas[0].body", value: "hi" },
      { op: "insert", path: "katas[1]", value: { id: 9 } },
      { op: "remove", path: "katas[2]" },
      { op: "set", path: "katas[2]", value: { id: 3 } },
    ])
    expect(out).toEqual({
      title: "B",
      katas: [{ id: 1, body: "hi" }, { id: 9 }, { id: 3 }],
    })
    expect(lesson).toEqual({ title: "A", katas: [{ id: 1 }, { id: 2 }] })
  })

  it("names the patch that doesn't fit", () => {
    expect(() =>
      applyPatches(lesson, [
        { op: "set", path: "title", value: "B" },
        { op: "remove", path: "katas[5]" },
      ])
    ).toThrow(/Patch 2 \(katas\[5\]\)/)
    expect(() =>
      applyPatches(lesson, [{ op: "set", path: "missing.x", value: 1 }])
    ).toThrow(PatchError)
    expect(() =>
      applyPatches(lesson, [{ op: "insert", path: "title", value: 1 }])
    ).toThrow(/arrays/)
  })
})
