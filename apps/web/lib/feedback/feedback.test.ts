import { describe, expect, it } from "vitest"

import { MemoryRateLimiter } from "@/lib/publish/rate-limit"

import { sendFeedback } from "./handlers"
import { slackEscape, slackPayload, type FeedbackMail } from "./slack"

const ORIGIN = "https://learn.ninja"

function setup(limit = 10) {
  const sent: FeedbackMail[] = []
  const deps = {
    limiter: new MemoryRateLimiter(limit, 60_000),
    send: async (f: FeedbackMail) => {
      sent.push(f)
    },
    origin: ORIGIN,
  }
  return { sent, deps }
}

const base = { client: "1.2.3.4", userAgent: "Firefox", from: null }

describe("sendFeedback", () => {
  it("passes the message and its context on", async () => {
    const { sent, deps } = setup()
    const reply = await sendFeedback(
      {
        ...base,
        from: { handle: "ada", email: "ada@example.com" },
        body: {
          message: "  Check does nothing  ",
          url: `${ORIGIN}/l/x-abc`,
          lessonId: "abc",
          viewport: "390×844",
          timeZone: "Europe/Rome",
        },
      },
      deps
    )
    expect(reply.status).toBe(200)
    expect(sent[0]).toMatchObject({
      message: "Check does nothing",
      url: `${ORIGIN}/l/x-abc`,
      lessonId: "abc",
      from: { handle: "ada" },
      viewport: "390×844",
    })
    expect(sent[0]!.clientHash).toHaveLength(12)
  })

  it("refuses an empty or overlong message", async () => {
    const { sent, deps } = setup()
    for (const message of ["   ", "x".repeat(2001), 42]) {
      const reply = await sendFeedback({ ...base, body: { message } }, deps)
      expect(reply.status).toBe(400)
    }
    expect(sent).toHaveLength(0)
  })

  it("keeps only the page's path, on this site's origin", async () => {
    const { sent, deps } = setup()
    await sendFeedback(
      { ...base, body: { message: "hi", url: "https://evil.example/x" } },
      deps
    )
    await sendFeedback(
      { ...base, body: { message: "hi", url: "not a url" } },
      deps
    )
    expect(sent.map((f) => f.url)).toEqual([`${ORIGIN}/x`, `${ORIGIN}/`])
  })

  it("rate-limits per client", async () => {
    const { deps } = setup(1)
    const req = { ...base, body: { message: "hi" } }
    expect((await sendFeedback(req, deps)).status).toBe(200)
    expect((await sendFeedback(req, deps)).status).toBe(429)
  })
})

describe("slackPayload", () => {
  it("escapes the sender's text so it can't mention or link", () => {
    expect(slackEscape("<!channel> & <http://x|y>")).toBe(
      "&lt;!channel&gt; &amp; &lt;http://x|y&gt;"
    )
    const payload = slackPayload({
      message: "<!here> broke\nsecond line",
      url: `${ORIGIN}/explore`,
      from: null,
      userAgent: "Safari",
      clientHash: "abcdef123456",
    })
    const text = JSON.stringify(payload)
    expect(text).not.toContain("<!here>")
    expect(payload.blocks[0]!.text!.text).toBe(
      "> &lt;!here&gt; broke\n> second line"
    )
    expect(text).toContain("a visitor (abcdef123456)")
  })
})
