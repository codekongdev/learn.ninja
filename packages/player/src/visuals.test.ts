import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { Visual, VISUAL_SANDBOX } from "./visuals"

// The HTML visual's frame is the only place lesson content touches the page, so its shape is pinned here.

const decode = (s: string) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")

function frameFor(visual: { html: string; css?: string }) {
  const markup = renderToStaticMarkup(
    createElement(Visual, { visual: { kind: "html", ...visual } })
  )
  // React's server renderer keeps the prop's casing (srcDoc).
  const srcdoc = /srcdoc="([^"]*)"/i.exec(markup)?.[1]
  return { markup, srcdoc: srcdoc === undefined ? undefined : decode(srcdoc) }
}

describe("HTML visual frame", () => {
  it("is sandboxed without scripts", () => {
    const { markup } = frameFor({ html: "<b>Hi</b>" })
    expect(VISUAL_SANDBOX).toBe("allow-same-origin")
    expect(markup).toContain(`sandbox="${VISUAL_SANDBOX}"`)
    expect(markup).not.toContain("allow-scripts")
  })

  it("keeps the lesson's CSS inside its style tag", () => {
    const css = `b{color:red}</style><meta http-equiv="refresh" content="0;url=https://evil.example">`
    const { srcdoc } = frameFor({ html: "<b>Hi</b>", css })
    expect(srcdoc).toBeDefined()
    expect(srcdoc).not.toContain('</style><meta http-equiv="refresh"')
    expect(srcdoc).toContain('<\\/style><meta http-equiv="refresh"')
    // The body is still the lesson's HTML, and the document still closes properly.
    expect(srcdoc).toContain("<body><b>Hi</b></body></html>")
  })
})
