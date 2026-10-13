import type { ConceptBrick, Lesson, QuestionBrick } from "@workspace/spec"

// The order a lesson plays in, and how the score is counted.

export type Role = "hook" | "practice" | "challenge" | "fix"

export type Item =
  | { kind: "intro" }
  | { kind: "concept"; brick: ConceptBrick }
  | { kind: "question"; brick: QuestionBrick; role: Role }
  | { kind: "fix" }
  | { kind: "wrap" }

/** Intro → hook → the lesson's bricks → challenge → fix-your-mistakes slot → wrap-up. */
export function buildSequence(lesson: Lesson): Item[] {
  return [
    { kind: "intro" },
    { kind: "question", brick: lesson.hook, role: "hook" },
    ...lesson.bricks.map((brick): Item =>
      brick.type === "concept"
        ? { kind: "concept", brick }
        : { kind: "question", brick, role: "practice" }
    ),
    { kind: "question", brick: lesson.challenge, role: "challenge" },
    { kind: "fix" },
    { kind: "wrap" },
  ]
}

/** How a scored question went on its first pass. */
export type Outcome = "first" | "second" | "missed"

/** Practice and challenge questions count toward the score; the hook and concepts don't. */
export function scoredQuestions(lesson: Lesson): QuestionBrick[] {
  return [
    ...lesson.bricks.filter((b): b is QuestionBrick => b.type !== "concept"),
    lesson.challenge,
  ]
}

export type Summary = Record<Outcome, number> & { total: number }

export function summarize(
  lesson: Lesson,
  results: Record<string, Outcome>
): Summary {
  const summary: Summary = { first: 0, second: 0, missed: 0, total: 0 }
  for (const brick of scoredQuestions(lesson)) {
    summary[results[brick.id] ?? "missed"]++
    summary.total++
  }
  return summary
}

/** The outcome to record for a question answered correctly. Opening the theory first costs nothing. */
export function outcomeFor(attempts: number): Outcome {
  return attempts > 0 ? "second" : "first"
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

/**
 * The question counter beside the bar: the question on screen (on a concept, the one coming next)
 * out of the lesson's questions, warm-up and challenge included. In the fix round it counts the retries.
 */
export interface QuestionCount {
  current: number
  total: number
  fixing: boolean
}

export function questionAt(
  items: Item[],
  index: number,
  inFix: boolean
): QuestionCount {
  const counted = (role: (r: Role) => boolean) =>
    items.flatMap((item, i) =>
      item.kind === "question" && role(item.role) ? [i] : []
    )
  const list = inFix ? counted((r) => r === "fix") : counted((r) => r !== "fix")
  const ahead = list.findIndex((i) => i >= index)
  return {
    current: ahead === -1 ? list.length : ahead + 1,
    total: list.length,
    fixing: inFix,
  }
}
