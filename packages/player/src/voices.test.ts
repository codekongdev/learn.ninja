import { describe, expect, it } from "vitest"

import { UI_LANGUAGES } from "./strings"
import { createLinePicker, voiceLines } from "./voices"

const MOMENTS = [
  "praise",
  "correctWithHint",
  "goodGuess",
  "hookMiss",
  "nudge",
  "close",
  "answer",
] as const

describe("voices", () => {
  it("has every line for every character in every language, as many as English", () => {
    for (const { code } of UI_LANGUAGES)
      for (const level of ["off", "normal", "caffeinated", "unhinged"] as const)
        for (const moment of MOMENTS) {
          const lines = voiceLines(code, level, moment)
          const english = voiceLines("en", level, moment)
          const at = `${code} ${level} ${moment}`
          expect(lines.length, at).toBe(english.length)
          expect(new Set(lines).size, `${at} has no repeats`).toBe(lines.length)
          for (const line of lines) expect(line, at).toMatch(/\S/)
        }
  })

  it("uses English for a language the player doesn't have", () => {
    expect(voiceLines("xx", "unhinged", "answer")).toEqual(
      voiceLines("en", "unhinged", "answer")
    )
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
