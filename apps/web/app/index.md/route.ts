import { homeMarkdown } from "@/lib/llm"

// The home page as Markdown. Also what `curl https://learn.ninja` gets (see the rewrites in next.config.ts).

export const dynamic = "force-static"

export function GET() {
  return new Response(homeMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
