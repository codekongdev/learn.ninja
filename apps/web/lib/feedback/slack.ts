import { SITE } from "@/lib/site"

// Feedback from the header's bug button goes to a Slack channel through an incoming webhook
// (SLACK_FEEDBACK_WEBHOOK_URL). Without it, it's printed to the server console instead.

export interface FeedbackMail {
  message: string
  /** The page it was sent from, as the browser saw it. */
  url: string
  /** The published lesson open at the time, if any. */
  lessonId?: string
  /** Who sent it: the account's handle or email, or null for a visitor. */
  from: { handle: string | null; email: string } | null
  userAgent: string
  viewport?: string
  timeZone?: string
  /** A short hash of the sender's IP, to spot repeats without keeping the address. */
  clientHash: string
}

export type FeedbackSender = (feedback: FeedbackMail) => Promise<void>

export function feedbackSenderFromEnv(env = process.env): FeedbackSender {
  const webhook = env.SLACK_FEEDBACK_WEBHOOK_URL
  if (!webhook) {
    return async (feedback) => {
      console.log(`[${SITE.name}] Feedback:\n${feedbackText(feedback)}`)
    }
  }
  return async (feedback) => {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(slackPayload(feedback)),
    })
    if (!res.ok) {
      throw new Error(`Slack replied ${res.status}: ${await res.text()}`)
    }
  }
}

/** Slack treats &, < and > as markup, so user text has them escaped. */
export function slackEscape(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function sender(feedback: FeedbackMail): string {
  if (!feedback.from) return `a visitor (${feedback.clientHash})`
  return feedback.from.handle
    ? `@${feedback.from.handle} (${feedback.from.email})`
    : feedback.from.email
}

/** The message: what they wrote as a quote, then where and who it came from. */
export function slackPayload(feedback: FeedbackMail) {
  const quoted = slackEscape(feedback.message)
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n")
  const details = [
    `*Page:* <${slackEscape(feedback.url).replace(/\|/g, "%7C")}|${slackEscape(feedback.url)}>`,
    feedback.lessonId ? `*Lesson:* ${slackEscape(feedback.lessonId)}` : null,
    `*From:* ${slackEscape(sender(feedback))}`,
    `*Browser:* ${slackEscape(feedback.userAgent || "unknown")}`,
    feedback.viewport || feedback.timeZone
      ? `*Screen:* ${[feedback.viewport, feedback.timeZone]
          .filter(Boolean)
          .map((v) => slackEscape(v!))
          .join(" · ")}`
      : null,
  ].filter(Boolean)
  return {
    // The notification's preview text.
    text: `New feedback: ${slackEscape(feedback.message.slice(0, 120))}`,
    blocks: [
      { type: "section", text: { type: "mrkdwn", text: quoted } },
      {
        type: "context",
        elements: details.map((text) => ({ type: "mrkdwn", text })),
      },
    ],
  }
}

/** The plain-text version, for the console. */
export function feedbackText(feedback: FeedbackMail): string {
  return [
    feedback.message,
    "",
    `Page: ${feedback.url}`,
    feedback.lessonId ? `Lesson: ${feedback.lessonId}` : null,
    `From: ${sender(feedback)}`,
    `Browser: ${feedback.userAgent || "unknown"}`,
    feedback.viewport ? `Viewport: ${feedback.viewport}` : null,
    feedback.timeZone ? `Time zone: ${feedback.timeZone}` : null,
  ]
    .filter((line) => line !== null)
    .join("\n")
}
