import Link from "next/link"

import { LearnLogo } from "@workspace/player"
import { cn } from "@workspace/ui/lib/utils"

import { SITE } from "@/lib/site"

/** The logo and the lowercase name, linking home. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 rounded-md text-base font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      <LearnLogo className="size-6" />
      {SITE.name}
    </Link>
  )
}
