"use client"

import * as React from "react"

import { Lantern } from "@workspace/player/streak"
import { cn } from "@workspace/ui/lib/utils"

import { logoMask } from "@/components/site/agent-logos"
import {
  Count,
  Fly,
  Stage,
  States,
  useReducedMotion,
  type Act,
} from "@/components/stage/kit"
import { AGENTS, SETUPS } from "@/lib/site"

import visuals from "./bento-visuals.generated.json"
import "./bento.css"

// The home page's feature grid (stageshow's bento, see components/stage/README.md): what a
// lesson is, in four tiles. Hero and strip: the kata across two thirds, the agents beside it,
// then the subjects across two thirds and the streak beside it. One picture is UI (the hero's
// lesson card, the only window); the rest are a collection of marks, a collection of real lesson
// drawings, and a stat. Across and down, no kind sits next to itself. Each picture is drawn at
// 1:1 inside its tile; the copy is page text over it. Every tile plays one beat, once, as the
// grid scrolls in, 110ms after the one before it in reading order.
//
//   Tile      Span   Kind         The one thing                              Moves
//   Kata      2 × 1  Hero UI      a word chip lands in the gap, Check turns   the chip flies, the tray goes green
//                                 it green and the sensei cheers
//   Agents    1 × 1  Collection   agent and chat-app marks, off the edges     the marks settle in
//   Subjects  2 × 1  Collection   real lesson drawings, off the edges         the cards settle in
//   Streak    1 × 1  Stat         today's lantern lights, 11 becomes 12       the lantern lights, the count rolls

const STEP = 110
const LEAD = 450

/* ---------------- The grid ---------------- */

export function Bento() {
  return (
    // The heading keeps the page's column; the grid is wider than it (the stageshow gold's 984),
    // so the pictures leave the text's bounds, and steps back into the column where the window is narrower.
    <section
      aria-labelledby="bento-heading"
      className="mx-auto flex w-full max-w-[1032px] flex-col gap-10 px-4 pb-20 sm:px-6 sm:pb-28"
    >
      <h2
        id="bento-heading"
        className="mx-auto w-full max-w-3xl px-0 text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        Learn by doing
      </h2>
      <div className="bn">
        <div className="bn-grid">
          <Kata />
          <Agents />
          <Subjects />
          <Streak />
        </div>
      </div>
    </section>
  )
}

/** One tile: the card look, run-in copy at the top, the picture pinned under it and cropped by the tile. */
function Tile({
  name,
  lead,
  children,
  picture,
  className,
}: {
  name: string
  lead: string
  children: React.ReactNode
  picture?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "bn-tile relative flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10",
        className
      )}
      data-tile={name}
      data-crop
    >
      <p className="relative z-10 max-w-md px-6 pt-6 text-base font-semibold text-pretty text-foreground sm:text-lg">
        {lead}
        {children ? <span className="sr-only"> {children}</span> : null}
      </p>
      {picture}
    </div>
  )
}

// The tile owns the crop: a picture matches its tile's width so a stage never slices the card
// before the tile's edge.
function usePictureWidth() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(640)
  React.useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () =>
      setWidth(Math.max(1, Math.round(node.getBoundingClientRect().width)))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}

/** True once the element has scrolled into view (or at once under reduced motion), after `delay` ms. */
function useInView<T extends Element>(delay: number) {
  const ref = React.useRef<T>(null)
  const reduced = useReducedMotion()
  const [seen, setSeen] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    let t = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return
        io.disconnect()
        t = window.setTimeout(() => setSeen(true), delay)
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      clearTimeout(t)
    }
  }, [delay, reduced])
  return [ref, seen || reduced] as const
}

/* ---------------- Kata (hero) ---------------- */

// Real strings: the prompt, the sentence, three word chips, the button, the sensei's line.
const PROMPT = "It's 9 a.m. in Madrid. Finish the greeting."
const BEFORE = "—Buenos"
const AFTER = ", ¿cómo estás?"
const CHIPS = ["noches", "días", "tardes"]
const RIGHT = 1
const PRAISE = "Yosh! Nice work."

