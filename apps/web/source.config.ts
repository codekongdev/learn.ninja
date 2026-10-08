import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import type { Root } from "mdast"
import { SKIP, visit } from "unist-util-visit"

// The docs live in the repo's top-level docs/ folder, outside apps/, so anyone can contribute to them.
export const docs = defineDocs({
  dir: "../../docs",
  docs: {
    // Keeps each page's Markdown with includes resolved, for /docs/{page}.md and llms-full.txt.
    postprocess: { includeProcessedMarkdown: true },
  },
})

/**
 * Pages take their title from frontmatter, so a `# Title` in the body only comes from an included file
 * (like the skill's lesson-format.md). Drop it so the title doesn't show twice.
 */
function remarkDropTitles() {
  return (tree: Root) => {
    // Included files land nested in the tree, so look everywhere, not just at the top.
    visit(tree, "heading", (node, index, parent) => {
      if (node.depth !== 1 || !parent || index === undefined) return
      parent.children.splice(index, 1)
      return [SKIP, index]
    })
  }
}

export default defineConfig({
  mdxOptions: {
    remarkPlugins: (plugins) => [...plugins, remarkDropTitles],
    // The same themes the player uses for code in lessons.
    rehypeCodeOptions: {
      themes: { light: "github-light", dark: "github-dark" },
    },
  },
})
