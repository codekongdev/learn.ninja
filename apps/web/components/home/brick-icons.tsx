import type { Brick, Lesson } from "@workspace/spec"
import { cn } from "@workspace/ui/lib/utils"

// Each brick type as a small abstract shape, so a lesson's rhythm can be shown without words.

type Kind = Brick["type"]

const ICONS: Record<Kind, React.ReactNode> = {
  // A short paragraph.
  concept: (
    <>
      <rect x="4" y="6" width="16" height="2" rx="1" />
      <rect x="4" y="11" width="12" height="2" rx="1" />
      <rect x="4" y="16" width="14" height="2" rx="1" />
    </>
  ),
  // Three rows, one filled.
  choice: (
    <>
      <rect x="4" y="4" width="16" height="4" rx="1.5" className="opacity-40" />
      <rect x="4" y="10" width="16" height="4" rx="1.5" />
      <rect
        x="4"
        y="16"
        width="16"
        height="4"
        rx="1.5"
        className="opacity-40"
      />
    </>
  ),
  // Two cards side by side.
  compare: (
    <>
      <rect x="3" y="5" width="8" height="14" rx="1.5" className="opacity-40" />
      <rect x="13" y="5" width="8" height="14" rx="1.5" />
    </>
  ),
  // A target on a surface.
  hotspot: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" className="opacity-25" />
      <circle cx="15" cy="12" r="4.5" className="opacity-40" />
      <circle cx="15" cy="12" r="2" />
    </>
  ),
  // Two columns of blocks.
  sort: (
    <>
      <rect x="3" y="4" width="8" height="3" rx="1" />
      <rect x="3" y="9" width="8" height="3" rx="1" />
      <rect x="13" y="4" width="8" height="3" rx="1" className="opacity-40" />
      <rect x="13" y="9" width="8" height="3" rx="1" className="opacity-40" />
      <rect x="13" y="14" width="8" height="3" rx="1" className="opacity-40" />
    </>
  ),
  // A numbered stack.
  order: (
    <>
      <circle cx="6" cy="6" r="2" />
      <rect x="10" y="5" width="11" height="2" rx="1" className="opacity-40" />
      <circle cx="6" cy="12" r="2" />
      <rect x="10" y="11" width="11" height="2" rx="1" className="opacity-40" />
      <circle cx="6" cy="18" r="2" />
      <rect x="10" y="17" width="11" height="2" rx="1" className="opacity-40" />
    </>
  ),
  // Pairs joined across a gap.
  match: (
    <>
      <rect x="3" y="5" width="6" height="3" rx="1" />
      <rect x="15" y="5" width="6" height="3" rx="1" />
      <rect x="9" y="6" width="6" height="1" className="opacity-40" />
      <rect x="3" y="15" width="6" height="3" rx="1" />
      <rect x="15" y="15" width="6" height="3" rx="1" />
      <rect x="9" y="16" width="6" height="1" className="opacity-40" />
    </>
  ),
  // A line of text with a chip in the gap.
  blank: (
    <>
      <rect x="3" y="11" width="5" height="2" rx="1" className="opacity-40" />
      <rect x="9" y="8" width="7" height="8" rx="2" />
      <rect x="17" y="11" width="4" height="2" rx="1" className="opacity-40" />
    </>
  ),
  // A fork: one path, three outcomes.
  scenario: (
    <>
      <circle cx="5" cy="12" r="2.5" />
      <rect x="8" y="11" width="5" height="2" className="opacity-40" />
      <circle cx="18" cy="5" r="2" className="opacity-40" />
      <circle cx="18" cy="12" r="2" />
      <circle cx="18" cy="19" r="2" className="opacity-40" />
    </>
  ),
  number: (
    <>
      <rect x="4" y="9" width="16" height="6" rx="1.5" />
    </>
  ),
}

export function BrickIcon({
  type,
  className,
}: {
  type: Kind
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-6 shrink-0", className)}
    >
      {ICONS[type]}
    </svg>
  )
}

/** A lesson's shape as a row of brick icons: the hook, each concept and its practice, the challenge. */
export function RhythmStrip({ lesson }: { lesson: Lesson }) {
  const bricks: Brick[] = [lesson.hook, ...lesson.bricks, lesson.challenge]
  return (
    <ol
      aria-label={`${bricks.length} bricks`}
      className="flex flex-wrap items-center gap-1.5"
    >
      {bricks.map((b, i) => (
        <li
          key={b.id}
          title={b.type}
          className={cn(
            "grid size-7 place-items-center rounded-md border",
            b.type === "concept"
              ? "bg-muted text-muted-foreground"
              : "bg-background text-foreground dark:bg-input/30",
            i === bricks.length - 1 && "border-primary"
          )}
        >
          <BrickIcon type={b.type} className="size-4" />
        </li>
      ))}
    </ol>
  )
}
