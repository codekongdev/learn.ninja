"use client"

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

function Slider<T extends SliderValue = SliderValue>({
  className,
  ticks = false,
  ...props
}: SliderProps<T>) {
  return (
    <SliderPrimitive
      className={cn(
        "group relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
        className
      )}
      data-slot="slider"
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
              className="relative grow rounded-full bg-muted select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1"
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
                      "pointer-events-none absolute top-1/2 size-1.5 -translate-y-1/2 rounded-full",
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
                className="relative block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none group-data-horizontal:top-[50%] group-data-vertical:start-[50%] after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
              />
            ))}
          </>
        )
      }}
    </SliderPrimitive>
  )
}

export { Slider }
