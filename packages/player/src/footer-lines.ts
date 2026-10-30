// What the ninja says in the site's footer, in his Sensei voice. A module of its own, with its own
// small clip table, so every page can have them without pulling in the player or his lesson lines.
// After changing them, run `npm run voice -w @workspace/player`.

import footerClips from "./footer-clips.json"

/** What he says before anyone clicks him, shown but not spoken. */
export const FOOTER_GREETING = "Good. You scrolled this far."

/** What he says on each click, in order, starting over after the last. */
export const FOOTER_LINES = [
  "Begin with the prompt.",
  "A lesson needs a student.",
  "You click well. Now learn.",
  "The prompt is patient. I am less so.",
  "The dojo is open.",
]

/** The URL of a footer line's clip, or null for a line he doesn't speak. */
export function footerClip(line: string): string | null {
  const clip = (footerClips as Record<string, string>)[line]
  return clip ? `/voice/en/${clip}.mp3` : null
}
