import { checkLesson } from "@/lib/publish/handlers"
import { clientKey } from "@/lib/publish/request"
import { getRateLimiter } from "@/lib/publish/rate-limit"
import { respond } from "@/lib/publish/respond"

// POST /api/validate: check a lesson file with the rules publishing uses, without publishing it.
// The CLI's `validate` calls this so every install checks with the newest rules.

export async function POST(req: Request) {
  return respond(async () =>
    checkLesson(
      {
        text: await req.text(),
        client: clientKey(req),
        skillVersion: req.headers.get("x-learn-skill-version"),
      },
      { limiter: getRateLimiter("validate") }
    )
  )
}
