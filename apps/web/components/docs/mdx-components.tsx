import Link from "next/link"
import type { MDXComponents } from "mdx/types"

import { docsHref } from "@/lib/docs-nav"

import { KataPreview } from "./kata-preview"
import { CodeBlock } from "./code-block"
import { CopyPrompt } from "./copy-prompt"

/**
 * How docs Markdown renders: links to other docs files become anchors on the one page, other site
 * links stay in the app, and code blocks get a copy button.
 */
export const mdxComponents: MDXComponents = {
  a: ({ href = "", ...props }) => {
    const to = docsHref(href)
    return to.startsWith("/") || to.startsWith("#") ? (
      <Link href={to} {...props} />
    ) : (
      <a href={to} target="_blank" rel="noreferrer" {...props} />
    )
  },
  pre: (props) => <CodeBlock {...props} />,
  table: (props) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
  KataPreview,
  CopyPrompt,
}
