"use client"

import * as React from "react"

import { emptyPrepared, type Prepared } from "./prepared"
import { stringsFor, type Strings } from "./strings"

interface PlayerContextValue {
  prepared: Prepared
  t: Strings
  dir: "ltr" | "rtl"
  /** URL of the stylesheet lesson visuals load inside their sandbox (Basecoat + Tailwind). */
  visualsCss: string
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
