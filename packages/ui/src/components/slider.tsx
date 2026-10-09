"use client"

import * as React from "react"
import { cn } from "cn"
import {
  SliderFill,
  Slider as SliderPrimitive,
  SliderThumb,
  SliderTrack,
  type SliderProps as SliderPrimitiveProps,
} from "react-aria-components"

type SliderValue = number | number[]
type SliderProps<T extends SliderValue = SliderValue> = Omit<
  SliderPrimitiveProps<T>,
  "className"
> & {
  className?: string
  /**
   * Added to stock: a dot on the track at every step, so a slider with a few stops reads as one.
   * Needs `step`, `minValue`, and `maxValue`.
   */
  ticks?: boolean
}

/** Added to stock: how long the pointer must stay down before the cursor turns into a grabbing hand. */
const HOLD_MS = 150

function Slider<T extends SliderValue = SliderValue>({
  className,
  ticks = false,
  ...props
}: SliderProps<T>) {
  // A click keeps the pointer cursor; only holding the button down shows the grabbing hand.
  const [held, setHeld] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  React.useEffect(() => {
    const release = () => {
      clearTimeout(timer.current)
      setHeld(false)
    }
    window.addEventListener("pointerup", release)
    window.addEventListener("pointercancel", release)
    return () => {
      release()
      window.removeEventListener("pointerup", release)
      window.removeEventListener("pointercancel", release)
    }
  }, [])
  return (
    <SliderPrimitive
      className={cn(
        "group relative flex w-full cursor-pointer touch-none items-center select-none data-disabled:cursor-default data-disabled:opacity-50 data-held:cursor-grabbing data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className
      )}
      data-slot="slider"
      data-held={held || undefined}
      onPointerDownCapture={(e: React.PointerEvent) => {
        if (e.button !== 0 || props.isDisabled) return
        clearTimeout(timer.current)
        timer.current = setTimeout(() => setHeld(true), HOLD_MS)
      }}
      {...props}
    >
      {({ state }) => {
        const stops =
          ticks && state.step > 0
            ? Math.round((state.getThumbMaxValue(0) - state.getThumbMinValue(0)) / state.step) + 1
            : 0
        const value = state.getThumbPercent(0)
        return (
          <>
            <SliderTrack
              data-slot="slider-track"
              // Added to stock: the before: layer gives the thin track a bigger area to click, past the
              // end ticks too, so every stop is easy to hit.
              className="relative grow rounded-full bg-muted select-none before:absolute data-horizontal:h-1 data-horizontal:w-full data-horizontal:before:-inset-x-3 data-horizontal:before:-inset-y-4 data-vertical:h-full data-vertical:w-1 data-vertical:before:-inset-y-3 data-vertical:before:-inset-x-4"
            >
              <SliderFill
                data-slot="slider-range"
                className="absolute rounded-full bg-primary select-none data-horizontal:h-full data-vertical:w-full"
              />
              {Array.from({ length: stops }, (_, i) => {
                const at = i / (stops - 1)
                return (
                  <span
                    key={i}
                    data-slot="slider-tick"
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute top-1/2 size-2 -translate-y-1/2 rounded-full",
                      // The dot's center sits on the step's point along the track.
                      "ltr:-translate-x-1/2 rtl:translate-x-1/2",
                      at <= value ? "bg-primary" : "bg-muted-foreground/40"
                    )}
                    style={{ insetInlineStart: `${at * 100}%` }}
                  />
                )
              })}
            </SliderTrack>
            {state.values.map((_, index) => (
              <SliderThumb
                data-slot="slider-thumb"
                key={index}
                index={index}
                className="relative block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none group-data-horizontal:top-[50%] group-data-vertical:start-[50%] after:absolute after:-inset-3 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
              />
            ))}
          </>
        )
      }}
    </SliderPrimitive>
  )
}

export { Slider }
