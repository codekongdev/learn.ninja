"use client"

import { CircleCheckIcon } from "lucide-react"

import { Tooltip, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

const when = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
})

/**
 * Done beside a solid green check, in place of the length on the row of a lesson the viewer has
 * finished, with when they first finished it on hover or focus. The time is formatted only when
 * the tooltip opens, in the browser, so it's in the viewer's own time zone and the server's render
 * never disagrees with it.
 */
export function CompletedCheck({
  at,
  className,
}: {
  /** When the viewer first finished the lesson, in ms since epoch. */
  at: number
  className?: string
}) {
  return (
    <TooltipTrigger delay={300}>
      <span
        tabIndex={0}
        className={cn(
          "flex shrink-0 items-center gap-1 rounded-sm text-green-700 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:text-green-500",
          className
        )}
      >
        <CircleCheckIcon
          className="size-3.5 fill-green-600 text-background"
          aria-hidden="true"
        />
        Done
      </span>
      <Tooltip>Completed {when.format(at)}</Tooltip>
    </TooltipTrigger>
  )
}
