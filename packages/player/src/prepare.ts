import "server-only"

import katex from "katex"
import {
  createHighlighter,
  type BundledLanguage,
  type Highlighter,
} from "shiki"

import type { ChartVisual, Lesson } from "@workspace/spec"

import { renderChart } from "./chart"
import {
  chartKey,
  codeKey,
  INLINE_MATH,
  mathKey,
  type Prepared,
} from "./prepared"
import { visualClasses, visualsCssFor } from "./visual-css"

// Server-only: renders formulas with KaTeX, highlights code with Shiki, draws charts with Observable
// Plot, and compiles the Tailwind CSS a lesson's visuals use, once per lesson, so the learner's
// browser loads none of those libraries.

const THEMES = { light: "github-light", dark: "github-dark" } as const

let highlighter: Promise<Highlighter> | null = null
const loadedLanguages = new Set<string>()

async function getHighlighter(languages: string[]): Promise<Highlighter> {
  highlighter ??= createHighlighter({
    themes: Object.values(THEMES),
    langs: [],
  })
  const h = await highlighter
  for (const lang of languages) {
    if (loadedLanguages.has(lang)) continue
    try {
      await h.loadLanguage(lang as BundledLanguage)
      loadedLanguages.add(lang)
    } catch {
      // Unknown language: the code is shown without highlighting.
    }
  }
  return h
}

export async function prepareLesson(lesson: Lesson): Promise<Prepared> {
  const prepared: Prepared = {
    math: {},
    code: {},
    visualsCss: await visualsCssFor(visualClasses(lesson)),
    charts: {},
  }
  const codeBlocks: { language: string; code: string }[] = []

  for (const { chart, compact } of chartsIn(lesson))
    prepared.charts![chartKey(chart, compact)] = renderChart(chart, compact)

  walk(lesson, (value, key, parent) => {
    if (typeof value === "string") {
      if (key === "tex") {
        prepared.math[mathKey(value, true)] = katex.renderToString(value, {
          displayMode: true,
          throwOnError: false,
        })
      } else if (key !== "html" && key !== "css" && key !== "code") {
        for (const m of value.matchAll(INLINE_MATH)) {
          const tex = m[1]!.trim()
          prepared.math[mathKey(tex, false)] = katex.renderToString(tex, {
            throwOnError: false,
          })
        }
      }
    }
    if (
      parent &&
      (parent as { kind?: string }).kind === "code" &&
      key === "code" &&
      typeof value === "string"
    ) {
      codeBlocks.push({
        language: (parent as { language: string }).language,
        code: value,
      })
    }
  })

  if (codeBlocks.length) {
    const h = await getHighlighter([
      ...new Set(codeBlocks.map((c) => c.language)),
    ])
    for (const { language, code } of codeBlocks) {
      if (!loadedLanguages.has(language)) continue
      const { tokens } = h.codeToTokens(code, {
        lang: language as BundledLanguage,
        themes: THEMES,
      })
      prepared.code[codeKey(language, code)] = tokens.map((line) =>
        line.map((t) => ({
          content: t.content,
          style: t.htmlStyle as Record<string, string> | undefined,
        }))
      )
    }
  }

  return prepared
}

/** The lesson's chart visuals: a brick's own at full size, an option's or item's compact. */
function chartsIn(lesson: Lesson): { chart: ChartVisual; compact: boolean }[] {
  const out: { chart: ChartVisual; compact: boolean }[] = []
  for (const brick of [lesson.hook, ...lesson.bricks, lesson.challenge]) {
    if ("visual" in brick && brick.visual?.kind === "chart")
      out.push({ chart: brick.visual, compact: false })
    const cards = [
      ...("options" in brick ? brick.options : []),
      ...("items" in brick ? brick.items : []),
    ]
    for (const card of cards)
      if ("visual" in card && card.visual?.kind === "chart")
        out.push({ chart: card.visual, compact: true })
  }
  return out
}

function walk(
  value: unknown,
  visit: (value: unknown, key: string, parent: unknown) => void,
  key = "",
  parent: unknown = null
) {
  visit(value, key, parent)
  if (Array.isArray(value)) value.forEach((v) => walk(v, visit, key, parent))
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value)) walk(v, visit, k, value)
}
