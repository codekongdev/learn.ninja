"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

/**
 * Cycles through `words` in a pill: the old word drifts up and fades out, the new one
 * rises in, and the pill eases to the new width. Stays on the first word for reduced motion.
 */
export function RotatingWord({
  words,
  interval = 2500,
}: {
  words: string[]
  interval?: number
}) {
  const [index, setIndex] = React.useState(0)
  const [width, setWidth] = React.useState<number>()
  const refs = React.useRef<(HTMLSpanElement | null)[]>([])
  const previous = (index - 1 + words.length) % words.length

  React.useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval
    )
    return () => clearInterval(id)
  }, [words.length, interval])

  // Follow the current word's width, also when the font size changes at a breakpoint.
  React.useLayoutEffect(() => {
    const el = refs.current[index]
    if (!el) return
    setWidth(el.offsetWidth)
    const observer = new ResizeObserver(() => setWidth(el.offsetWidth))
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <span className="inline-flex rounded-lg bg-muted px-2 font-mono tracking-normal ring-1 ring-foreground/10">
      <span
        className="relative inline-flex overflow-x-clip transition-[width] duration-500 ease-out"
        style={{ width }}
      >
        {words.map((word, i) => (
          <span
            key={word}
            ref={(el) => {
              refs.current[i] = el
            }}
            className={cn(
              "whitespace-nowrap transition-[opacity,translate,filter] duration-500 ease-out",
              i !== index && "absolute start-0 top-0 opacity-0 blur-xs",
              i !== index &&
                (i === previous
                  ? "-translate-y-[0.3em]"
                  : "translate-y-[0.3em]")
            )}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  )
}
