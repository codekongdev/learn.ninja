import { notFound } from "next/navigation"

import { pageMarkdown } from "@/lib/llm"
import { source } from "@/lib/source"

// Each docs page as Markdown. Reached through rewrites: /docs/{page}.md, or /docs/{page} without Accept: text/html.

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source.generateParams()
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const page = source.getPage((await params).slug)
  if (!page) notFound()
  return new Response(await pageMarkdown(page), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
