import { z } from "zod"

// Lesson spec v0.2: the shape of a lesson file.
// Structural limits that JSON Schema can express live here; cross-field and
// teaching-quality rules live in rules.ts.

export const SPEC_VERSION = "0.2" as const

const id = z.string().min(1).max(64)
/** Markdown subset: **bold**, *italic*, `code`, and inline formulas as \( ... \). A $ is always a dollar sign. */
const richText = z.string().min(1)
/** A BCP 47 language code, e.g. "en", "es", "ar", "pt-BR". Checked further in rules.ts. */
const langCode = z.string().min(2).max(35)

// ---------- visuals ----------

export const htmlVisual = z
  .strictObject({
    kind: z.literal("html"),
    html: z.string().min(1),
    css: z.string().optional(),
    height: z.int().positive().optional(),
  })
  .meta({ id: "HtmlVisual" })

export const codeVisual = z
  .strictObject({
    kind: z.literal("code"),
    code: z.string().min(1),
    language: z.string().min(1),
    highlight: z.array(z.int().positive()).optional(),
    hotspots: z
      .array(z.strictObject({ id, line: z.int().positive() }))
      .optional(),
  })
  .meta({ id: "CodeVisual" })

export const mathVisual = z
  .strictObject({
    kind: z.literal("math"),
    tex: z.string().min(1),
  })
  .meta({ id: "MathVisual" })

export const visual = z
  .discriminatedUnion("kind", [htmlVisual, codeVisual, mathVisual])
  .meta({ id: "Visual" })

// ---------- shared pieces ----------

export const option = z
  .strictObject({
    id,
    text: richText.optional(),
    visual: visual.optional(),
    feedback: richText.optional(),
    lang: langCode.optional(),
  })
  .refine((o) => o.text !== undefined || o.visual !== undefined, {
    error: "An option needs text or a visual.",
  })
  .meta({ id: "Option" })

const stepBase = {
  id,
  prompt: richText,
  visual: visual.optional(),
  hint: richText.optional(),
  explanation: richText,
}

const textMistake = z.strictObject({
  answer: z.string().min(1),
  feedback: richText,
})
const numberMistake = z.strictObject({ answer: z.number(), feedback: richText })

// ---------- the nine building blocks ----------

export const choiceStep = z
  .strictObject({
    ...stepBase,
    type: z.literal("choice"),
    options: z.array(option).min(2).max(5),
    correct: z.array(id).min(1),
    multiple: z.boolean(),
  })
  .meta({ id: "ChoiceStep" })

export const compareStep = z
  .strictObject({
    ...stepBase,
    type: z.literal("compare"),
    options: z.array(option).length(2),
    correct: id,
  })
  .meta({ id: "CompareStep" })

export const orderItem = z
  .strictObject({
    id,
    text: richText.optional(),
    visual: visual.optional(),
    lang: langCode.optional(),
  })
  .refine((i) => i.text !== undefined || i.visual !== undefined, {
    error: "An item needs text or a visual.",
  })
  .meta({ id: "OrderItem" })

export const orderStep = z
  .strictObject({
    ...stepBase,
    type: z.literal("order"),
    /** Written in the correct order; the player shuffles them. */
    items: z.array(orderItem).min(3).max(6),
    /** Other valid orders, as arrays of item ids. */
    alsoAccept: z.array(z.array(id)).optional(),
  })
  .meta({ id: "OrderStep" })

export const sortStep = z
  .strictObject({
    ...stepBase,
    type: z.literal("sort"),
    groups: z
      .array(
        z.strictObject({
          id,
          label: z.string().min(1),
          lang: langCode.optional(),
        })
      )
      .min(2)
      .max(3),
    items: z
      .array(
        z.strictObject({
          id,
          text: richText,
          group: id,
          lang: langCode.optional(),
        })
      )
      .min(4)
      .max(8),
  })
  .meta({ id: "SortStep" })

export const matchStep = z
  .strictObject({
    ...stepBase,
    type: z.literal("match"),
    pairs: z
      .array(z.strictObject({ left: richText, right: richText }))
      .min(3)
      .max(5),
    leftLang: langCode.optional(),
    rightLang: langCode.optional(),
  })
  .meta({ id: "MatchStep" })

