"use client"

import { Skeleton } from "@workspace/ui/components/skeleton"
import { Tooltip, TooltipTrigger } from "@workspace/ui/components/tooltip"

import type { Greeting } from "@/lib/explore/greeting"

/**
 * The sensei's hello above the feed, on one line: "Konbanwa, still time." The Japanese word has a
 * faint dotted underline, the usual hint for a word with a definition, and its English on hover or
 * focus.
 */
export function ExploreGreeting({ greeting }: { greeting: Greeting }) {
  return (
    <p className="text-2xl font-semibold">
      <TooltipTrigger delay={300}>
        <i
          lang="ja-Latn"
          tabIndex={0}
          className="cursor-help rounded-sm underline decoration-muted-foreground/40 decoration-dotted decoration-1 underline-offset-6 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {greeting.word}
        </i>
        <Tooltip>{greeting.meaning}</Tooltip>
      </TooltipTrigger>
      , {greeting.line}.
    </p>
  )
}

/** The greeting's line while the page loads, so the feed doesn't move when it arrives. */
export function ExploreGreetingSkeleton() {
  // One 32px line of text-2xl.
  return <Skeleton aria-hidden="true" className="my-1 h-6 w-64" />
}
