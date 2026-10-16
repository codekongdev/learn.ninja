"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

const DELETE_MS = 60
const PAUSE_MS = 250
const TYPE_MS = 100

/**
 * Cycles through `words` in an inline code chip like a typewriter: the word is deleted one
 * letter at a time and the next one is typed in, with a caret that blinks while it waits.
 * Stays on the first word for reduced motion.
 */
export function RotatingWord({
  words,
  interval = 2500,
}: {
  words: string[]
  interval?: number
}) {
  const [text, setText] = React.useState(words[0] ?? "")
  const [typing, setTyping] = React.useState(false)

  React.useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let timer: ReturnType<typeof setTimeout>
    let cancelled = false
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms)
      })

    async function run(index: number) {
      const word = words[index] ?? ""
      const next = words[(index + 1) % words.length] ?? ""

      await wait(interval)
      setTyping(true)
      for (let n = word.length - 1; n >= 0; n--) {
        if (cancelled) return
        setText(word.slice(0, n))
        await wait(DELETE_MS)
      }
      await wait(PAUSE_MS)
      for (let n = 1; n <= next.length; n++) {
        if (cancelled) return
        setText(next.slice(0, n))
        await wait(TYPE_MS)
      }
      if (cancelled) return
      setTyping(false)
      void run((index + 1) % words.length)
    }

    void run(0)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [words, interval])

  return (
    <span className="inline-flex rounded-md border bg-muted px-1.5">
      {/* A zero-width space keeps the chip's height while it's empty. */}
      <span className="whitespace-pre">{text || "\u200b"}</span>
      <span
        className={cn(
          "my-[0.1em] w-0.5 shrink-0 self-stretch bg-foreground",
          !typing && "motion-safe:animate-caret-blink"
        )}
      />
    </span>
  )
}
