// What the server prepares for a lesson before it reaches the browser: rendered formulas and
// highlighted code. Shared by the server-side preparer and the client components.

export type CodeToken = { content: string; style?: Record<string, string> }
export type CodeLines = CodeToken[][]

export interface Prepared {
  /** Rendered KaTeX HTML, keyed by mathKey(). */
  math: Record<string, string>
  /** Highlighted code lines, keyed by codeKey(). */
  code: Record<string, CodeLines>
}

export const emptyPrepared: Prepared = { math: {}, code: {} }

export const mathKey = (tex: string, display: boolean) =>
  `${display ? "d" : "i"}:${tex}`
export const codeKey = (language: string, code: string) =>
  `${language}\u0000${code}`

/** Inline formulas in rich text: \( ... \) */
export const INLINE_MATH = /\\\(([\s\S]+?)\\\)/g
