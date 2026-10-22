"use client"

import * as React from "react"

import { emptyPrepared, type Prepared } from "./prepared"
import { stringsFor, type Strings } from "./strings"

interface PlayerContextValue {
  prepared: Prepared
  t: Strings
  /** The player's UI language code, for text that isn't in Strings (the ninja's voices). */
  lang?: string
  dir: "ltr" | "rtl"
  /** URL of the stylesheet lesson visuals load inside their sandbox (Basecoat + Tailwind). */
  visualsCss: string
  /** Only take keyboard shortcuts (Enter, number keys) from inside this element, for several demos on one page. */
  keyScope?: React.RefObject<HTMLElement | null>
  /** The prompt the wrap-up copies to make its suggested next lesson. Without it there's no copy button. */
  nextPrompt?: (topic: string, after: string) => string
  /** The wrap-up's like. Without it there's no heart. */
  like?: LessonLike
}

/** A published lesson's likes, and the learner's, for the heart on the wrap-up. */
export interface LessonLike {
  likes: number
  liked: boolean
  /**
   * Likes the lesson (true) or takes the like back, resolving to the lesson's new count or an
   * error. Omit it when the learner is logged out: pressing the heart then offers `loginHref`.
   */
  onChange?: (liked: boolean) => Promise<{ likes?: number; error?: string }>
  /** Where a logged-out learner logs in, coming back to this lesson. */
  loginHref?: string
}

const PlayerContext = React.createContext<PlayerContextValue>({
  prepared: emptyPrepared,
  t: stringsFor("en"),
  dir: "ltr",
  visualsCss: "/lesson-visuals.css",
})

export const PlayerProvider = PlayerContext.Provider
export const usePlayer = () => React.useContext(PlayerContext)

/** Tracks the app's dark mode (the `dark` class on <html>, set by next-themes or Storybook). */
export function useIsDark(): boolean {
  const [dark, setDark] = React.useState(false)
  React.useEffect(() => {
    const root = document.documentElement
    const update = () => setDark(root.classList.contains("dark"))
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])
  return dark
}
