import { describe, expect, it } from "vitest"

import { UI_LANGUAGES } from "./strings"
import {
  CADENCE,
  createLinePicker,
  voiceLines,
  type Lines,
  type Moment,
} from "./voices"

const MOMENTS: Moment[] = [
  "praise",
  "correctWithHint",
  "goodGuess",
  "hookMiss",
  "nudge",
  "close",
  "answer",
  "streak",
  "comeback",
  "last",
  "perfect",
]
const CHARACTERS = ["sensei", "casual", "unhinged"] as const

describe("voices", () => {
  it("has plain and flavor English lines for every character and moment, with no repeats", () => {
    for (const level of CHARACTERS)
      for (const moment of MOMENTS) {
        const { plain, flavor } = voiceLines("en", level, moment)
        const at = `en ${level} ${moment}`
        expect(plain.length, `${at} plain`).toBeGreaterThan(0)
        expect(flavor.length, `${at} flavor`).toBeGreaterThan(0)
        const all = [...plain, ...flavor]
        expect(new Set(all).size, `${at} has no repeats`).toBe(all.length)
      }
  })

  it("has every character and moment in every language, as many lines as English", () => {
    for (const { code } of UI_LANGUAGES)
      for (const level of ["off", ...CHARACTERS] as const)
        for (const moment of MOMENTS) {
          const { plain, flavor } = voiceLines(code, level, moment)
          const english = voiceLines("en", level, moment)
          const at = `${code} ${level} ${moment}`
          expect(plain.length, `${at} plain`).toBe(english.plain.length)
          expect(flavor.length, `${at} flavor`).toBe(english.flavor.length)
          const all = [...plain, ...flavor]
          expect(new Set(all).size, `${at} has no repeats`).toBe(all.length)
          for (const line of all) expect(line, at).toMatch(/\S/)
        }
  })

  it("ends every line in a period, exclamation point, or question mark, in the language's own marks", () => {
    for (const { code } of UI_LANGUAGES)
      for (const level of CHARACTERS)
        for (const moment of MOMENTS) {
          const { plain, flavor } = voiceLines(code, level, moment)
          for (const line of [...plain, ...flavor])
            expect(line, `${code} ${level} ${moment}`).toMatch(/[.!?।؟。！？]$/)
        }
  })

  it("uses English for a language the player doesn't have", () => {
    expect(voiceLines("xx", "unhinged", "answer")).toEqual(
      voiceLines("en", "unhinged", "answer")
    )
  })

  const lines: Lines = { plain: ["P1", "P2"], flavor: ["a", "b", "c", "d"] }
  const isPlain = (line: string) => lines.plain.includes(line)

  it("rations flavor by the character's cadence", () => {
    const heard = (cadence: readonly ("plain" | "flavor")[]) => {
      const pick = createLinePicker("lesson")
      return Array.from({ length: 6 }, (_, i) =>
        isPlain(pick(`k${i}`, "praise", lines, cadence)) ? "plain" : "flavor"
      )
    }
    expect(heard(CADENCE.casual)).toEqual([
      "plain",
      "plain",
      "flavor",
      "plain",
      "plain",
      "flavor",
    ])
    expect(heard(CADENCE.sensei)).toEqual([
      "plain",
      "plain",
      "flavor",
      "plain",
      "plain",
      "flavor",
    ])
    expect(heard(CADENCE.unhinged)).toEqual([
      "flavor",
      "flavor",
      "plain",
      "flavor",
      "flavor",
      "plain",
    ])
  })

  it("counts each moment on its own", () => {
    const pick = createLinePicker("lesson")
    pick("a", "praise", lines, CADENCE.casual)
    pick("b", "praise", lines, CADENCE.casual)
    // The first nudge is still the plain one, however many praises came before.
    expect(isPlain(pick("c", "nudge", lines, CADENCE.casual))).toBe(true)
  })

  it("plays every flavor line once before repeating, and never twice in a row", () => {
    const pick = createLinePicker("lesson")
    const seen = Array.from({ length: 12 }, (_, i) =>
      pick(`k${i}`, "praise", lines, ["flavor"])
    )
    for (let round = 0; round < 3; round++)
      expect(new Set(seen.slice(round * 4, round * 4 + 4)).size).toBe(4)
    for (let i = 1; i < seen.length; i++) expect(seen[i]).not.toBe(seen[i - 1])
  })

  it("falls back to the other slot when one is empty", () => {
    const pick = createLinePicker("lesson")
    expect(
      pick("k", "praise", { plain: [], flavor: ["only"] }, ["plain"])
    ).toBe("only")
  })

  it("gives one lesson different lines across its screens, however the picker is asked", () => {
    // The player keeps one picker per run; a picker per screen would start every bag the same way.
    const praise = voiceLines("en", "unhinged", "praise")
    const pick = createLinePicker("Compound interest:0")
    const heard = [1, 3, 5, 6].map((screen) =>
      pick(`${screen}-0-feedback-praise-unhinged`, "praise", praise, ["flavor"])
    )
    expect(new Set(heard).size).toBe(heard.length)
  })

  it("starts a replay somewhere else", () => {
    const praise = voiceLines("en", "casual", "praise")
    const openers = [0, 1, 2].map((run) =>
      createLinePicker(`Compound interest:${run}`)(
        "1-0-feedback-praise",
        "praise",
        praise,
        ["flavor"]
      )
    )
    expect(new Set(openers).size).toBeGreaterThan(1)
  })

  it("keeps the same line for the same feedback", () => {
    const pick = createLinePicker("lesson")
    const first = pick("q1", "praise", lines, CADENCE.casual)
    expect(pick("q1", "praise", lines, CADENCE.casual)).toBe(first)
  })
})
