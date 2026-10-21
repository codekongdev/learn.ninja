// The line at the top of Explore: the Japanese greeting for the time of day, then a short sensei
// line under it. Pure, so it's tested without a request.

export interface Greeting {
  /** The greeting in romaji: shown with lang="ja-Latn" so screen readers say it as Japanese. */
  word: string
  line: string
}

/**
 * The visitor's hour (0–23) in `timeZone`, the IANA name Vercel sends as `x-vercel-ip-timezone`.
 * Without one (local development) or with a name Intl doesn't know, the server's own hour.
 */
export function localHour(now: Date, timeZone: string | null): number {
  if (timeZone) {
    try {
      const hour = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        hourCycle: "h23",
        timeZone,
      }).format(now)
      return Number(hour)
    } catch {
      // An unknown zone: fall through to the server's hour.
    }
  }
  return now.getHours()
}

/**
 * Morning until noon, day until 6pm, evening after that. Late night (10pm to 5am) is still
 * evening in Japanese: oyasumi is only said when leaving for bed, never on arriving.
 */
export function greetingFor(hour: number): Greeting {
  if (hour >= 5 && hour < 12) return { word: "Ohayō", line: "Fresh mind." }
  if (hour >= 12 && hour < 18)
    return { word: "Konnichiwa", line: "Welcome back." }
  if (hour >= 18 && hour < 22) return { word: "Konbanwa", line: "Still time." }
  return { word: "Konbanwa", line: "Quiet hours." }
}
