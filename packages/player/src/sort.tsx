"use client"

import * as React from "react"
import { flushSync } from "react-dom"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Kbd } from "@workspace/ui/components/kbd"
import { cn } from "@workspace/ui/lib/utils"

import type { QuestionBrickProps } from "./bricks"
import { POOL } from "./check"
import { usePlayer } from "./context"
import { RichText } from "./rich-text"

// The sort brick, as lanes: the groups head the columns and every item keeps its own row. An unsorted
// item spans the row; tap the side it belongs on (or swipe it there) and it slides into that lane. Tap a
// placed item to take it back out, or an empty lane to move it across. Each row is a radio group, so a
// keyboard moves the item with the arrow keys and a screen reader hears the item and its groups.

/** Move an item to the end of a zone, taking it out of whichever zone held it. */
export function moveItem(
  zones: Record<string, string[]>,
  itemId: string,
  toZone: string
): Record<string, string[]> {
  const next = Object.fromEntries(
    Object.entries(zones).map(([z, ids]) => [
      z,
      ids.filter((id) => id !== itemId),
    ])
  )
  next[toZone] = [...(next[toZone] ?? []), itemId]
  return next
}

const calm = () =>
  typeof window === "undefined" ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

type ViewTransition = { finished: Promise<void>; ready: Promise<void> }
type WithViewTransitions = Document & {
  startViewTransition?: (update: () => void) => ViewTransition
}

/** Name every item for the transition only while it runs, so nothing else changes. */
function tag(root: HTMLElement, on: boolean) {
  for (const el of root.querySelectorAll<HTMLElement>("[data-vt]")) {
    el.style.setProperty("view-transition-name", on ? el.dataset.vt! : "")
    el.style.setProperty("view-transition-class", on ? "learn-sort-item" : "")
  }
}

/** Run a move as a view transition, so the items slide to their new lanes where the browser can. */
function fly(root: HTMLElement | null, update: () => void): Promise<void> {
  const doc = document as WithViewTransitions
  if (!root || !doc.startViewTransition || calm()) {
    update()
    return Promise.resolve()
  }
  tag(root, true)
  const transition = doc.startViewTransition(() => {
    flushSync(update)
    tag(root, true)
  })
  // A transition cut short (another move, or the tab hidden) rejects `ready`; the move itself still lands.
  transition.ready.catch(() => {})
  return transition.finished.finally(() => tag(root, false))
}

/** A small bounce on the lane's heading as an item lands. */
function pulse(el: HTMLElement | null | undefined) {
  if (!el || calm()) return
  el.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.02)" },
      { transform: "scale(1)" },
    ],
    { duration: 280, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
  )
}

/** How far a finger has to travel before a swipe counts. */
const SWIPE = 48

const markStyles =
  "data-[status=correct]:border-green-600! data-[status=correct]:bg-green-600/10! " +
  "data-[status=wrong]:border-yellow-500! data-[status=wrong]:bg-yellow-500/10!"

const tileStyles =
  "rounded-md border bg-background text-sm font-medium shadow-xs dark:bg-input/30"

