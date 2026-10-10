import { readFileSync } from "node:fs"

import { describe, expect, it } from "vitest"

import type { Lesson, QuestionBrick } from "@workspace/spec"

import type { Item } from "./flow"
import { freshQuestion, reducer, wordBank, type State } from "./lesson-player"

// The player's state: what a fresh question starts with and how answering moves it along.

const blank: Extract<QuestionBrick, { type: "blank" }> = {
  id: "b",
  type: "blank",
  prompt: "Declare both.",
  explanation: "Both are constants.",
  template: "[[a]] x = 1; [[b]] y = 2;",
  format: "code",
  blanks: [
    { id: "a", accept: ["const"], choices: ["const", "let"] },
    { id: "b", accept: ["const"], choices: ["const", "var"] },
  ],
}

const sort: Extract<QuestionBrick, { type: "sort" }> = {
  id: "s",
  type: "sort",
  prompt: "Sort them.",
  explanation: "Fruit is sweet.",
  groups: [
    { id: "fruit", label: "Fruit" },
    { id: "veg", label: "Vegetables" },
  ],
  items: [
    { id: "apple", text: "Apple", group: "fruit" },
    { id: "pear", text: "Pear", group: "fruit" },
    { id: "kale", text: "Kale", group: "veg" },
    { id: "leek", text: "Leek", group: "veg" },
  ],
}

function stateFor(brick: QuestionBrick): State {
  const item: Item = { kind: "question", brick, role: "practice" }
  return {
    items: [item],
    index: 0,
    results: {},
    mistakes: [],
    inFix: false,
    fixQueued: false,
    run: 0,
    question: freshQuestion(item, () => 0.5),
  }
}

describe("word bank", () => {
  it("gives a word one chip per gap that accepts it", () => {
    expect([...wordBank(blank)].sort()).toEqual([
      "const",
      "const",
      "let",
      "var",
    ])
  })

  it("lists a decoy once even when several gaps offer it", () => {
    const shared = {
      ...blank,
      blanks: blank.blanks.map((b) => ({ ...b, choices: ["const", "let"] })),
    }
    expect([...wordBank(shared)].sort()).toEqual(["const", "const", "let"])
  })
})

describe("retry", () => {
  it("keeps the marks until the answer changes", () => {
    let state = stateFor(sort)
    state = reducer(state, {
      type: "answer",
      answer: {
        kind: "zones",
        zones: { pool: [], fruit: ["apple", "kale"], veg: ["pear", "leek"] },
      },
    })
    state = reducer(state, { type: "check" })
    expect(state.question?.phase).toBe("feedback")
    state = reducer(state, { type: "retry" })
    expect(state.question?.phase).toBe("answering")
    expect(state.question?.result?.marks).toMatchObject({
      apple: "correct",
      kale: "wrong",
      pear: "wrong",
      leek: "correct",
    })
    state = reducer(state, {
      type: "answer",
      answer: {
        kind: "zones",
        zones: { pool: [], fruit: ["apple", "pear"], veg: ["kale", "leek"] },
      },
    })
    expect(state.question?.result).toBeNull()
  })
})

describe("restart", () => {
  it("counts the run, so a replay seeds its feedback lines afresh", () => {
    const lesson = JSON.parse(
      readFileSync(
        new URL("../../../examples/compound-interest.json", import.meta.url),
        "utf8"
      )
    ) as Lesson
    let state = stateFor(sort)
    expect(state.run).toBe(0)
    state = reducer(state, { type: "restart", lesson })
    expect(state.run).toBe(1)
    expect(state.index).toBe(0)
    state = reducer(state, { type: "restart", lesson })
    expect(state.run).toBe(2)
  })
})
