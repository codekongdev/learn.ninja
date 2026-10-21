import { Skeleton } from "@workspace/ui/components/skeleton"

import type { Greeting } from "@/lib/explore/greeting"

/** The sensei's hello above the feed, on one line: "Konbanwa, still time." */
export function ExploreGreeting({ greeting }: { greeting: Greeting }) {
  return (
    <p className="text-2xl font-semibold">
      <i lang="ja-Latn">{greeting.word}</i>, {greeting.line}.
    </p>
  )
}

/** The greeting's line while the page loads, so the feed doesn't move when it arrives. */
export function ExploreGreetingSkeleton() {
  // One 32px line of text-2xl.
  return <Skeleton aria-hidden="true" className="my-1 h-6 w-64" />
}
