"use client"

import { cn } from "cn"
import { Keyboard as KbdPrimitive } from "react-aria-components"

// An outlined keycap with no fill, so it keeps its shape on a hovered or selected surface, which
// takes the muted fill shadcn's default key has. Our tooltips aren't inverted, so it needs no
// tooltip colors of its own.
function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <KbdPrimitive
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm border px-1 font-sans text-xs font-medium text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <KbdPrimitive
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
