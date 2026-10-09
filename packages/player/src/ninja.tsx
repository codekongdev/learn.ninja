"use client"

import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

import type { NinjaLevel } from "./strings"

// The ninja: the logo as a character. He is the same mark as the header logo with two extra eye
// layers (happy arcs, sad arcs) that stay hidden until a mood class asks for them. Everything he
// does is eye and head transforms, so he still reads as the logo at 22px. Styles live in
// packages/ui/src/styles/globals.css under `.ninja`. Reactions come from the player, never the lesson.

export type NinjaMood =
  | "idle"
  | "happy"
  | "cheer"
  | "wiggle"
  | "sparkle"
  | "nod"
  | "spin"
  | "oops"
  | "droop"
  | "sigh"
  | "shake"
  | "lookaway"
  | "wince"
  | "wide"
  | "half"
  | "closed"
  // Caffeinated
  | "hop"
  | "jitter"
  | "pop"
  | "rattle"
  | "headshake"
  // Unhinged
  | "flip"
  | "doublespin"
  | "inflate"
  | "headbang"
  | "faint"
  | "tremble"

/** The ninja settings he can be seen at (the player leaves him out when it's off). */
export type NinjaEnergy = Exclude<NinjaLevel, "off">

export const Ninja = React.forwardRef<
  SVGSVGElement,
  { mood?: NinjaMood; className?: string }
>(function Ninja({ mood = "idle", className }, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={cn("ninja", mood !== "idle" && `e-${mood}`, className)}
    >
      <g className="ninja-head">
        <g stroke="currentColor" strokeWidth="5" strokeLinejoin="round">
          <path d="M7.01 24.83A26 26 0 0 1 56.99 24.83Q32 15.17 7.01 24.83Z" />
          <path d="M56.99 39.17Q32 48.83 7.01 39.17A26 26 0 0 0 56.99 39.17Z" />
        </g>
        <g className="ninja-eyes">
          <g className="ninja-open" fill="currentColor">
            <ellipse cx="25" cy="32" rx="2.9" ry="4.6" />
            <ellipse cx="39" cy="32" rx="2.9" ry="4.6" />
          </g>
          <g
            className="ninja-happy"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
          >
            <path d="M21 34.4Q25 28.6 29 34.4" />
            <path d="M35 34.4Q39 28.6 43 34.4" />
          </g>
          <g
            className="ninja-sad"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
          >
            <path d="M21.5 30.2Q25 34.6 28.5 31.6" />
            <path d="M42.5 30.2Q39 34.6 35.5 31.6" />
          </g>
        </g>
      </g>
    </svg>
  )
})

// ---------- reactions ----------

/** One beat of a reaction: a mood, how long to hold it, and where to look meanwhile. */
type Beat = [mood: NinjaMood, ms: number, lookX?: number, lookY?: number]

type Reactions = Record<"happy" | "sad", Record<string, Beat[]>>

/**
 * Each setting is a different character. Normal is small and warm. Caffeinated is quick and
 * twitchy. Unhinged is theatrical. At every level he's sorry with the learner, never at them: the
 * sad moves are all self-directed. Several variants per mood, so the same answer never feels canned.
 */
