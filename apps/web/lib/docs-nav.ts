import type { ReactNode } from "react"
import type { InferPageType } from "fumadocs-core/source"
import type { Node, Root } from "fumadocs-core/page-tree"

import type { NavPage, NavSection } from "@/components/docs/docs-nav"
import { source } from "@/lib/source"

// The docs are one page per file in docs/, in sidebar order; the sidebar's sections are the
// separators in docs/meta.json, with the files after each one under it.

export type DocPage = InferPageType<typeof source>

/** The path of a docs page's Markdown: /docs.md for the index, /docs/{path}.md for the rest. */
export function markdownPath(page: DocPage): string {
  return `${page.url}.md`
}

/** The docs files in sidebar order. */
export function docsPages(): DocPage[] {
  const order = docsNavSections().flatMap((s) => s.pages.map((p) => p.url))
  return source
    .getPages()
    .sort((a, b) => order.indexOf(a.url) - order.indexOf(b.url))
}

/**
 * The sidebar's sections, from the page tree: each separator in docs/meta.json starts a section,
 * and the files after it (folders flattened) belong to it. Each file lists its level-2 headings.
 */
export function docsNavSections(
  tree: Root = source.getPageTree()
): NavSection[] {
  const pages = new Map(source.getPages().map((page) => [page.url, page]))
  const sections: NavSection[] = []
  const add = (node: Node) => {
    if (node.type === "separator") {
      sections.push({ name: String(node.name), pages: [] })
      return
    }
    if (node.type === "folder") {
      if (node.index) add(node.index)
      node.children.forEach(add)
      return
    }
    const source = pages.get(node.url)
    if (!source) return
    const page: NavPage = {
      name: String(node.name),
      url: node.url,
      headings: source.data.toc
        .filter((item) => item.depth === 2)
        .map((item) => ({
          title: toText(item.title),
          id: item.url.replace(/^#/, ""),
        })),
    }
    const section = sections.at(-1)
    if (section) section.pages.push(page)
    else sections.push({ name: page.name, pages: [page] })
  }
  tree.children.forEach(add)
  return sections.filter((section) => section.pages.length > 0)
}

/** A heading's text. Headings with inline code or links come through as React nodes. */
function toText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(toText).join("")
  if (typeof node === "object" && "props" in node)
    return toText((node.props as { children?: ReactNode }).children)
  return ""
}
