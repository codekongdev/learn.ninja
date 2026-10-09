import { describe, expect, it } from "vitest"

import { en } from "./locales/en"
import { stringsFor } from "./strings"
import { createLinePicker, voiceLines } from "./voices"

describe("voices", () => {
  it("has every line for every character in English", () => {
    for (const level of ["off", "normal", "caffeinated", "unhinged"] as const)
      for (const moment of [
        "praise",
        "correctWithHint",
        "goodGuess",
        "hookMiss",
        "nudge",
        "close",
        "answer",
      ] as const) {
        const lines = voiceLines("en", level, moment, en)
        expect(lines.length, `${level} ${moment}`).toBeGreaterThan(1)
        for (const line of lines) expect(line).toMatch(/\S/)
      }
  })

  it("falls back to a language's own lines until its voices are translated", () => {
    const t = stringsFor("de")
    expect(voiceLines("de", "unhinged", "answer", t)).toEqual([t.answer])
    expect(voiceLines("de", "normal", "praise", t)).toEqual(t.praise)
  })

  it("plays every line once before repeating, and never twice in a row", () => {
    const lines = ["a", "b", "c", "d"]
    const pick = createLinePicker("lesson")
    const seen = Array.from({ length: 12 }, (_, i) => pick(`k${i}`, lines))
    for (let round = 0; round < 3; round++)
      expect(new Set(seen.slice(round * 4, round * 4 + 4)).size).toBe(4)
    for (let i = 1; i < seen.length; i++)
      expect(seen[i]).not.toBe(seen[i - 1])
  })

  it("keeps the same line for the same feedback", () => {
    const pick = createLinePicker("lesson")
    const first = pick("q1", ["a", "b", "c"])
    expect(pick("q1", ["a", "b", "c"])).toBe(first)
  })
})
