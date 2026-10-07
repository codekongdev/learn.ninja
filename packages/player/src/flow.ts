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
