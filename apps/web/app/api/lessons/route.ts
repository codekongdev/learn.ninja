import { publishLesson } from "@/lib/publish/handlers"
import { clientKey, depsFor } from "@/lib/publish/request"

// POST /api/lessons: publish a lesson file. Returns its link and a secret edit token.

export async function POST(req: Request) {
  const reply = await publishLesson(
    {
      text: await req.text(),
      client: clientKey(req),
      skillVersion: req.headers.get("x-learn-skill-version"),
    },
    depsFor(req)
  )
  return Response.json(reply.body, { status: reply.status })
}
