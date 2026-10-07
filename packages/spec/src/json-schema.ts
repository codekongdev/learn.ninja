import { z } from "zod"

import { lesson, SPEC_VERSION } from "./schema"

/**
 * The lesson spec as JSON Schema, for the skill and for any tool that can't run TypeScript.
 * It covers the lesson's shape; the cross-field rules in rules.ts only run in validateLesson().
 */
export function lessonJsonSchema() {
  return {
    ...z.toJSONSchema(lesson, { target: "draft-2020-12" }),
    title: `Lesson (spec ${SPEC_VERSION})`,
  }
}
