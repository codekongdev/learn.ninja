import { describe, expect, it } from "vitest"

import { briefBeats, streamSchedule, streamUnits } from "./briefing"

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

describe("streamUnits", () => {
  it("streams a word at a time, spaces riding on the word before", () => {
    expect(streamUnits("The bank doesn't say why.")).toEqual([
      "The ",
      "bank ",
      "doesn't ",
      "say ",
      "why.",
    ])
  })

  it("keeps bold on each word, and code and formulas whole", () => {
    expect(
      streamUnits("Tap **Save changes** or run `npm run dev` now.")
    ).toEqual([
      "Tap ",
      "**Save** ",
      "**changes** ",
      "or ",
      "run ",
      "`npm run dev` ",
      "now.",
    ])
    expect(streamUnits("So \\( a + b \\) grows.")).toEqual([
      "So ",
      "\\( a + b \\) ",
      "grows.",
    ])
  })
})

describe("streamSchedule", () => {
  it("steps word by word, with a breath between sentences", () => {
    const { delays, end } = streamSchedule([["A ", "b."], ["C."]])
    expect(delays[0]![1]! - delays[0]![0]!).toBe(44)
    expect(delays[1]![0]! - delays[0]![1]!).toBe(44 + 418)
    expect(end).toBe(delays[1]![0]! + 495)
  })
})