type S = {
  /** The chip is in the air between the bank and the gap */
  flying: boolean
  /** The chip sits in the gap */
  placed: boolean
  /** Checked: the chip is green, the sensei has spoken, Continue is up */
  checked: boolean
}
const initial: S = { flying: false, placed: false, checked: false }
const poster: S = { flying: false, placed: true, checked: true }

const script = async (a: Act<S>) => {
  await a.wait(LEAD)
  a.mark("pick")
  await a.click(`chip-${RIGHT}`)
  // The chip leaves the bank as it lifts: a dashed ghost holds its place
  a.put({ flying: true })
  await a.wait(640)
  a.put({ flying: false, placed: true })
  await a.wait(800)
  a.mark("check")
  await a.click("check")
  a.put({ checked: true })
  a.mark("payoff")
}

function Mark({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      className={className}
    >
      <g stroke="currentColor" strokeWidth="5" strokeLinejoin="round">
        <path d="M7.01 24.83A26 26 0 0 1 56.99 24.83Q32 15.17 7.01 24.83Z" />
        <path d="M56.99 39.17Q32 48.83 7.01 39.17A26 26 0 0 0 56.99 39.17Z" />
      </g>
      <ellipse cx="25" cy="32" rx="2.9" ry="4.6" fill="currentColor" />
      <ellipse cx="39" cy="32" rx="2.9" ry="4.6" fill="currentColor" />
    </svg>
  )
}

/** A word chip: in the bank, in the gap, or in flight. */
function Chip({
  word,
  index,
  state,
  keyHint,
  hideKey,
  ...rest
}: {
  word: string
  index?: number
  state?: "gone" | "placed" | "correct"
  /** The number key, as the desktop player shows on each chip */
  keyHint?: boolean
  /** Once the answer is checked the keys go, but the chip keeps their room, as the player's do */
  hideKey?: boolean
} & Record<`data-${string}`, unknown>) {
  return (
    <span className="bn-chip" data-state={state} {...rest}>
      {word}
      {keyHint && index !== undefined ? (
        <kbd className="bn-key" data-hidden={hideKey || undefined}>
          {index + 1}
        </kbd>
      ) : null}
    </span>
  )
}

/** The sentence with its gap, and the bank of chips under it. One markup for both layouts. */
function Blank({
  s,
  keyHint,
  rect,
}: {
  s: S
  keyHint: boolean
  rect: (name: string) => {
    x: number
    y: number
    width: number
    height: number
  }
}) {
  const word = CHIPS[RIGHT]!
  return (
    <>
      <div className="bn-sentence" lang="es">
        <span>{BEFORE}</span>
        <span className="bn-gap" data-filled={s.placed || undefined}>
          {/* Every chip, hidden, sets the gap's width to the longest word */}
          {CHIPS.map((c) => (
            <span key={c} className="bn-gap__size" aria-hidden>
              {c}
            </span>
          ))}
          <span
            className="bn-gap__word"
            data-target="gap-word"
            data-shown={s.placed || undefined}
          >
            <Chip word={word} state={s.checked ? "correct" : "placed"} />
          </span>
          {!s.placed && !s.flying && (
            <span className="bn-caret" aria-hidden>
              <span />
            </span>
          )}
        </span>
        <span>{AFTER}</span>
      </div>
      <div className="bn-bank">
        {CHIPS.map((c, i) => (
          <Chip
            key={c}
            word={c}
            index={i}
            keyHint={keyHint}
            hideKey={s.checked}
            state={i === RIGHT && (s.flying || s.placed) ? "gone" : undefined}
            data-target={`chip-${i}`}
            data-cursor="pointer"
          />
        ))}
      </div>
      {/* The flyer waits over its chip in the bank, flies, and is gone once the word is in the gap */}
      {!s.placed && (
        <Fly
          from={rect(`chip-${RIGHT}`)}
          to={rect("gap-word")}
          go={s.flying}
          held
        >
          {/* Drawn at the bank chip's size, its key's room included, so it leaves at one size and lands at another */}
          <Chip
            word={word}
            index={RIGHT}
            keyHint={keyHint}
            hideKey
            state="placed"
          />
        </Fly>
      )}
    </>
  )
}

