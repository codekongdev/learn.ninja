import { XIcon } from "lucide-react"

import { LinkButton } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

/**
 * The tag Explore is narrowed to, at the end of the greeting's line: how many lessons it has, then
 * the tag as a pill whose whole surface clears the filter (back to /explore). `more` says the list
 * stopped at a page, so the count reads "30+".
 */
export function TagFilter({
  label,
  count,
  more = false,
  className,
}: {
  label: string
  count: number
  more?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 text-sm text-muted-foreground",
        className
      )}
    >
      <span className="tabular-nums">
        {count}
        {more ? "+" : ""} {count === 1 && !more ? "lesson" : "lessons"}
      </span>
      <LinkButton
        href="/explore"
        variant="outline"
        size="sm"
        aria-label={`Clear filter: ${label}`}
        className="rounded-full ps-3 text-foreground"
      >
        <bdi>{label}</bdi>
        <XIcon data-icon="inline-end" className="text-muted-foreground" />
      </LinkButton>
    </div>
  )
}
