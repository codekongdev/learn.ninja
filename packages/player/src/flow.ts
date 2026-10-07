import type { Concept, Lesson, Step } from "@workspace/spec"

// The order a lesson plays in, and how the score is counted.

export type Role = "hook" | "practice" | "challenge" | "fix"

export type Item =
  | { kind: "intro" }
  | { kind: "concept"; concept: Concept; index: number; total: number }
  | { kind: "step"; step: Step; role: Role }
  | { kind: "fix" }
  | { kind: "wrap" }

/** Intro → hook → (concept → practice)… → challenge → fix-your-mistakes slot → wrap-up. */
export function buildSequence(lesson: Lesson): Item[] {
  const items: Item[] = [
    { kind: "intro" },
    { kind: "step", step: lesson.hook, role: "hook" },
  ]
  lesson.loops.forEach((loop, i) => {
    items.push({
      kind: "concept",
      concept: loop.concept,
      index: i + 1,
      total: lesson.loops.length,
    })
    for (const step of loop.practice)
      items.push({ kind: "step", step, role: "practice" })
  })
  items.push({ kind: "step", step: lesson.challenge, role: "challenge" })
  items.push({ kind: "fix" }, { kind: "wrap" })
  return items
}

/** How a scored step went on its first pass. */
export type Outcome = "first" | "hint" | "second" | "missed"

/** Practice and challenge steps count toward the score; the hook doesn't. */
export function scoredSteps(lesson: Lesson): Step[] {
  return [...lesson.loops.flatMap((l) => l.practice), lesson.challenge]
}

export type Summary = Record<Outcome, number> & { total: number }

export function summarize(
  lesson: Lesson,
  results: Record<string, Outcome>
): Summary {
  const summary: Summary = { first: 0, hint: 0, second: 0, missed: 0, total: 0 }
  for (const step of scoredSteps(lesson)) {
    summary[results[step.id] ?? "missed"]++
    summary.total++
  }
  return summary
}

/** The outcome to record for a step answered correctly. */
export function outcomeFor(attempts: number, usedHint: boolean): Outcome {
  if (attempts > 0) return "second"
  return usedHint ? "hint" : "first"
}

/** Progress as 0–100: the intro is 0, the wrap-up and fix round are 100. */
export function progressAt(
  items: Item[],
  index: number,
  inFix: boolean
): number {
  const item = items[index]
  if (!item || item.kind === "intro") return 0
  if (inFix || item.kind === "wrap" || item.kind === "fix") return 100
  const fixAt = items.findIndex((i) => i.kind === "fix")
  return Math.round(((index - 1) / Math.max(1, fixAt - 1)) * 100)
}

/** Where the learner is in the lesson's parts: one per loop (the warm-up belongs to the first), then the challenge. */
export interface PartProgress {
  count: number
  /** The part being played (0-based). */
  current: number
  /** How far through the current part, from 0 to 1. */
  fraction: number
  /** True once the challenge is behind them (fixing mistakes, wrap-up). */
  done: boolean
}

export function partAt(
  items: Item[],
  index: number,
  inFix: boolean
): PartProgress {
  let part = 0
  const parts = items.map((item) => {
    if (item.kind === "concept") part = item.index - 1
    if (item.kind === "step" && item.role === "challenge") part = -2
    if (item.kind === "intro" || item.kind === "fix" || item.kind === "wrap")
      return -1
    return part === -2 ? Infinity : part
  })
  const count = items.filter((i) => i.kind === "concept").length + 1
  const challenge = (p: number) => (p === Infinity ? count - 1 : p)
  const item = items[index]
  if (inFix || item?.kind === "fix" || item?.kind === "wrap")
    return { count, current: count - 1, fraction: 1, done: true }
  if (!item || item.kind === "intro")
    return { count, current: 0, fraction: 0, done: false }
  const current = challenge(parts[index]!)
  const members = parts
    .map((p, i) => (p !== -1 && challenge(p) === current ? i : -1))
    .filter((i) => i >= 0)
  return {
    count,
    current,
    fraction: members.indexOf(index) / members.length,
    done: false,
  }
}
