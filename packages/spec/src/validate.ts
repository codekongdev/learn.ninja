import { checkLesson, type Issue } from "./rules"
import { lesson as lessonSchema, type Lesson } from "./schema"

export type ValidationResult =
  { ok: true; lesson: Lesson; issues: [] } | { ok: false; issues: Issue[] }

/**
 * Check a lesson file (as JSON text or an already-parsed value) against the current spec and the v1 rules.
 * The schema runs first; the cross-field rules run only on a lesson that matches it.
 */
export function validateLesson(input: string | unknown): ValidationResult {
  let raw: string
  let data: unknown
  if (typeof input === "string") {
    raw = input
    try {
      data = JSON.parse(input)
    } catch (e) {
      return {
        ok: false,
        issues: [
          {
            kind: "structure",
            path: "",
            message: `The file isn't valid JSON: ${(e as Error).message}`,
          },
        ],
      }
    }
  } else {
    data = input
    raw = JSON.stringify(input)
  }

  const parsed = lessonSchema.safeParse(data)
  if (!parsed.success) {
    return {
      ok: false,
      issues: parsed.error.issues.map((i) => ({
        kind: "structure",
        path: formatPath(i.path),
        message: i.message,
      })),
    }
  }

  const issues = checkLesson(parsed.data, raw)
  return issues.length
    ? { ok: false, issues }
    : { ok: true, lesson: parsed.data, issues: [] }
}

/** ["bricks", 2, "options", 1] → "bricks[2].options[1]" */
export function formatPath(path: PropertyKey[]): string {
  return path.reduce<string>(
    (out, key) =>
      typeof key === "number"
        ? `${out}[${key}]`
        : out
          ? `${out}.${String(key)}`
          : String(key),
    ""
  )
}

/** Issues as one line each, ready to hand back to an LLM. */
export function formatIssues(issues: Issue[]): string {
  return issues.map((i) => `- ${i.path || "lesson"}: ${i.message}`).join("\n")
}
