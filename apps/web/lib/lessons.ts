import buttonHierarchy from "../../../examples/button-hierarchy.json"
import compoundInterest from "../../../examples/compound-interest.json"
import mapVsForEach from "../../../examples/map-vs-foreach.json"
import spanishGreetings from "../../../examples/spanish-greetings.json"
import writingAPrd from "../../../examples/writing-a-prd.json"

import { validateLesson, type Lesson } from "@workspace/spec"

// During the concept phase, lessons are bundled with the app. Later they come from the publish API.
const RAW: Record<string, unknown> = {
  "button-hierarchy": buttonHierarchy,
  "writing-a-prd": writingAPrd,
  "compound-interest": compoundInterest,
  "spanish-greetings": spanishGreetings,
  "map-vs-foreach": mapVsForEach,
}

export const LESSON_SLUGS = Object.keys(RAW)

/** A bundled lesson, checked against the spec. Throws with the spec's own messages if it's invalid. */
export function getLesson(slug: string): Lesson | null {
  const raw = RAW[slug]
  if (!raw) return null
  const result = validateLesson(raw)
  if (!result.ok) {
    throw new Error(
      `Lesson "${slug}" is invalid:\n${result.issues.map((i) => `- ${i.path}: ${i.message}`).join("\n")}`
    )
  }
  return result.lesson
}
