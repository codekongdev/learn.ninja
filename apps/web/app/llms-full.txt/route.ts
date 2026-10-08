import { llmsFullTxt } from "@/lib/llm"

export const dynamic = "force-static"

export async function GET() {
  return new Response(await llmsFullTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
