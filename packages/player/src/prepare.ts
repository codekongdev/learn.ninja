import "server-only"

import katex from "katex"
import {
  createHighlighter,
  type BundledLanguage,
  type Highlighter,
} from "shiki"

import type { Lesson } from "@workspace/spec"

import { codeKey, INLINE_MATH, mathKey, type Prepared } from "./prepared"

// Server-only: renders formulas with KaTeX and highlights code with Shiki, once per lesson,
// so the learner's browser loads no math or highlighting library.

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
  const prepared: Prepared = { math: {}, code: {} }
  const codeBlocks: { language: string; code: string }[] = []

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
