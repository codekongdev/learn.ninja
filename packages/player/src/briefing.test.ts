import { describe, expect, it } from "vitest"

import { briefBeats, readingMs } from "./briefing"

// How the ninja splits a scenario's situation into the beats he tells it in.

describe("briefBeats", () => {
  it("ends a beat at each sentence", () => {
    expect(
      briefBeats("A VP asks for a feature. The review is in two days.")
    ).toEqual(["A VP asks for a feature.", "The review is in two days."])
  })

  it("ends a beat at a colon that introduces a list", () => {
    expect(
      briefBeats(
        "A settings page has three actions: **Save changes**, **Reset to defaults**, and **Delete account**."
      )
    ).toEqual([
      "A settings page has three actions:",
      "**Save changes**, **Reset to defaults**, and **Delete account**.",
    ])
  })

  it("never breaks inside bold or code", () => {
    expect(briefBeats("Run **this: now** please.")).toEqual([
      "Run **this: now** please.",
    ])
    expect(briefBeats("Call `a: b` first. Then wait.")).toEqual([
      "Call `a: b` first.",
      "Then wait.",
    ])
  })

  it("keeps a one-sentence situation whole", () => {
    expect(briefBeats("A teammate wrote this.")).toEqual([
      "A teammate wrote this.",
    ])
  })
})

describe("readingMs", () => {
  it("gives longer beats more time, within bounds", () => {
    expect(readingMs("Short.")).toBe(700)
    expect(readingMs("one two three four five six seven eight nine ten")).toBe(
      1700
    )
    expect(readingMs("word ".repeat(40))).toBe(2600)
  })
})
