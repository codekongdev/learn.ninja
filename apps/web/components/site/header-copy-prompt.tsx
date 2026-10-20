"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

import { AGENT_PROMPT, HERO_CTA_ID } from "@/lib/site"

import { CopyButton } from "./copy-button"

/**
 * A small "Copy prompt for agent" for the header. With `afterHero` (the home page) it
 * shows only once the hero's own button has scrolled under the header. Phones don't get it:
 * next to the wordmark and the nav it doesn't fit in 375px, and while it's hidden it would
 * still take its width, pushing the nav past the edge and making the page scroll sideways.
 * The hero and "Get started" have the full button.
 */
export function HeaderCopyPrompt({
  afterHero = false,
}: {
  afterHero?: boolean
}) {
  const [shown, setShown] = React.useState(!afterHero)

  React.useEffect(() => {
    if (!afterHero) return
    const target = document.getElementById(HERO_CTA_ID)
    if (!target) return
    const top = document.querySelector("header")?.offsetHeight ?? 0
    const observer = new IntersectionObserver(
      ([entry]) =>
        setShown(!entry!.isIntersecting && entry!.boundingClientRect.top < top),
      { rootMargin: `-${top}px 0px 0px 0px` }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [afterHero])

  return (
    <div
      inert={!shown}
      className={cn(
        "shrink-0 transition-[opacity,translate] duration-200 max-sm:hidden",
        !shown && "pointer-events-none opacity-0 motion-safe:translate-y-2"
      )}
    >
      <CopyButton text={AGENT_PROMPT} variant="ghost" size="sm">
        Copy prompt for agent
      </CopyButton>
    </div>
  )
}
