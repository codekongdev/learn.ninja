import { updateLesson } from "@/lib/publish/handlers"
import { clientKey, depsFor } from "@/lib/publish/request"

// PUT /api/lessons/{id}: replace a published lesson, keeping its link and expiry.
// Needs the edit token from publishing: Authorization: Bearer <token>

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = req.headers.get("authorization")
  const reply = await updateLesson(
    {
      id: (await params).id,
      editToken: auth?.startsWith("Bearer ") ? auth.slice(7) : null,
      text: await req.text(),
      client: clientKey(req),
      skillVersion: req.headers.get("x-learn-skill-version"),
    },
    depsFor(req)
  )
  return Response.json(reply.body, { status: reply.status })
}
