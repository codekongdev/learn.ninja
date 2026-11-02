import { sendFeedback } from "@/lib/feedback/handlers"
import { feedbackSenderFromEnv } from "@/lib/feedback/slack"
import { getRateLimiter } from "@/lib/publish/rate-limit"
import { actorFor, clientKey } from "@/lib/publish/request"
import { respond } from "@/lib/publish/respond"

// POST /api/feedback with { "message": "…", "url", "lessonId?", "viewport?", "timeZone?" }: the
// header's bug button. Anyone can send it; it goes to Slack. Rate-limited per client.

export async function POST(req: Request) {
  return respond(async () => {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    // A bad session shouldn't stop a bug report, so it's sent as a visitor's instead.
    const actor = await actorFor(req).catch(() => null)
    return sendFeedback(
      {
        body,
        client: clientKey(req),
        userAgent: req.headers.get("user-agent") ?? "",
        from: actor ? { handle: actor.handle, email: actor.email } : null,
      },
      {
        limiter: getRateLimiter("feedback"),
        send: feedbackSenderFromEnv(),
        origin: process.env.LEARN_PUBLIC_URL ?? new URL(req.url).origin,
      }
    )
  })
}