export const REACTIONS: Record<NinjaEnergy, Reactions> = {
  normal: {
    happy: {
      smile: [["happy", 1300]],
      cheer: [["cheer", 1100]],
      wiggle: [["wiggle", 1000]],
      sparkle: [
        ["wide", 320],
        ["sparkle", 1000],
      ],
      nod: [["nod", 1100]],
      spin: [
        ["spin", 850],
        ["happy", 900],
      ],
    },
    sad: {
      oops: [["oops", 1300]],
      droop: [["droop", 1500]],
      sigh: [["sigh", 1500]],
      shake: [
        ["shake", 600],
        ["half", 700],
      ],
      lookaway: [
        ["lookaway", 1100],
        ["half", 500, 0, 0],
      ],
      wince: [
        ["closed", 500],
        ["half", 900],
      ],
    },
  },
  caffeinated: {
    happy: {
      // Two quick hops.
      hop: [
        ["hop", 700],
        ["happy", 500],
      ],
      // Can't sit still.
      jitter: [
        ["jitter", 600],
        ["happy", 500],
      ],
      // Eyes pop, then a grin.
      pop: [
        ["pop", 450],
        ["happy", 700],
      ],
      // Eyes dart everywhere.
      dart: [
        ["happy", 220, -5, 0],
        ["happy", 220, 5, 0],
        ["happy", 260, 0, -2],
        ["happy", 450, 0, 0],
      ],
    },
    sad: {
      // A fast rattle, then squints.
      rattle: [
        ["rattle", 550],
        ["half", 600],
      ],
      // A gasp: wide, then a squint.
      gasp: [
        ["wide", 350],
        ["half", 800],
      ],
      // Shakes his head, then slumps.
      slump: [
        ["headshake", 800],
        ["droop", 900],
      ],
    },
  },
  unhinged: {
    happy: {
      // A full flip off the ground.
      flip: [
        ["flip", 900],
        ["happy", 500],
      ],
      // Two spins, dizzy, grin.
      doublespin: [
        ["doublespin", 1100],
        ["wide", 300],
        ["happy", 500],
      ],
      // Swells up with pride.
      inflate: [
        ["inflate", 900],
        ["happy", 400],
      ],
      headbang: [
        ["headbang", 1000],
        ["happy", 400],
      ],
    },
    sad: {
      // Tips over, lies there, gets up.
      faint: [["faint", 1700]],
      // Rattle, spin, slump.
      meltdown: [
        ["rattle", 550],
        ["doublespin", 1100],
        ["droop", 900],
      ],
      // A silent scream: wide eyes and a violent tremble.
      scream: [
        ["tremble", 800],
        ["half", 700],
      ],
    },
  },
}

/** How far the keyframes go at each setting (as --ninja-energy). The bigger sets are already big. */
export const NINJA_ENERGY: Record<NinjaEnergy, number> = {
  normal: 1,
  caffeinated: 1.3,
  unhinged: 1.6,
}

/** Things he does on his own while waiting, at the livelier settings. */
export const ANTICS: Record<NinjaEnergy, Beat[][]> = {
  normal: [],
  caffeinated: [REACTIONS.caffeinated.happy.hop!, REACTIONS.caffeinated.happy.dart!],
  unhinged: [
    REACTIONS.unhinged.happy.flip!,
    REACTIONS.unhinged.happy.doublespin!,
    REACTIONS.unhinged.happy.headbang!,
    REACTIONS.unhinged.happy.inflate!,
  ],
}

/** How often the antics come (ms), at random in this range. */
const ANTIC_EVERY: Record<NinjaEnergy, [number, number]> = {
  normal: [0, 0],
  caffeinated: [7000, 14000],
  unhinged: [9000, 16000],
}

/** A stable pick from a list for a seed, skipping the one played last time. */
export function pickFrom(names: string[], seed: string, last?: string): string {
  const pool = names.filter((n) => n !== last)
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return pool[h % pool.length]!
}

/** The reaction to play for an answer at a setting. Unhinged gets two in a row. */
export function reactionFor(
  kind: "happy" | "sad",
  seed: string,
  level: NinjaEnergy,
  last?: string
): { name: string; beats: Beat[] } {
  const set = REACTIONS[level][kind]
  const names = Object.keys(set)
  const name = pickFrom(names, seed, last)
  let beats = set[name]!
  if (level === "unhinged") {
    const encore = pickFrom(names, `${seed}!`, name)
    beats = [...beats, ...set[encore]!]
  }
  return { name, beats }
}

const MOOD_CLASSES = (
  [
    "happy",
    "cheer",
    "wiggle",
    "sparkle",
    "nod",
    "spin",
    "oops",
    "droop",
    "sigh",
    "shake",
    "lookaway",
    "wince",
    "wide",
    "half",
    "closed",
    "hop",
    "jitter",
    "pop",
    "rattle",
    "headshake",
    "flip",
    "doublespin",
    "inflate",
    "headbang",
    "faint",
    "tremble",
  ] satisfies NinjaMood[]
).map((m) => `e-${m}`)

export function setMood(svg: SVGSVGElement, mood: NinjaMood) {
  svg.classList.remove(...MOOD_CLASSES)
  // Re-adding the same class restarts nothing; a reflow in between lets a keyframe mood replay.
  void svg.getBoundingClientRect()
  if (mood !== "idle") svg.classList.add(`e-${mood}`)
}

// ---------- idle life ----------

export interface NinjaLife {
  /** Pause the idle gaze and blinks, e.g. while a reaction plays. */
  hold: (on: boolean) => void
  /** Point the eyes: ±5 sideways, about -2 to 2.5 up and down, in the mark's own units. */
  look: (x: number, y: number) => void
  /** Play a reaction, then return to idle. */
  play: (beats: Beat[]) => Promise<void>
}

