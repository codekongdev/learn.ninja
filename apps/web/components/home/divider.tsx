import { LearnLogo } from "@workspace/player"

/** Between sections: a dotted rule with the mark in the middle. */
export function Divider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto flex w-full max-w-3xl items-center gap-4 px-4 sm:px-6"
    >
      <span className="h-px flex-1 border-t border-dotted border-foreground/20" />
      <LearnLogo className="size-4 text-foreground/40" />
      <span className="h-px flex-1 border-t border-dotted border-foreground/20" />
    </div>
  )
}
