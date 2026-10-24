// The block structure of a concept body. Each line is a paragraph, and two or more lines in a row
// that start with "- " (or "* ") make a bulleted list; "1. ", "2. "… counting up make a numbered one.
// A lone marker line stays text, so chess moves like "1. e4 e5" read as written. No nesting.

export type TextBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; start: number; items: string[] }

const BULLET = /^\s*[-*]\s+(\S.*)$/
const NUMBERED = /^\s*(\d{1,3})[.)]\s+(\S.*)$/

/** A line's list item, or null when it doesn't start with a marker. */
export function listItem(
  line: string
): { ordered: boolean; n: number; text: string } | null {
  const bullet = line.match(BULLET)
  if (bullet) return { ordered: false, n: 0, text: bullet[1]!.trim() }
  const numbered = line.match(NUMBERED)
  if (numbered)
    return { ordered: true, n: Number(numbered[1]), text: numbered[2]!.trim() }
  return null
}

export function textBlocks(text: string): TextBlock[] {
  // Blank lines only separate blocks, so a list with a blank line between items is still one list.
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  const blocks: TextBlock[] = []
  let i = 0
  while (i < lines.length) {
    const first = listItem(lines[i]!)
    const items: string[] = []
    if (first) {
      items.push(first.text)
      let n = first.n
      for (let j = i + 1; j < lines.length; j++) {
        const next = listItem(lines[j]!)
        if (!next || next.ordered !== first.ordered) break
        if (next.ordered && next.n !== n + 1) break
        items.push(next.text)
        n = next.n
      }
    }
    if (first && items.length >= 2) {
      blocks.push({
        kind: "list",
        ordered: first.ordered,
        start: first.ordered ? first.n : 1,
        items,
      })
      i += items.length
    } else {
      blocks.push({ kind: "paragraph", text: lines[i]! })
      i++
    }
  }
  return blocks
}