export const blank = z
  .strictObject({
    id,
    accept: z.array(z.string().min(1)).min(1),
    /** Word chips. Required in v1 (no typed answers); checked in rules.ts. */
    choices: z.array(z.string().min(1)).min(2).optional(),
    mistakes: z.array(textMistake).optional(),
    numeric: z.boolean().optional(),
    tolerance: z.number().nonnegative().optional(),
    strictAccents: z.boolean().optional(),
  })
  .meta({ id: "Blank" })

export const blankStep = z
  .strictObject({
    ...stepBase,
    type: z.literal("blank"),
    /** Text or code with [[id]] gaps. */
    template: z.string().min(1),
    format: z.enum(["text", "code"]),
    language: z.string().min(1).optional(),
    lang: langCode.optional(),
    caseSensitive: z.boolean().optional(),
    blanks: z.array(blank).min(1),
  })
  .meta({ id: "BlankStep" })

export const hotspotStep = z
  .strictObject({
    ...stepBase,
    type: z.literal("hotspot"),
    /** An html visual with data-hotspot elements, or a code visual with hotspots. */
    visual: z.discriminatedUnion("kind", [htmlVisual, codeVisual]),
    correct: z.array(id).min(1),
    multiple: z.boolean(),
  })
  .meta({ id: "HotspotStep" })

export const scenarioStep = z
  .strictObject({
    ...stepBase,
    type: z.literal("scenario"),
    situation: richText,
    options: z
      .array(
        z.strictObject({
          id,
          text: richText,
          quality: z.enum(["best", "okay", "poor"]),
          outcome: richText,
          lang: langCode.optional(),
        })
      )
      .min(2)
      .max(4),
  })
  .meta({ id: "ScenarioStep" })

/** Defined in the spec, but not allowed in v1 lessons (numeric questions use choice). */
export const numberStep = z
  .strictObject({
    ...stepBase,
    type: z.literal("number"),
    answer: z.number(),
    tolerance: z.number().nonnegative().optional(),
    unit: z.string().min(1).optional(),
    mistakes: z.array(numberMistake).optional(),
  })
  .meta({ id: "NumberStep" })

export const step = z
  .discriminatedUnion("type", [
    choiceStep,
    compareStep,
    orderStep,
    sortStep,
    matchStep,
    blankStep,
    hotspotStep,
    scenarioStep,
    numberStep,
  ])
  .meta({ id: "Step" })

/** The hook is a guess before any teaching, so it's always a choice or compare step. */
export const hookStep = z
  .discriminatedUnion("type", [choiceStep, compareStep])
  .meta({ id: "HookStep" })

// ---------- lesson ----------

export const concept = z
  .strictObject({
    id,
    title: z.string().min(1).max(60),
    body: richText,
    visual: visual.optional(),
    term: z
      .strictObject({ word: z.string().min(1), definition: richText })
      .optional(),
  })
  .meta({ id: "Concept" })

export const loop = z
  .strictObject({
    concept,
    practice: z.array(step).min(2).max(4),
  })
  .meta({ id: "Loop" })

export const lesson = z.strictObject({
  spec: z.literal(SPEC_VERSION),
  title: z.string().min(1).max(60),
  summary: z.string().min(1).max(160),
  objective: z.string().min(1),
  language: langCode,
  targetLanguage: langCode.optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedMinutes: z.int().min(5).max(10),
  topic: z.string().min(1).optional(),
  source: z
    .strictObject({ title: z.string().min(1), url: z.url().optional() })
    .optional(),
  hook: hookStep,
  loops: z.array(loop).min(1).max(3),
  challenge: step,
  wrapup: z.strictObject({
    takeaways: z.array(richText).min(2).max(4),
    next: z.string().min(1).optional(),
  }),
})

export type Lesson = z.infer<typeof lesson>
export type Step = z.infer<typeof step>
export type Visual = z.infer<typeof visual>
export type Concept = z.infer<typeof concept>
