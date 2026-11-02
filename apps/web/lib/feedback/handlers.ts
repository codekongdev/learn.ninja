import { hashToken } from "@/lib/publish/ids"
import type { RateLimiter } from "@/lib/publish/rate-limit"
import type { Reply } from "@/lib/publish/handlers"

import { FEEDBACK_MAX } from "./browser"
import type { FeedbackMail, FeedbackSender } from "./slack"

export interface FeedbackDeps {
  limiter: RateLimiter
  send: FeedbackSender
  /** The site's own origin: a page URL from anywhere else is dropped. */
  origin: string
}

export interface FeedbackRequest {
  body: Record<string, unknown>
  client: string
  userAgent: string
  from: FeedbackMail["from"]
}

/** A short string from the body, or undefined when it's missing or not a string. */
function field(value: unknown, max: number): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim().slice(0, max)
    : undefined
}

/** The path and query of the page it came from, or "/" when there's no usable URL. */
function pagePath(url: string | undefined): string {
  if (!url) return "/"
  try {
    const { pathname, search } = new URL(url)
    return pathname + search
  } catch {
    return "/"
  }
}

/** Takes feedback from the bug button (anyone can send it) and passes it on to Slack. */
export async function sendFeedback(
  req: FeedbackRequest,
  deps: FeedbackDeps
): Promise<Reply> {
  if (!(await deps.limiter.allow(req.client))) {
    return {
      status: 429,
      body: {
        ok: false,
        error: "rate_limited",
        message:
          "That's a lot of feedback from here recently. Try again later.",
      },
    }
  }
  const message =
    typeof req.body.message === "string" ? req.body.message.trim() : ""
  if (!message || message.length > FEEDBACK_MAX) {
    return {
      status: 400,
      body: {
        ok: false,
        error: "bad_request",
        message: `Say what happened in up to ${FEEDBACK_MAX} characters.`,
      },
    }
  }
  const url = pagePath(field(req.body.url, 500))
  await deps.send({
    message,
    // The page's path on this site's own origin, so the message never carries someone else's link.
    url: deps.origin + url,
    lessonId: field(req.body.lessonId, 64),
    from: req.from,
    userAgent: req.userAgent.slice(0, 300),
    viewport: field(req.body.viewport, 20),
    timeZone: field(req.body.timeZone, 64),
    clientHash: hashToken(req.client).slice(0, 12),
  })
  return { status: 200, body: { ok: true } }
}
