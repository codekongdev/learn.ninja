"use client"

import { Skeleton } from "@workspace/ui/components/skeleton"
import { Tooltip, TooltipTrigger } from "@workspace/ui/components/tooltip"

import type { Greeting } from "@/lib/explore/greeting"

/**
 * The dotted underline, drawn as a background: a text-decoration's dots are as long as the line is
 * thick, packed tight, so this sets its own: 2px round dots, 6px apart, at the bottom of the padding.
 */
const DOTS =
  "bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-muted-foreground)_35%,transparent)_1px,transparent_1.5px)] bg-size-[6px_2px] bg-bottom-left bg-repeat-x pb-1"

/**
 * The sensei's hello above the feed, on one line: "Konbanwa, still time." The Japanese word has a
 * faint dotted underline, the usual hint for a word with a definition, and its English on hover or
 * focus. The negative margin pulls the feed up: the page's 32px gap plus the first row's padding
 * read as too much air under one line. `children` sit at the line's end (an active filter, say),
 * and wrap under it on a phone.
 */
export function ExploreGreeting({
  greeting,
  children,
}: {
  greeting: Greeting
  children?: React.ReactNode
}) {
  return (
    <div className="-mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <p className="text-2xl font-semibold">
        <TooltipTrigger delay={300}>
          <i
            lang="ja-Latn"
            tabIndex={0}
            className={`cursor-help rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${DOTS}`}
          >
            {greeting.word}
          </i>
          <Tooltip>{greeting.meaning}</Tooltip>
        </TooltipTrigger>
        , {greeting.line}.
      </p>
      {children}
    </div>
  )
}

/** The greeting's line while the page loads, so the feed doesn't move when it arrives. */
export function ExploreGreetingSkeleton() {
  // One 32px line of text-2xl, less the greeting's -mb-3.
  return <Skeleton aria-hidden="true" className="mt-1 -mb-2 h-6 w-64" />
}
