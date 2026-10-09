"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import {
  LessonPlayer,
  type LessonPlayerProps,
  type Theme,
} from "@workspace/player"

/**
 * The lesson player with the footer's theme setting connected to next-themes. A page that doesn't
 * pass `uiLanguage` (the prerendered /lessons pages) still honors ?ui=, read after mounting, the
 * same moment the player loads saved preferences, so the page can stay static.
 */
export function LessonView(props: LessonPlayerProps) {
  const { theme, setTheme } = useTheme()
  // next-themes only knows the saved theme after mounting; show "System" until then.
  const [mounted, setMounted] = React.useState(false)
  const [urlLanguage, setUrlLanguage] = React.useState<string>()
  React.useEffect(() => {
    setMounted(true)
    setUrlLanguage(
      new URLSearchParams(window.location.search).get("ui") ?? undefined
    )
  }, [])
  return (
    <LessonPlayer
      visualsCss={process.env.NEXT_PUBLIC_VISUALS_CSS}
      docsHref="/docs"
      privacyHref="/privacy"
      termsHref="/terms"
      {...props}
      uiLanguage={props.uiLanguage ?? urlLanguage}
      theme={mounted ? ((theme as Theme | undefined) ?? "system") : "system"}
      onThemeChange={setTheme}
    />
  )
}
