import type { ReactNode } from "react"
import type { Node, Root } from "fumadocs-core/page-tree"

import type { NavPage, NavSection } from "@/components/docs/docs-nav"
import { source } from "@/lib/source"

/**
 * The sidebar's sections, from the page tree: each separator in docs/meta.json starts a section,
 * and the pages and folders after it (flattened) belong to it. Each page lists its level-2 headings.
 */
export function docsNavSections(tree: Root = source.getPageTree()): NavSection[] {
  const headings = new Map(
    source.getPages().map((page) => [
      page.url,
      page.data.toc
        .filter((item) => item.depth === 2)
        .map((item) => ({
          title: toText(item.title),
          id: item.url.replace(/^#/, ""),
        })),
    ])
  )
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
    const page: NavPage = {
      name: String(node.name),
      url: node.url,
      headings: headings.get(node.url) ?? [],
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
