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
      for (const level of ["off", "default", "sensei", "unhinged"] as const)
        for (const moment of MOMENTS) {
          const lines = voiceLines(code, level, moment)
          const english = voiceLines("en", level, moment)
          const at = `${code} ${level} ${moment}`
          expect(lines.length, at).toBe(english.length)
          expect(new Set(lines).size, `${at} has no repeats`).toBe(lines.length)
          for (const line of lines) expect(line, at).toMatch(/\S/)
        }
  })

  it("ends every English line in a period, exclamation point, or question mark", () => {
    // The other languages follow when their lines are written (each with its own marks).
    for (const level of ["default", "sensei", "unhinged"] as const)
      for (const moment of MOMENTS)
        for (const line of voiceLines("en", level, moment))
          expect(line, `en ${level} ${moment}`).toMatch(/[.!?]$/)
  })

  it("stands in with English for a language that has no Sensei yet", () => {
    expect(voiceLines("es", "sensei", "praise")).toEqual(
      voiceLines("en", "sensei", "praise")
    )
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
    for (let i = 1; i < seen.length; i++) expect(seen[i]).not.toBe(seen[i - 1])
  })

  it("gives one lesson different lines across its screens, however the picker is asked", () => {
    // The player keeps one picker per run; a picker per screen would start every bag the same way.
    const lines = voiceLines("en", "unhinged", "praise")
    const pick = createLinePicker("Compound interest:0")
    const heard = [1, 3, 5, 6].map((screen) =>
      pick(`${screen}-0-feedback-praise-unhinged`, lines)
    )
    expect(new Set(heard).size).toBe(heard.length)
  })

  it("starts a replay somewhere else", () => {
    const lines = voiceLines("en", "default", "praise")
    const openers = [0, 1, 2].map((run) =>
      createLinePicker(`Compound interest:${run}`)("1-0-feedback-praise", lines)
    )
    expect(new Set(openers).size).toBeGreaterThan(1)
  })

  it("keeps the same line for the same feedback", () => {
    const pick = createLinePicker("lesson")
    const first = pick("q1", ["a", "b", "c"])
    expect(pick("q1", ["a", "b", "c"])).toBe(first)
  })
})