/** The desktop player: the lesson card inset top-left and off the right, the tray along its foot. */
function Desktop({ width }: { width: number }) {
  return (
    <Stage<S>
      width={width}
      height={300}
      theme="dark"
      palette="mono"
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      cursor={{ at: { x: width - 60, y: 270 }, style: "arrow" }}
      className="bn-stage"
    >
      {(s, rect) => (
        <div className="bn-card" style={{ width: width + 60 }}>
          <div className="bn-kata">
            <div className="bn-prompt">{PROMPT}</div>
            <Blank s={s} keyHint rect={rect} />
          </div>
          <div className="bn-sensei" data-on={s.checked || undefined}>
            <Mark size={28} className="bn-sensei__mark" />
            <span className="bn-bubble">{PRAISE}</span>
          </div>
          <div className="bn-tray" data-checked={s.checked || undefined}>
            <span
              className="bn-button"
              data-target="check"
              data-cursor="pointer"
              data-ready={s.placed || undefined}
              data-done={s.checked || undefined}
            >
              <States
                value={s.checked ? "next" : "check"}
                states={{ check: "Check answer", next: "Continue" }}
              />
            </span>
          </div>
        </div>
      )}
    </Stage>
  )
}

/** The phone player: the header, the kata, and the tray that takes the answer's color. */
function Phone() {
  return (
    <Stage<S>
      width={358}
      height={370}
      theme="dark"
      palette="mono"
      initial={initial}
      poster={poster}
      script={script}
      play="once"
      cursor={{ at: { x: 300, y: 350 }, style: "touch" }}
      className="bn-stage bn-stage--phone"
    >
      {(s, rect) => (
        <div className="bn-screen">
          <header className="bn-head">
            <Mark size={22} />
            <span className="bn-progress">
              <span
                className="bn-progress__fill"
                style={{ width: s.checked ? "38%" : "30%" }}
              />
            </span>
            <span className="bn-menu" aria-hidden>
              <span />
              <span />
              <span />
            </span>
          </header>
          <div className="bn-kata">
            <div className="bn-prompt">{PROMPT}</div>
            <Blank s={s} keyHint={false} rect={rect} />
          </div>
          <div className="bn-tray" data-checked={s.checked || undefined}>
            <div className="bn-tray__line">{PRAISE}</div>
            <span
              className="bn-button"
              data-target="check"
              data-cursor="pointer"
              data-ready={s.placed || undefined}
              data-done={s.checked || undefined}
            >
              <Mark size={20} className="bn-button__mark" />
              <States
                value={s.checked ? "next" : "check"}
                states={{ check: "Check answer", next: "Continue" }}
              />
            </span>
          </div>
        </div>
      )}
    </Stage>
  )
}

// Both players are in the HTML, and the tile's width picks one (bento.css), so a phone never sees
// the desktop card first.
function Kata() {
  const [picture, width] = usePictureWidth()
  return (
    <Tile
      name="kata"
      lead="One screen at a time."
      picture={
        <div
          ref={picture}
          className="absolute inset-x-0 bottom-0"
          role="img"
          aria-label="A word chip dropped into a gap in a Spanish sentence, checked, and marked right."
        >
          <div className="bn-player bn-player--desktop">
            <Desktop width={width} />
          </div>
          <div className="bn-player bn-player--phone">
            <Phone />
          </div>
        </div>
      }
    >
      Tap, check, continue, with feedback on every answer.
    </Tile>
  )
}

/* ---------------- Agents (collection) ---------------- */

// Terminal agents and chat apps, interleaved, so the first row has both kinds.
const MARKS = [
  AGENTS[0],
  SETUPS.mcp.agents[0],
  AGENTS[1],
  SETUPS.mcp.agents[1],
  AGENTS[2],
  AGENTS[3],
  AGENTS[4],
  SETUPS.mcp.agents[2],
  ...AGENTS.slice(5),
]

