"use client"

import type * as React from "react"
import { cn } from "cn"
import {
  ToggleButton as ToggleButtonPrimitive,
  type ToggleButtonProps as ToggleButtonPrimitiveProps,
} from "react-aria-components"

/**
 * A pressable element that can be selected: answer options, chips, blank gaps, and code lines.
 * Exposes React Aria's state as data attributes for styling: data-selected, data-pressed,
 * data-focus-visible, data-disabled. Pass data-status ("correct" | "wrong" | "partial") to mark answers.
 */
function Selectable({
  className,
  ...props
}: Omit<ToggleButtonPrimitiveProps, "className"> &
  React.RefAttributes<HTMLButtonElement> & {
    className?: string
    "data-status"?: string
    lang?: string
  }) {
  return (
    <ToggleButtonPrimitive
      data-slot="selectable"
      className={cn(
        "outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-default",
        className
      )}
      {...props}
    />
  )
}

export { Selectable }
