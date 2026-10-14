import type { Lesson } from "@workspace/spec"

import type { State } from "./lesson-player"

// Where a learner is in a lesson, kept in the browser so reopening the page (or reloading it)
// carries on from the same screen instead of the intro. One entry per lesson, keyed by the page.

const PREFIX = "learn:progress:"
/** Saved progress older than this is dropped the next time any lesson loads. */
const KEEP_MS = 7 * 24 * 3.6e6

interface Saved {
  v: 1
  /** The lesson's content when the progress was saved; a changed lesson starts over. */
  fingerprint: string
  savedAt: number
  state: State
}

/** A short hash (FNV-1a) of the lesson's teaching content: the title and summary may change freely. */
export function fingerprint(lesson: Lesson): string {
  const text = JSON.stringify([lesson.hook, lesson.bricks, lesson.challenge])
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16)
}

/**
 * The saved state for this lesson, or null when there is none, it's for other content, or it
 * doesn't look like a state. Also drops entries for every lesson that haven't been touched in a week.
 */
export function loadProgress(
  storage: Storage,
  key: string,
  lesson: Lesson
): State | null {
  try {
    prune(storage)
    const raw = storage.getItem(PREFIX + key)
    if (!raw) return null
    const saved = JSON.parse(raw) as Partial<Saved>
    if (saved.v !== 1 || saved.fingerprint !== fingerprint(lesson)) return null
    const state = saved.state
    if (
      !state ||
      !Array.isArray(state.items) ||
      typeof state.index !== "number" ||
      !state.items[state.index]
    )
      return null
    return state
  } catch {
    // Storage can be blocked or hold something else; the lesson starts fresh.
    return null
  }
}

/**
 * Keep the state, or forget it once there's nothing to come back to: the intro (untouched) or the
 * wrap-up (finished), so the next visit starts the lesson afresh.
 */
export function saveProgress(
  storage: Storage,
  key: string,
  lesson: Lesson,
  state: State
) {
  try {
    const item = state.items[state.index]
    if (!item || item.kind === "intro" || item.kind === "wrap") {
      storage.removeItem(PREFIX + key)
      return
    }
    const saved: Saved = {
      v: 1,
      fingerprint: fingerprint(lesson),
      savedAt: Date.now(),
      state,
    }
    storage.setItem(PREFIX + key, JSON.stringify(saved))
  } catch {
    // Not saved (blocked or full); the lesson still plays on.
  }
}

function prune(storage: Storage) {
  const stale: string[] = []
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)
    if (!key?.startsWith(PREFIX)) continue
    try {
      const saved = JSON.parse(storage.getItem(key) ?? "") as Partial<Saved>
      if (
        typeof saved.savedAt !== "number" ||
        Date.now() - saved.savedAt > KEEP_MS
      )
        stale.push(key)
    } catch {
      stale.push(key)
    }
  }
  for (const key of stale) storage.removeItem(key)
}