export function SortBrick({
  brick,
  answer,
  setAnswer,
  marks,
  locked,
}: QuestionBrickProps) {
  const { t, dir } = usePlayer()
  const uid = React.useId().replace(/[^\w-]/g, "")
  const root = React.useRef<HTMLDivElement>(null)
  const heads = React.useRef<(HTMLDivElement | null)[]>([])
  const [said, setSaid] = React.useState("")
  // The lane the learner is aiming at, by hover or mid-swipe, so its heading lights up.
  const [aim, setAim] = React.useState<{ id: string; lane: number } | null>(
    null
  )
  const swipe = React.useRef<{
    id: string
    x: number
    el: HTMLElement
    to: number | null
    /** Past a few pixels of jitter, the touch is a swipe rather than a tap. */
    dragging: boolean
  } | null>(null)
  const swipedAt = React.useRef(0)
  const radios = React.useRef<Record<string, HTMLDivElement | null>>({})

  const groups = brick.type === "sort" ? brick.groups : []
  const items = brick.type === "sort" ? brick.items : []
  const zones = answer.kind === "zones" ? answer.zones : {}
  // Rows keep the order they started in, so nothing jumps when an item changes lanes.
  const [order] = React.useState(() => [
    ...(zones[POOL] ?? []),
    ...groups.flatMap((g) => zones[g.id] ?? []),
  ])

  // After checking, items in the wrong lane give a small shake.
  const wrong = Object.keys(marks)
    .filter((id) => marks[id] === "wrong")
    .join(",")
  React.useEffect(() => {
    if (!wrong || calm()) return
    for (const el of root.current?.querySelectorAll<HTMLElement>(
      '[data-status="wrong"]'
    ) ?? [])
      el.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(-4px)" },
          { transform: "translateX(4px)" },
          { transform: "translateX(-3px)" },
          { transform: "translateX(2px)" },
          { transform: "translateX(0)" },
        ],
        { duration: 420, easing: "ease-out" }
      )
  }, [wrong])

  if (brick.type !== "sort" || answer.kind !== "zones") return null

  const n = groups.length
  const rows = [
    ...order,
    ...items.map((i) => i.id).filter((id) => !order.includes(id)),
  ]
  const index = new Map(items.map((it, i) => [it.id, i]))
  const textOf = (id: string) =>
    items[index.get(id)!]?.text.replace(/[*`]/g, "") ?? id
  const laneOf = (id: string) =>
    groups.findIndex((g) => zones[g.id]?.includes(id))

  /** Move an item to a lane (or back out with -1); it slides there and the lane's heading bounces. */
  const place = (id: string, lane: number, before?: () => void) => {
    const zone = lane < 0 ? POOL : groups[lane]!.id
    setAim(null)
    setSaid(t.placedIn(textOf(id), lane < 0 ? t.pool : groups[lane]!.label))
    // A tick under the finger on phones; desktops have nothing to buzz.
    if (matchMedia("(pointer: coarse)").matches) navigator.vibrate?.(10)
    void fly(root.current, () => {
      before?.()
      setAnswer({
        kind: "zones",
        zones: moveItem(zones, id, zone),
      })
    }).then(() => pulse(lane < 0 ? null : heads.current[lane]))
  }

  /** The lane a swipe toward the start (-1) or end (+1) lands in, from where the item is now. */
  const laneToward = (id: string, way: -1 | 1) => {
    const from = laneOf(id)
    const centre = (n - 1) / 2
    const to =
      from < 0
        ? way < 0
          ? Math.ceil(centre) - 1
          : Math.floor(centre) + 1
        : from + way
    return to >= 0 && to < n ? to : null
  }

  // A sideways swipe drags the tile along under the finger and drops it in the next lane that way.
  const swipeProps = (id: string) =>
    locked
      ? {}
      : {
          onPointerDownCapture: (e: React.PointerEvent<HTMLElement>) => {
            const el = e.currentTarget.querySelector<HTMLElement>("[data-tile]")
            if (e.pointerType === "mouse" || !el) return
            swipe.current = { id, x: e.clientX, el, to: null, dragging: false }
          },
          onPointerMoveCapture: (e: React.PointerEvent<HTMLElement>) => {
            const s = swipe.current
            if (!s) return
            const dx = e.clientX - s.x
            if (!s.dragging && Math.abs(dx) < 8) return
            s.dragging = true
            s.el.style.translate = `${dx}px 0`
            const way = dx > 0 === (dir === "rtl") ? -1 : 1
            const to = Math.abs(dx) > SWIPE ? laneToward(s.id, way) : null
            if (to !== s.to) {
              s.to = to
              setAim(to === null ? null : { id: s.id, lane: to })
            }
          },
          onPointerUpCapture: () => {
            const s = swipe.current
            swipe.current = null
            if (!s?.dragging) return
            swipedAt.current = performance.now()
            if (s.to !== null) {
              // The flight starts from where the finger let go: the offset clears once that's captured.
              place(s.id, s.to, () => s.el.style.removeProperty("translate"))
            } else {
              if (!calm())
                s.el.animate(
                  [
                    { translate: s.el.style.translate || "0px 0" },
                    { translate: "0px 0" },
                  ],
                  { duration: 200, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
                )
              s.el.style.removeProperty("translate")
              setAim(null)
            }
          },
          onPointerCancelCapture: () => {
            swipe.current?.el.style.removeProperty("translate")
            swipe.current = null
            setAim(null)
          },
        }

  const radio = (id: string, lane: number) =>
    radios.current[`${id}:${lane}`] ?? null
  /** Move by keyboard: focus follows the item to its new lane, so the learner never loses their place. */
  const move = (id: string, lane: number) => {
    radio(id, Math.max(lane, 0))?.focus()
    place(id, lane)
  }

  // Each row is a radio group, one Tab stop: ← and → move the item a lane that way, Home and End to
  // the first and last, a number to that group, Space to the focused lane, and Delete takes it back out.
  const keys = (id: string) => (e: React.KeyboardEvent<HTMLElement>) => {
    if (locked || e.metaKey || e.ctrlKey || e.altKey) return
    const lane = laneOf(id)
    const focused = Number(
      (e.target as HTMLElement).closest<HTMLElement>("[data-lane]")?.dataset
        .lane ?? -1
    )
    let to: number | null = null
    if (e.key === "ArrowLeft" || e.key === "ArrowRight")
      to = laneToward(id, (e.key === "ArrowRight") === (dir === "rtl") ? -1 : 1)
    else if (e.key === "Home") to = 0
    else if (e.key === "End") to = n - 1
    else if (e.key === " ") to = focused
    else if (e.key === "Delete" || e.key === "Backspace") to = -1
    else if (/^[1-9]$/.test(e.key) && Number(e.key) <= n) to = Number(e.key) - 1
    else return
    e.preventDefault()
    if (e.repeat || to === null || to === lane || (to < 0 && lane < 0)) return
    move(id, to)
  }
  /** A click that ends a swipe isn't a tap. A tap on the item's own lane takes it back out. */
  const click = (id: string, i: number) => {
    if (locked || performance.now() - swipedAt.current < 400) return
    place(id, laneOf(id) === i ? -1 : i)
  }

  const Start = dir === "rtl" ? ChevronRightIcon : ChevronLeftIcon
  const End = dir === "rtl" ? ChevronLeftIcon : ChevronRightIcon
  const columns = { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }

  return (
    <div ref={root} className="flex flex-col gap-2">
      <div className="grid gap-2" style={columns}>
        {groups.map((g, i) => (
          <div
            key={g.id}
            ref={(el) => {
              heads.current[i] = el
            }}
            className={cn(
              "flex items-center justify-center gap-2 px-2 py-1.5 text-sm font-semibold text-muted-foreground transition-colors",
              aim?.lane === i && "text-foreground"
            )}
          >
            <span lang={g.lang} className="truncate">
              {g.label}
            </span>
            {locked ? null : (
              <Kbd aria-hidden="true" className="pointer-coarse:hidden">
                {i + 1}
              </Kbd>
            )}
          </div>
        ))}
      </div>
      {rows.map((id) => {
        const it = items[index.get(id)!]!
        const lane = laneOf(id)
        return (
          <div
            key={id}
            role="radiogroup"
            aria-label={textOf(id)}
            aria-disabled={locked || undefined}
            onKeyDown={keys(id)}
            {...swipeProps(id)}
            className="group/row relative grid touch-pan-y gap-2"
            style={columns}
          >
            {/* The tile is only a picture; the radios on top of it take every tap and key. */}
            <div
              data-tile
              data-vt={`learn-${uid}-i${index.get(id)}`}
              data-status={marks[id]}
              aria-hidden="true"
              style={{
                gridRow: 1,
                gridColumn: lane < 0 ? "1 / -1" : `${lane + 1}`,
              }}
              className={cn(
                tileStyles,
                markStyles,
                "relative flex min-h-10 items-center justify-center py-2.5 text-center select-none",
                lane < 0 ? "px-9" : "px-3",
                "group-has-[[role=radio]:focus-visible]/row:border-ring group-has-[[role=radio]:focus-visible]/row:ring-[3px] group-has-[[role=radio]:focus-visible]/row:ring-ring/50"
              )}
            >
              {lane < 0 ? (
                <Start
                  className={cn(
                    "absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-[color,translate]",
                    aim?.id === id &&
                      aim.lane === 0 &&
                      "text-foreground ltr:-translate-x-0.5 rtl:translate-x-0.5"
                  )}
                />
              ) : null}
              <RichText text={it.text} lang={it.lang} />
              {lane < 0 ? (
                <End
                  className={cn(
                    "absolute end-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-[color,translate]",
                    aim?.id === id &&
                      aim.lane === n - 1 &&
                      "text-foreground ltr:translate-x-0.5 rtl:-translate-x-0.5"
                  )}
                />
              ) : null}
            </div>
            {groups.map((g, i) => (
              // Keys are handled by the row, like a native radio group.
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <div
                key={g.id}
                ref={(el) => {
                  radios.current[`${id}:${i}`] = el
                }}
                role="radio"
                aria-checked={lane === i}
                aria-label={g.label}
                aria-disabled={locked || undefined}
                data-lane={i}
                // One Tab stop per row: the item's lane, or the first lane while it's unsorted.
                tabIndex={(lane < 0 ? i === 0 : i === lane) ? 0 : -1}
                onClick={() => click(id, i)}
                onFocus={() => setAim({ id, lane: i })}
                onBlur={() => setAim(null)}
                onMouseEnter={() => !locked && setAim({ id, lane: i })}
                onMouseLeave={() => setAim(null)}
                style={{ gridRow: 1, gridColumn: i + 1 }}
                className={cn(
                  "z-10 min-h-10 rounded-md outline-none",
                  !locked && "cursor-pointer",
                  !locked &&
                    (lane < 0 || lane === i
                      ? "hover:bg-foreground/5"
                      : // An empty lane stays outlined, so it's clear the item can still move there.
                        "border border-dashed border-foreground/20 bg-muted/60 transition-colors hover:border-foreground/40 hover:bg-muted dark:bg-input/10 dark:hover:bg-input/30")
                )}
              />
            ))}
          </div>
        )
      })}
      <div aria-live="polite" className="sr-only">
        {said}
      </div>
    </div>
  )
}
