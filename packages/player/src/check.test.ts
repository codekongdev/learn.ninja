import { readFileSync } from "node:fs"

import { describe, expect, it } from "vitest"

import { validateLesson, type Lesson, type Step } from "@workspace/spec"

import {
  checkAnswer,
  initialAnswer,
  isReady,
  POOL,
  retryAnswer,
  solution,
  type Answer,
} from "./check"
import { buildSequence, outcomeFor, progressAt, summarize } from "./flow"

function lesson(file: string): Lesson {
  const result = validateLesson(
    readFileSync(new URL(`../../../examples/${file}`, import.meta.url), "utf8")
  )
  if (!result.ok) throw new Error(`${file} is invalid`)
  return result.lesson
}

const buttons = lesson("button-hierarchy.json")
const spanish = lesson("spanish-greetings.json")
const coding = lesson("map-vs-foreach.json")
const prd = lesson("writing-a-prd.json")
const allLessons = [
  buttons,
  spanish,
  coding,
  prd,
  lesson("compound-interest.json"),
]
const allSteps = allLessons.flatMap((l) => [
  l.hook,
  ...l.loops.flatMap((x) => x.practice),
  l.challenge,
])

const p = (l: Lesson, loop: number, i: number) => l.loops[loop]!.practice[i]!

describe("every step in every example", () => {
  it.each(allSteps.map((s) => [s.id + ":" + s.type, s] as [string, Step]))(
    "%s: its solution checks as correct",
    (_, step) => {
      expect(isReady(step, solution(step))).toBe(true)
      expect(checkAnswer(step, solution(step)).correct).toBe(true)
    }
  )

  it.each(allSteps.map((s) => [s.id + ":" + s.type, s] as [string, Step]))(
    "%s: the starting answer isn't already correct",
    (_, step) => {
      const start = initialAnswer(step, () => 0.42)
      expect(isReady(step, start) && checkAnswer(step, start).correct).toBe(
        false
      )
    }
  )
})

describe("choice", () => {
  const step = p(buttons, 0, 0)
  it("uses the option's own feedback for a wrong pick", () => {
    const r = checkAnswer(step, { kind: "select", ids: ["b"] })
    expect(r).toMatchObject({
      correct: false,
      feedback: expect.stringMatching(/pulls people away/),
      marks: { b: "wrong" },
    })
  })
  it("says one is missing when a multi-select is incomplete", () => {
    const r = checkAnswer(p(prd, 0, 1), { kind: "select", ids: ["a"] })
    expect(r).toMatchObject({ correct: false, missKey: "missOne" })
  })
  it("clears the selection on retry", () => {
    expect(retryAnswer(step, { kind: "select", ids: ["b"] })).toEqual({
      kind: "select",
      ids: [],
    })
  })
})

describe("scenario", () => {
  it("treats an okay choice as close, with its outcome as feedback", () => {
    const r = checkAnswer(buttons.challenge, { kind: "select", ids: ["b"] })
    expect(r).toMatchObject({
      correct: false,
      partial: true,
      feedback: expect.stringMatching(/looks just as safe/),
      marks: { b: "partial" },
    })
  })
})

describe("sort", () => {
  const step = p(buttons, 1, 0)
  it("isn't ready until the pool is empty", () => {
    expect(isReady(step, initialAnswer(step))).toBe(false)
  })
  it("counts items in the wrong group", () => {
    const answer: Answer = {
      kind: "zones",
      zones: { [POOL]: [], pri: ["a", "b"], sec: ["c"], ter: ["d", "e"] },
    }
    expect(checkAnswer(step, answer)).toMatchObject({
      correct: false,
      missKey: "sort",
      count: 1,
      marks: { b: "wrong", a: "correct" },
    })
  })
  it("keeps the arrangement on retry", () => {
    const answer: Answer = {
      kind: "zones",
      zones: { [POOL]: [], pri: ["a", "b"], sec: ["c"], ter: ["d", "e"] },
    }
    expect(retryAnswer(step, answer)).toBe(answer)
  })
})

describe("order", () => {
  it("accepts an alternative order", () => {
    const step = { ...p(buttons, 1, 1), alsoAccept: [["b", "a", "c"]] } as Step
    expect(
      checkAnswer(step, { kind: "sequence", ids: ["b", "a", "c"] }).correct
    ).toBe(true)
  })
})

describe("match", () => {
  const step = p(spanish, 0, 0)
  it("counts mismatched pairs and marks both sides", () => {
    const r = checkAnswer(step, {
      kind: "pairs",
      links: { 0: 1, 1: 0, 2: 2, 3: 3 },
    })
    expect(r).toMatchObject({
      correct: false,
      missKey: "match",
      count: 2,
      marks: { L0: "wrong", R1: "wrong", L2: "correct" },
    })
  })
})

describe("blank", () => {
  const step = p(spanish, 1, 0)
  it("uses a decoy's mistake feedback", () => {
    const r = checkAnswer(step, {
      kind: "gaps",
      values: { c: "Dónde", g: "gracias" },
    })
    expect(r).toMatchObject({
      correct: false,
      feedback: expect.stringMatching(/where are you/),
      marks: { c: "wrong", g: "correct" },
    })
  })
  it("respects caseSensitive for code", () => {
    expect(
      checkAnswer(p(coding, 0, 0), { kind: "gaps", values: { m: "Map" } })
        .correct
    ).toBe(false)
  })
  it("empties only the wrong gaps on retry", () => {
    expect(
      retryAnswer(step, { kind: "gaps", values: { c: "Qué", g: "gracias" } })
    ).toEqual({ kind: "gaps", values: { c: "", g: "gracias" } })
  })
})

describe("hotspot", () => {
  it("uses the code-line message for code visuals", () => {
    expect(
      checkAnswer(p(coding, 1, 1), { kind: "select", ids: ["l1"] })
    ).toMatchObject({ correct: false, missKey: "hotspotLine" })
  })
})

describe("flow", () => {
  it("plays intro, hook, each concept and its practice, challenge, fix slot, wrap-up", () => {
    const kinds = buildSequence(buttons).map((i) =>
      i.kind === "step"
        ? `${i.role}:${i.step.id}`
        : i.kind === "concept"
          ? `concept:${i.concept.id}`
          : i.kind
    )
    expect(kinds).toEqual([
      "intro",
      "hook:hook",
      "concept:c1",
      "practice:p1",
      "practice:p2",
      "concept:c2",
      "practice:p3",
      "practice:p4",
      "challenge:ch",
      "fix",
      "wrap",
    ])
  })
  it("scores practice and challenge, not the hook", () => {
    const s = summarize(buttons, {
      p1: "first",
      p2: "hint",
      p3: "second",
      ch: "first",
    })
    expect(s).toEqual({ first: 2, hint: 1, second: 1, missed: 1, total: 5 })
  })
  it("records hints and second tries", () => {
    expect([
      outcomeFor(0, false),
      outcomeFor(0, true),
      outcomeFor(1, false),
    ]).toEqual(["first", "hint", "second"])
  })
  it("reports progress from 0 at the intro to 100 at the fix slot", () => {
    const items = buildSequence(buttons)
    expect(progressAt(items, 0, false)).toBe(0)
    expect(
      progressAt(
        items,
        items.findIndex((i) => i.kind === "fix"),
        false
      )
    ).toBe(100)
  })
})
