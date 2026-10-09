import Link from "next/link"
import type { MDXComponents } from "mdx/types"

import { BrickPreview } from "./brick-preview"
import { CodeBlock } from "./code-block"
import { CopyPrompt } from "./copy-prompt"

/** How docs Markdown renders: site links stay in the app, code blocks get a copy button. */
export const mdxComponents: MDXComponents = {
  a: ({ href = "", ...props }) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href} {...props} />
    ) : (
      <a href={href} target="_blank" rel="noreferrer" {...props} />
    ),
  pre: (props) => <CodeBlock {...props} />,
  table: (props) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
  BrickPreview,
  CopyPrompt,
}