function Agents() {
  const [ref, on] = useInView<HTMLDivElement>(LEAD + STEP)
  return (
    <Tile
      name="agents"
      lead="Any agent."
      picture={
        <div
          ref={ref}
          className="bn-marks"
          data-on={on || undefined}
          role="img"
          aria-label={MARKS.map((m) => m.name).join(", ")}
        >
          {MARKS.map((m, i) => (
            <span
              key={m.name}
              className="bn-mark"
              data-lead={i === 0 || undefined}
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              <span className="bn-mark__logo" style={logoMask(m.logo)} />
            </span>
          ))}
        </div>
      }
    >
      Terminal or chat: the skill, or the MCP server.
    </Tile>
  )
}

/* ---------------- Subjects (collection) ---------------- */

const CARDS = [
  { name: "arabic", alt: "A question in Arabic: why is the sky blue?" },
  {
    name: "map",
    alt: "A map of Europe with the six founders of the EU shaded.",
  },
  { name: "chess", alt: "A chess position, the Italian Game." },
  {
    name: "chart",
    alt: "A chart: compound interest curving above simple interest.",
  },
  { name: "molecule", alt: "The caffeine molecule." },
  { name: "clock", alt: "A clock showing a quarter to four." },
] as const

function Subjects() {
  const [ref, on] = useInView<HTMLDivElement>(LEAD + 2 * STEP)
  return (
    <Tile
      name="subjects"
      lead="Any subject, any language."
      picture={
        <div
          ref={ref}
          className="bn-cards"
          data-on={on || undefined}
          role="img"
          aria-label={CARDS.map((c) => c.alt).join(" ")}
        >
          {CARDS.map((c, i) => (
            <div
              key={c.name}
              className="bn-lesson"
              data-visual={c.name}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {c.name === "arabic" ? (
                <div className="bn-arabic" dir="rtl" lang="ar">
                  <div className="bn-arabic__q">لماذا السماء زرقاء؟</div>
                  <div className="bn-arabic__opt">يشتت الهواء الضوء الأزرق</div>
                  <div className="bn-arabic__opt">يعكس البحر لونه</div>
                </div>
              ) : (
                <div
                  className="bn-lesson__visual"
                  dangerouslySetInnerHTML={{ __html: visuals[c.name] }}
                />
              )}
            </div>
          ))}
        </div>
      }
    >
      Chess, code, maps, molecules, in the learner&apos;s own language.
    </Tile>
  )
}

/* ---------------- Streak (stat) ---------------- */

// This week so far: learned, learned, learned, a rest day, learned, learned, and today's lantern
// still to light.
const WEEK = [
  { letter: "M", look: "lit" },
  { letter: "T", look: "lit" },
  { letter: "W", look: "lit" },
  { letter: "T", look: "rest" },
  { letter: "F", look: "lit" },
  { letter: "S", look: "lit" },
  { letter: "S", look: "today" },
] as const

function Streak() {
  const [ref, on] = useInView<HTMLDivElement>(LEAD + 3 * STEP)
  return (
    <Tile
      name="streak"
      lead="Keep a streak."
      picture={
        <div
          ref={ref}
          className="bn-streak"
          data-on={on || undefined}
          role="img"
          aria-label="A twelve-day streak: this week's lanterns, one of them a rest day, and today's lighting up."
        >
          <div className="bn-streak__count">
            <span className="bn-streak__number">
              <Count value={on ? 12 : 11} duration={900} />
            </span>
            <span className="bn-streak__label">day streak</span>
          </div>
          <Lantern
            look={on ? "lit" : "unlit"}
            big
            strokeWidth={1.25}
            className="bn-streak__lantern size-24"
          />
          <ol className="bn-week">
            {WEEK.map((d, i) => (
              <li key={i} data-today={d.look === "today" || undefined}>
                <Lantern
                  look={d.look === "today" ? (on ? "lit" : "unlit") : d.look}
                  className="size-[18px]"
                />
                <span>{d.letter}</span>
              </li>
            ))}
          </ol>
        </div>
      }
    >
      A lantern a day, rest days included.
    </Tile>
  )
}