const rnd = (a: number, b: number) => a + Math.random() * (b - a)
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export function reducedMotion(): boolean {
  return (
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

/**
 * Keeps him alive: his eyes wander every second or two, he blinks at random (sometimes twice),
 * and he follows the pointer while it's over `area`. At the livelier settings he also pulls a stunt
 * now and then. Nothing moves when the viewer prefers reduced motion.
 */
export function useNinjaLife(
  svg: React.RefObject<SVGSVGElement | null>,
  area: React.RefObject<HTMLElement | null>,
  level: NinjaEnergy = "normal"
): NinjaLife {
  const held = React.useRef(false)
  const pointer = React.useRef(false)
  const look = React.useCallback(
    (x: number, y: number) => {
      svg.current?.style.setProperty("--ex", `${x.toFixed(2)}px`)
      svg.current?.style.setProperty("--ey", `${y.toFixed(2)}px`)
    },
    [svg]
  )
  const play = React.useCallback(
    async (beats: Beat[]) => {
      const el = svg.current
      if (!el) return
      held.current = true
      for (const [mood, ms, x, y] of beats) {
        if (!svg.current) return
        setMood(el, mood)
        if (x !== undefined) look(x, y ?? 0)
        await sleep(reducedMotion() ? Math.min(ms, 600) : ms)
      }
      if (svg.current) {
        setMood(el, "idle")
        look(0, 0)
      }
      held.current = false
    },
    [svg, look]
  )
  React.useEffect(() => {
    const el = svg.current
    const box = area.current
    if (!el || !box || reducedMotion()) return
    let on = true
    const timers = new Set<ReturnType<typeof setTimeout>>()
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        timers.delete(t)
        if (on) fn()
      }, ms)
      timers.add(t)
    }
    const blinkOnce = (ms: number) => {
      el.classList.add("is-blink")
      later(() => el.classList.remove("is-blink"), ms)
    }
    const blink = () => {
      if (!held.current) {
        blinkOnce(120)
        if (Math.random() < 0.25) later(() => blinkOnce(110), 280)
      }
      later(blink, rnd(2600, 6500))
    }
    const wander = () => {
      if (!held.current && !pointer.current) {
        if (Math.random() < 0.35) look(0, 0)
        else look(rnd(-4.5, 4.5), rnd(-1.6, 2.2))
      }
      later(wander, rnd(1100, 3200))
    }
    const move = (e: PointerEvent) => {
      pointer.current = true
      if (held.current) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      look(
        clamp(((e.clientX - cx) / (r.width * 1.3)) * 5, -5, 5),
        clamp(((e.clientY - cy) / (r.height * 1.3)) * 2.4, -2, 2.4)
      )
    }
    const leave = () => {
      pointer.current = false
      if (!held.current) look(0, 0)
    }
    const stunts = ANTICS[level]
    const antic = () => {
      if (!held.current && stunts.length)
        void play(stunts[Math.floor(Math.random() * stunts.length)]!)
      later(antic, rnd(...ANTIC_EVERY[level]))
    }
    // Unhinged gets the shakes now and then: a fine tremor for a couple of seconds.
    const tremor = () => {
      if (!held.current) {
        el.classList.add("is-tweaking")
        later(() => el.classList.remove("is-tweaking"), rnd(1500, 3000))
      }
      later(tremor, rnd(6000, 12000))
    }
    later(blink, rnd(2000, 4000))
    later(wander, 600)
    if (stunts.length) later(antic, rnd(...ANTIC_EVERY[level]))
    if (level === "unhinged") later(tremor, rnd(2500, 6000))
    box.addEventListener("pointermove", move)
    box.addEventListener("pointerleave", leave)
    return () => {
      on = false
      timers.forEach(clearTimeout)
      el.classList.remove("is-tweaking")
      box.removeEventListener("pointermove", move)
      box.removeEventListener("pointerleave", leave)
    }
  }, [svg, area, look, play, level])
  return React.useMemo<NinjaLife>(
    () => ({
      hold: (on) => {
        held.current = on
      },
      look,
      play,
    }),
    [look, play]
  )
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v))

// ---------- the stage ----------

export interface NinjaCue {
  kind: "happy" | "sad"
  /** Changes once per thing worth reacting to (a check, a reveal). */
  key: string
}

