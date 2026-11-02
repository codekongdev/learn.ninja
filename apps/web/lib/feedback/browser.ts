// What the bug button calls from the browser. The dialog takes it as a prop so Storybook can hand
// it a fake.

/** How long feedback can be. */
export const FEEDBACK_MAX = 2000

export interface FeedbackApi {
  send(message: string, lessonId?: string): Promise<{ error?: string }>
}

export const feedbackApi: FeedbackApi = {
  async send(message, lessonId) {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message,
        lessonId,
        // The context a bug report needs, so the sender doesn't have to type it.
        url: window.location.href,
        viewport: `${window.innerWidth}×${window.innerHeight}`,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    }).catch(() => null)
    if (!res)
      return { error: "Couldn't reach the server. Check your connection." }
    const reply = (await res.json().catch(() => null)) as {
      ok?: boolean
      message?: string
    } | null
    return reply?.ok
      ? {}
      : { error: reply?.message ?? `The server replied HTTP ${res.status}.` }
  },
}
