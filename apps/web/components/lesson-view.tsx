"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import {
  LessonPlayer,
  type LessonPlayerProps,
  type Theme,
} from "@workspace/player"

/** The lesson player with the footer's theme setting connected to next-themes. */
export function LessonView(props: LessonPlayerProps) {
  const { theme, setTheme } = useTheme()
  // next-themes only knows the saved theme after mounting; show "System" until then.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <LessonPlayer
      docsHref="/docs"
      {...props}
      theme={mounted ? ((theme as Theme | undefined) ?? "system") : "system"}
      onThemeChange={setTheme}
    />
  )
}
