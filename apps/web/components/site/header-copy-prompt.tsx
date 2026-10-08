"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

import { AGENT_PROMPT, HERO_CTA_ID } from "@/lib/site"

import { CopyButton } from "./copy-button"

/** A small "Copy prompt for agent" for the header, shown once the hero's button has scrolled under it. */
export function HeaderCopyPrompt() {
  const [shown, setShown] = React.useState(false)

  React.useEffect(() => {
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
  }, [])

  // The column grows from nothing so Docs slides over instead of leaving a gap, and
  // the padding cancelled by negative margins keeps the focus ring from being clipped.
  return (
    <div
      inert={!shown}
      className={cn(
        "grid transition-[grid-template-columns,margin,opacity] duration-200",
        shown ? "grid-cols-[1fr]" : "-ms-2 grid-cols-[0fr] opacity-0"
      )}
    >
      <div className="-m-1 min-w-0 overflow-hidden p-1">
        <CopyButton text={AGENT_PROMPT} size="sm">
          <span className="sm:hidden">Copy prompt</span>
          <span className="max-sm:hidden">Copy prompt for agent</span>
        </CopyButton>
      </div>
    </div>
  )
}
