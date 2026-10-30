"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

import { flipsTheme } from "@/lib/theme-hotkey"

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      // Dark for everyone until the theme has a setting again; D still flips it while developing.
      forcedTheme={process.env.NODE_ENV === "development" ? undefined : "dark"}
      disableTransitionOnChange
      {...props}
    >
      {/* D flips the theme while developing; learners shouldn't trip over it. */}
      {process.env.NODE_ENV === "development" ? <ThemeHotkey /> : null}
      {children}
    </NextThemesProvider>
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!flipsTheme(event, document)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider }
