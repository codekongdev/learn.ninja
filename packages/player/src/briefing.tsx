"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

import { reducedMotion } from "./ninja"
import { RichText } from "./rich-text"

/**
 * A scenario's situation as the beats the ninja tells it in: one per sentence, and a colon that
 * introduces a list ends a beat too. Bold and code never break across beats.
 */
export function briefBeats(text: string, lang = "en"): string[] {
  const sentences =
    typeof Intl !== "undefined" && "Segmenter" in Intl
      ? [
          ...new Intl.Segmenter(lang, { granularity: "sentence" }).segment(
            text
          ),
        ].map((s) => s.segment)
      : text.split(/(?<=[.!?])\s+/)
  const parts = sentences
    .flatMap((s) => s.split(/(?<=:)\s+/))
    .map((s) => s.trim())
    .filter(Boolean)
  // A beat that opens bold or code without closing it takes the next one with it.
  const open = (s: string) =>
    (s.match(/\*\*/g)?.length ?? 0) % 2 === 1 ||
    (s.match(/`/g)?.length ?? 0) % 2 === 1
  const beats: string[] = []
  for (const part of parts) {
    const last = beats[beats.length - 1]
    if (last !== undefined && open(last))
      beats[beats.length - 1] = `${last} ${part}`
    else beats.push(part)
  }
  return beats
}

/** Roughly how long a beat takes to read, so the next one doesn't arrive mid-sentence. */
export function readingMs(beat: string, lang = "en"): number {
  const plain = beat.replace(/[*`]/g, "")
  // No spaces between words: count characters instead.
  const units = /^(zh|ja|th)/.test(lang)
    ? plain.length / 2.5
    : plain.split(/\s+/).length
  return Math.min(2600, Math.max(700, units * 170))
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

/**
 * The ninja's brief before a scenario: a speech bubble above his slot that fills a beat at a time,
 * with a typing pause before each. `skip` counts Skip presses: a new one shows the rest at once.
 * `onTold` fires once every beat is out.
 */
export function Briefing({
  text,
  lang,
  skip,
  onTold,
  slot,
}: {
  text: string
  lang?: string
  skip: number
  onTold: () => void
  /** Where the ninja stands, under the bubble (NinjaStage puts him there). */
  slot: React.ReactNode
}) {
  const beats = React.useMemo(() => briefBeats(text, lang), [text, lang])
  const [shown, setShown] = React.useState(0)
  const [typing, setTyping] = React.useState(false)
  const onToldRef = React.useRef(onTold)
  onToldRef.current = onTold
  // Skipping ends the telling for good, and he's only done telling once.
  const skipped = React.useRef(false)
  const toldOnce = React.useRef(false)
  const finish = React.useCallback(() => {
    if (toldOnce.current) return
    toldOnce.current = true
    onToldRef.current()
  }, [])

  React.useEffect(() => {
    if (reducedMotion()) {
      setShown(beats.length)
      finish()
      return
    }
    let on = true
    ;(async () => {
      // He leaps up first; the bubble starts once he's about to land.
      await sleep(650)
      for (let i = 0; i < beats.length; i++) {
        if (!on || skipped.current) return
        setTyping(true)
        await sleep(i === 0 ? 450 : 550)
        if (!on || skipped.current) return
        setTyping(false)
        setShown(i + 1)
        if (i < beats.length - 1) await sleep(readingMs(beats[i]!, lang))
      }
      if (on && !skipped.current) finish()
    })()
    return () => {
      on = false
    }
  }, [beats, lang, finish])

  // Skip: everything at once. Only presses after this telling began count.
  const skipAtStart = React.useRef(skip)
  React.useEffect(() => {
    if (skip === skipAtStart.current) return
    skipped.current = true
    setTyping(false)
    setShown(beats.length)
    finish()
  }, [skip, beats.length, finish])

  const done = shown >= beats.length
  return (
    <div className="flex flex-col items-center gap-5">
      <div
        aria-live="polite"
        className={cn(
          "relative w-full max-w-md rounded-xl border bg-popover px-5 py-4 text-base text-popover-foreground shadow-xs transition-opacity duration-200",
          shown === 0 && !typing ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="flex flex-col gap-2">
          {beats.slice(0, shown).map((beat, i) => (
            <p
              key={i}
              className="text-pretty motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1"
            >
              <RichText text={beat} />
            </p>
          ))}
          {typing && !done ? <Typing /> : null}
        </div>
        {/* The tail, pointing down at him. */}
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-e border-b bg-popover"
        />
      </div>
      {slot}
    </div>
  )
}

function Typing() {
  return (
    <span aria-hidden="true" className="flex h-6 items-center gap-1">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="size-1.5 animate-pulse rounded-full bg-muted-foreground"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}