/**
 * Where he is on the lesson card. He sits in the screen's `[data-ninja-slot]` when it has one
 * (the intro, the wrap-up) and in the card's bottom start corner otherwise, and leaps between the two.
 */
export function NinjaStage({
  area,
  screen,
  cue,
  celebrate,
  level = "normal",
}: {
  /** The lesson card: he's positioned inside it and follows the pointer over it. */
  area: React.RefObject<HTMLDivElement | null>
  /** Changes whenever the screen does, so he looks for his slot again. */
  screen: number
  /** The last answer worth a reaction. */
  cue: NinjaCue | null
  /** True on the wrap-up: he cheers once he's landed. */
  celebrate?: boolean
  /** Which character he is. The player leaves him out entirely when the setting is off. */
  level?: NinjaEnergy
}) {
  const float = React.useRef<HTMLDivElement>(null)
  const svg = React.useRef<SVGSVGElement>(null)
  const life = useNinjaLife(svg, area, level)
  const [placed, setPlaced] = React.useState(false)
  // Where he is: in the slot (measured) or in the corner (classes).
  const [slot, setSlot] = React.useState<{
    left: number
    top: number
    size: number
  } | null>(null)
  const lastScreen = React.useRef<number | null>(null)
  const leaping = React.useRef<Promise<void> | null>(null)

  // The card is the stage's parent. (The `area` ref isn't attached yet when this first runs.)
  const measure = React.useCallback(() => {
    const card = float.current?.parentElement
    if (!card) return null
    const el = card.querySelector<HTMLElement>("[data-ninja-slot]")
    if (!el) return null
    const c = card.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    return { left: r.left - c.left, top: r.top - c.top, size: r.width }
  }, [area])

  // On each new screen: find the slot, then leap from wherever he was to wherever he goes.
  React.useLayoutEffect(() => {
    const el = float.current
    const mark = svg.current
    if (!el || !mark) return
    const first = el.getBoundingClientRect()
    const next = measure()
    setSlot(next)
    setPlaced(true)
    const firstTime = lastScreen.current === null
    lastScreen.current = screen
    if (firstTime) {
      // The intro's entrance: two bounces and a grin. Demos that open mid-lesson just appear.
      if (next && screen === 0 && !reducedMotion()) {
        life.hold(true)
        mark.classList.add("is-enter")
        const t1 = setTimeout(() => setMood(mark, "happy"), 760)
        const t2 = setTimeout(() => {
          setMood(mark, "idle")
          mark.classList.remove("is-enter")
          life.hold(false)
        }, 1660)
        // Undo everything if the effect is cut short (React runs it twice in development), or
        // the entrance class stays on him and blocks every later whole-body move.
        return () => {
          clearTimeout(t1)
          clearTimeout(t2)
          mark.classList.remove("is-enter")
          setMood(mark, "idle")
          life.hold(false)
          lastScreen.current = null
        }
      }
      return
    }
    if (reducedMotion()) return
    // FLIP: the placement above lands after this effect, so measure the end spot on the next frame.
    const frame = requestAnimationFrame(() => {
      const last = el.getBoundingClientRect()
      if (
        Math.abs(first.left - last.left) < 2 &&
        Math.abs(first.top - last.top) < 2 &&
        Math.abs(first.width - last.width) < 2
      )
        return
      leaping.current = leap(el, mark, life, first, last).then(() => {
        leaping.current = null
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [screen, measure, life])

  // Keep him on the slot when the card or its content resizes or scrolls. The content is the
  // slot's parent: it grows with the text size while the card stays put, moving the slot.
  React.useEffect(() => {
    const card = float.current?.parentElement
    if (!card || !slot) return
    const update = () => setSlot(measure())
    const observer = new ResizeObserver(update)
    observer.observe(card)
    const content = card.querySelector("[data-ninja-slot]")?.parentElement
    if (content) observer.observe(content)
    const scroller = card.querySelector("main")
    scroller?.addEventListener("scroll", update, { passive: true })
    return () => {
      observer.disconnect()
      scroller?.removeEventListener("scroll", update)
    }
  }, [measure, slot === null])

  // Reactions to answers.
  const lastName = React.useRef<string | undefined>(undefined)
  React.useEffect(() => {
    if (!cue) return
    const { name, beats } = reactionFor(
      cue.kind,
      cue.key,
      level,
      lastName.current
    )
    lastName.current = name
    let cancelled = false
    ;(async () => {
      await leaping.current
      if (!cancelled) await life.play(beats)
    })()
    return () => {
      cancelled = true
    }
  }, [cue?.key, cue?.kind, level, life])

  // The wrap-up: a cheer once he's landed on his slot.
  React.useEffect(() => {
    if (!celebrate) return
    let cancelled = false
    ;(async () => {
      await leaping.current
      if (!cancelled) await life.play([["cheer", 1200]])
    })()
    return () => {
      cancelled = true
    }
  }, [celebrate, life])

  return (
    <div
      ref={float}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10",
        !placed && "invisible",
        !slot && "start-4 bottom-4 size-10 sm:start-6 sm:bottom-6"
      )}
      style={
        {
          "--ninja-energy": NINJA_ENERGY[level],
          ...(slot
            ? {
                left: slot.left,
                top: slot.top,
                width: slot.size,
                height: slot.size,
              }
            : null),
        } as React.CSSProperties
      }
    >
      <Ninja ref={svg} className="size-full" />
    </div>
  )
}

/** Squat, launch, arc over, land with a squash and a small bounce. About 1.4s. */
async function leap(
  el: HTMLElement,
  mark: SVGSVGElement,
  life: NinjaLife,
  first: DOMRect,
  last: DOMRect
) {
  life.hold(true)
  const dx = first.left - last.left
  const dy = first.top - last.top
  const s0 = first.width / last.width
  const lean = dx > 0 ? -16 : 16
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const frames: Keyframe[] = []
  const N = 24
  for (let i = 0; i <= N; i++) {
    const p = i / N
    let tx = dx
    let ty = dy
    let s = s0
    let sx = 1
    let sy = 1
    let rot = 0
    if (p < 0.12) {
      // The squat, in place.
      const q = p / 0.12
      sx = lerp(1, 1.12, q)
      sy = lerp(1, 0.84, q)
    } else {
      const u = (p - 0.12) / 0.88
      const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2
      tx = dx * (1 - e)
      ty = dy * (1 - e) - 120 * Math.sin(Math.PI * u)
      s = lerp(s0, 1, e)
      // The squash becomes a stretch in the air, then neutral.
      sx =
        u < 0.14
          ? lerp(1.12, 0.92, u / 0.14)
          : u < 0.36
            ? lerp(0.92, 1, (u - 0.14) / 0.22)
            : 1
      sy =
        u < 0.14
          ? lerp(0.84, 1.12, u / 0.14)
          : u < 0.36
            ? lerp(1.12, 1, (u - 0.14) / 0.22)
            : 1
      rot = lean * Math.sin(Math.PI * u)
    }
    frames.push({
      transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${rot.toFixed(1)}deg) scale(${(s * sx).toFixed(3)}, ${(s * sy).toFixed(3)})`,
      offset: p,
    })
  }
  const t = setTimeout(() => setMood(mark, "happy"), 100)
  await el.animate(frames, { duration: 800, easing: "linear" }).finished
  clearTimeout(t)
  setMood(mark, "closed")
  await el.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.22, .78)", offset: 0.22 },
      { transform: "translateY(-9px) scale(.96, 1.06)", offset: 0.5 },
      { transform: "translateY(0) scale(1.08, .94)", offset: 0.7 },
      { transform: "translateY(-2px) scale(1)", offset: 0.86 },
      { transform: "translateY(0) scale(1)" },
    ],
    { duration: 620, easing: "cubic-bezier(.3,1.2,.4,1)" }
  ).finished
  setMood(mark, "wide")
  life.look(4, -2)
  await sleep(340)
  setMood(mark, "happy")
  await sleep(650)
  setMood(mark, "idle")
  life.look(0, 0)
  life.hold(false)
}

// ---------- the aura ----------

/** A hue for the lesson's topic, so lessons on the same subject share a light. */
export function hueFor(topic: string): number {
  let h = 0
  for (const c of topic.toLowerCase()) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h % 360
}

/**
 * The soft light behind the intro: one glow below the title and a smaller one a few hues away that
 * drifts. `shift` moves both up or down (px) to follow the content, e.g. when the ninja's slot folds away.
 */
export function Aura({ hue, shift = 0 }: { hue: number; shift?: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]"
      style={
        { "--aura-h": hue, "--aura-shift": `${shift}px` } as React.CSSProperties
      }
    >
      <div className="aura" />
      <div className="aura aura-second" />
    </div>
  )
}
