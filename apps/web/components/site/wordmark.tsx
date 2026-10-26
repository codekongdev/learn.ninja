import Link from "next/link"

import { cn } from "@workspace/ui/lib/utils"

import { SITE } from "@/lib/site"

import { LivelyLogo } from "./lively-logo"

/** The logo and the lowercase name, linking home (or wherever `href` says). */
export function Wordmark({
  href = "/",
  className,
}: {
  href?: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md text-base font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
    >
      {/* The same 28px box and 22px mark as the player header's home button, so the two line up.
          Only the site's mark looks around; the player's stays still. */}
      <span className="grid size-7 shrink-0 place-items-center self-center">
        <LivelyLogo className="size-5.5" />
      </span>
      {SITE.name}
    </Link>
  )
}
