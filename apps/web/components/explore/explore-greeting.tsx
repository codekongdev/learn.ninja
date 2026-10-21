import { Skeleton } from "@workspace/ui/components/skeleton"

import type { Greeting } from "@/lib/explore/greeting"

/** The sensei's hello above the feed: "Ohayō." with a short line under it. */
export function ExploreGreeting({ greeting }: { greeting: Greeting }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-2xl font-semibold">
        <i lang="ja-Latn">{greeting.word}</i>.
      </p>
      <p className="text-sm text-muted-foreground">{greeting.line}</p>
    </div>
  )
}

/** The greeting's two lines while the page loads, so the feed doesn't move when it arrives. */
export function ExploreGreetingSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-1">
      {/* One 32px line of text-2xl, then one 20px line of text-sm. */}
      <Skeleton className="my-1 h-6 w-36" />
      <Skeleton className="my-[3px] h-3.5 w-24" />
    </div>
  )
}
