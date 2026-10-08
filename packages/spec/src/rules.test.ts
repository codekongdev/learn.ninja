import { describe, expect, it } from "vitest"

import { loadExample } from "./test-helpers"
import { validateLesson } from "./validate"

// Each test breaks a valid example lesson in one way and checks the right issue comes back.

function issuesFor(lesson: unknown) {
  const result = validateLesson(lesson)
  expect(result.ok).toBe(false)
  return result.issues
}

function expectIssue(
  lesson: unknown,
  match: { path?: string; message: RegExp; kind?: string }
) {
  const issues = issuesFor(lesson)
  const found = issues.find(
    (i) =>
      match.message.test(i.message) &&
      (match.path === undefined || i.path === match.path) &&
      (match.kind === undefined || i.kind === match.kind)
  )
  if (!found)
    throw new Error(
      `Expected an issue like ${match.message} at "${match.path ?? "*"}", got:\n${JSON.stringify(issues, null, 2)}`
    )
}

const buttons = () => loadExample("button-hierarchy.json")
const compound = () => loadExample("compound-interest.json")

describe("schema", () => {
  it("rejects text that isn't JSON", () => {
    expect(validateLesson("{ not json")).toMatchObject({
      ok: false,
      issues: [{ message: expect.stringMatching(/isn't valid JSON/) }],
    })
  })

  it("rejects unknown fields, so typos are caught", () => {
    const l = buttons()
    l.loops[0].practice[0].colour = "blue"
    expectIssue(l, { path: "loops[0].practice[0]", message: /colour/ })
  })

  it("only allows choice or compare as the hook", () => {
    const l = buttons()
    l.hook = { ...l.challenge, id: "hook" }
    expectIssue(l, { path: "hook.type", message: /choice|compare/ })
  })

  it("requires 2–4 practice steps per loop", () => {
    const l = buttons()
    l.loops[0].practice = l.loops[0].practice.slice(0, 1)
    expectIssue(l, { path: "loops[0].practice", message: /2/ })
  })

  it("requires the current spec version", () => {
    const l = buttons()
    l.spec = "0.1"
    expectIssue(l, { path: "spec", message: /0\.2/ })
  })
})

describe("structure rules", () => {
  it("requires 4–8 practice steps in total", () => {
    const l = buttons()
    l.loops = l.loops.slice(0, 1)
    expectIssue(l, {
      path: "loops",
      message: /2 practice steps in total; it needs 4–8/,
    })
  })

  it("rejects duplicate step ids", () => {
    const l = buttons()
    l.loops[0].practice[1].id = "p1"
    expectIssue(l, { message: /"p1" is used more than once/ })
  })

  it("checks that correct answers point to real options", () => {
    const l = buttons()
    l.loops[0].practice[0].correct = ["z"]
    expectIssue(l, {
      path: "loops[0].practice[0].correct",
      message: /"z" isn't one of this step's option ids/,
    })
  })

  it("checks that sort items point to real groups", () => {
    const l = buttons()
    l.loops[1].practice[0].items[0].group = "nope"
    expectIssue(l, {
      path: "loops[1].practice[0].items[0].group",
      message: /"nope" isn't one of this step's group ids/,
    })
  })

  it("checks that template gaps and blanks match", () => {
    const l = compound()
    l.loops[0].practice[1].template = "$1,000 × [[x]] = $1,050"
    expectIssue(l, { message: /\[\[x\]\] has no matching entry/ })
    expectIssue(l, { message: /Blank "g" doesn't appear in the template/ })
  })

  it("requires a blank's accepted answer to be among its chips", () => {
    const l = compound()
    l.loops[0].practice[1].blanks[0].choices = ["0.05", "1.5"]
    expectIssue(l, {
      path: "loops[0].practice[1].blanks[0].choices",
      message: /can't be answered/,
    })
  })

  it("checks that hotspot answers exist in the visual", () => {
    const l = buttons()
    l.loops[0].practice[1].correct = ["missing"]
    expectIssue(l, {
      path: "loops[0].practice[1].correct",
      message: /isn't one of this visual's hotspot ids \(create, learn\)/,
    })
  })

  it("checks that code hotspots point to real lines", () => {
    const l = loadExample("map-vs-foreach.json")
    l.loops[1].practice[1].visual.hotspots[2].line = 9
    expectIssue(l, { message: /Line 9 doesn't exist; the code has 3 lines/ })
  })

  it("checks alternative orders list every item once", () => {
    const l = buttons()
    l.loops[1].practice[1].alsoAccept = [["a", "b"]]
    expectIssue(l, {
      path: "loops[1].practice[1].alsoAccept[0]",
      message: /every item id exactly once/,
    })
  })

  it("rejects invalid language codes", () => {
    const l = loadExample("spanish-greetings.json")
    l.hook.options[0].lang = "not a language"
    expectIssue(l, {
      path: "hook.options[0].lang",
      message: /isn't a valid BCP 47 language code/,
    })
  })

  it("rejects unbalanced inline formulas", () => {
    const l = compound()
    l.challenge.explanation = "\\( 5000 \\times 1.08^3 is about 6298.56."
    expectIssue(l, {
      path: "challenge.explanation",
      message: /Unbalanced inline formula/,
    })
  })

  it("rejects formulas KaTeX can't render", () => {
    const l = compound()
    l.loops[0].concept.visual.tex = "\\frac{1}{"
    expectIssue(l, {
      path: "loops[0].concept.visual.tex",
      message: /doesn't render/,
    })
  })

  it("treats a dollar sign as plain text", () => {
    const l = compound()
    l.hook.prompt = "Is $5 or $10 more?"
    expect(validateLesson(l).ok).toBe(true)
  })
})

describe("v1 rules", () => {
  it("rejects number steps", () => {
    const l = compound()
    l.challenge = {
      id: "ch",
      type: "number",
      prompt: "How much?",
      answer: 6298.56,
      explanation: "Compound it.",
    }
    expectIssue(l, {
      path: "challenge",
      kind: "v1",
      message: /Number steps aren't supported in v1/,
    })
  })

  it("rejects blanks without word chips", () => {
    const l = compound()
    delete l.loops[0].practice[1].blanks[0].choices
    expectIssue(l, {
      path: "loops[0].practice[1].blanks[0]",
      kind: "v1",
      message: /add a "choices" word bank/,
    })
  })
})

describe("teaching rules", () => {
  it("requires feedback on every wrong option", () => {
    const l = buttons()
    delete l.loops[0].practice[0].options[1].feedback
    expectIssue(l, {
      path: "loops[0].practice[0].options[1]",
      message: /Wrong option "b" has no feedback/,
    })
  })

  it("lets a lesson repeat one step type when that's what fits", () => {
    const l = compound()
    l.loops[0].practice[1] = { ...l.loops[0].practice[0], id: "p2" }
    expect(validateLesson(l).ok).toBe(true)
  })

  it("keeps prompts to 40 words", () => {
    const l = buttons()
    l.loops[0].practice[0].prompt = Array(45).fill("word").join(" ")
    expectIssue(l, { path: "loops[0].practice[0].prompt", message: /45 words/ })
  })

  it("requires at least one wrong option", () => {
    const l = buttons()
    l.loops[0].practice[0].correct = ["a", "b", "c"]
    l.loops[0].practice[0].multiple = true
    expectIssue(l, { message: /At least one option must be wrong/ })
  })

  it("requires a best option in a scenario", () => {
    const l = buttons()
    l.challenge.options[0].quality = "okay"
    expectIssue(l, { path: "challenge.options", message: /"quality": "best"/ })
  })
})

describe("safety rules", () => {
  it.each([
    ["<script>alert(1)</script>", /can't contain <script>/],
    ["<button onclick='x()'>Go</button>", /event handlers/],
    ["<iframe></iframe>", /iframes/],
    ["<img src='https://evil.example/x.png'>", /external URLs/],
    ["<a href='javascript:alert(1)'>x</a>", /javascript: URLs/],
  ])("rejects %s in a visual", (html, message) => {
    const l = buttons()
    l.loops[0].concept.visual.html = html
    expectIssue(l, { kind: "safety", message })
  })

  it("limits each HTML visual to 20 KB", () => {
    const l = buttons()
    l.loops[0].concept.visual.html = `<div>${"x".repeat(21 * 1024)}</div>`
    expectIssue(l, {
      kind: "safety",
      message: /keep each HTML visual under 20 KB/,
    })
  })
})
