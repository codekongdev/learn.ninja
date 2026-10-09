"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { LightbulbIcon, PanelRightIcon } from "lucide-react"

import type { Lesson, QuestionBrick } from "@workspace/spec"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { DirectionProvider } from "@workspace/ui/components/direction"
import { cn } from "@workspace/ui/lib/utils"

import {
  checkAnswer,
  initialAnswer,
  isReady,
  retryAnswer,
  shuffle,
  solution,
  solutionMarks,
  type Answer,
  type CheckResult,
  type Mark,
} from "./check"
import { PlayerProvider, usePlayer } from "./context"
import {
  hasOptionCards,
  BlankBrick,
  ConceptBrick,
  HotspotBrick,
  MatchBrick,
  Explanation,
  explanationAnchor,
  OptionsBrick,
  OrderBrick,
  SortBrick,
} from "./bricks"
import {
  buildSequence,
  outcomeFor,
  partAt,
  summarize,
  type Item,
  type Outcome,
  type Role,
} from "./flow"
import { Aura, hueFor, NinjaStage, type NinjaCue } from "./ninja"
import { emptyPrepared, type Prepared } from "./prepared"
import { seeded } from "./random"
import { plainText, RichText } from "./rich-text"
import {
  AppSettings,
  LessonFooter,
  LessonHeader,
  PanelRightFilledIcon,
  PlayerSettings,
  TheoryPanel,
  TRAY_BUTTON,
  usePreferences,
  type Preferences,
} from "./shell"
import {
  ariaLocaleFor,
  stringsFor,
  type NinjaLevel,
  type Strings,
  type TextSize,
  type Theme,
} from "./strings"
import { Visual } from "./visuals"
import { createLinePicker, voiceLines, type Moment } from "./voices"

export interface LessonPlayerProps {
  lesson: Lesson
  /** Formulas and code prepared on the server (prepareLesson). */
  prepared?: Prepared
  /** Language of the player's own text. Defaults to the viewer's saved choice, then the lesson's language. */
  uiLanguage?: string
  /** When the lesson link expires (ms since epoch). Omit to hide the expiry note. */
  expiresAt?: number
  /** Stylesheet loaded inside the sandbox for HTML visuals. */
  visualsCss?: string
  /** Where the logo in the header goes. */
  homeHref?: string
  /** The Docs link in the footer, and the Create button in the header. Omit either to hide it. */
  docsHref?: string
  createHref?: string
  /** Footer links to the legal pages. Omit either to hide it. */
  privacyHref?: string
  termsHref?: string
  /** The link Share copies. Defaults to the current page. */
  shareUrl?: string
  /** The app's color theme. Pass both to show the theme setting in the footer. */
  theme?: Theme
  onThemeChange?: (theme: Theme) => void
  /** Called when the learner renames the lesson in the header. The player shows the new name either way. */
  onRename?: (title: string) => void
  /** For demos: open on this brick instead of the intro, shuffled the same way on the server and in the browser. */
  startAt?: string
  /** For demos on a page with other players: only take keyboard shortcuts from inside this player. */
  scopeKeys?: boolean
  /** For product shots: just the lesson window, without the header and footer. */
  chrome?: boolean
}

export function LessonPlayer({
  lesson,
  prepared = emptyPrepared,
  uiLanguage,
  expiresAt,
  visualsCss = "/lesson-visuals.css",
  homeHref = "/",
  docsHref,
  createHref,
  privacyHref,
  termsHref,
  shareUrl,
  theme,
  onThemeChange,
  onRename,
  startAt,
  scopeKeys = false,
  chrome = true,
}: LessonPlayerProps) {
  const root = React.useRef<HTMLDivElement>(null)
  // The title as shown, which a rename in the header changes.
  const [title, setTitle] = React.useState(lesson.title)
  React.useEffect(() => setTitle(lesson.title), [lesson.title])
  const shown = React.useMemo(() => ({ ...lesson, title }), [lesson, title])
  const [prefs, setPrefs] = usePreferences()
  const coarse = useCoarsePointer()
  // The keyboard shortcuts dialog lives in the footer; "?" (handled in the player) opens it too.
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false)
  // A choice made in the footer wins over the page's default for this session.
  const [chosen, setChosen] = React.useState<string>()
  const ui = chosen ?? uiLanguage ?? prefs.uiLanguage ?? lesson.language
  const t = stringsFor(ui)
  const locale = ariaLocaleFor(ui)
  const dir = /^(ar|he|fa|ur)\b/i.test(ui) ? "rtl" : "ltr"
  return (
    <DirectionProvider locale={locale}>
      <PlayerProvider
        value={{
          prepared,
          t,
          lang: ui,
          dir,
          visualsCss,
          keyScope: scopeKeys ? root : undefined,
        }}
      >
        <div
          ref={root}
          dir={dir}
          lang={ui}
          className="flex h-full min-h-0 flex-col bg-background text-foreground"
        >
          <Player
            lesson={shown}
            startAt={startAt}
            onRename={(next) => {
              setTitle(next)
              onRename?.(next)
            }}
            prefs={prefs}
            onPrefs={setPrefs}
            onShortcuts={() => setShortcutsOpen((open) => !open)}
            headerSettings={
              <AppSettings
                theme={theme}
                onThemeChange={onThemeChange}
                uiLanguage={ui}
                onPrefs={(patch) => {
                  if (patch.uiLanguage) setChosen(patch.uiLanguage)
                  setPrefs(patch)
                }}
                t={t}
              />
            }
            // Touch screens have no hotkeys to fall back on, so the tray stays open there.
            trayOpen={coarse || prefs.tray !== "closed"}
            onTrayToggle={() =>
              setPrefs({ tray: prefs.tray === "closed" ? "open" : "closed" })
            }
            expiresAt={expiresAt}
            homeHref={homeHref}
            createHref={createHref}
            shareUrl={shareUrl}
            chrome={chrome}
          />
          {chrome ? (
            <LessonFooter
              homeHref={homeHref}
              privacyHref={privacyHref}
              termsHref={termsHref}
              docsHref={docsHref}
              t={t}
              shortcutsOpen={shortcutsOpen}
              onShortcutsChange={setShortcutsOpen}
            />
          ) : null}
        </div>
      </PlayerProvider>
    </DirectionProvider>
  )
}

// ---------- state ----------

type Phase = "answering" | "feedback" | "revealed"

export interface QuestionState {
  answer: Answer
  attempts: number
  usedHint: boolean
  hintOpen: boolean
  /** The explanation is open under the answer: after "Why?", or once the answer is revealed. */
  whyOpen: boolean
  result: CheckResult | null
  phase: Phase
  /** Display order for options and match columns, fixed for the life of the question. */
  optionOrder: string[]
  rightOrder: number[]
  bank: string[]
}

export interface State {
  items: Item[]
  index: number
  results: Record<string, Outcome>
  mistakes: QuestionBrick[]
  inFix: boolean
  fixQueued: boolean
  question: QuestionState | null
}

/** `random` is for a fixed order, e.g. a demo rendered on the server that must match on the client. */
export function freshQuestion(
  item: Item | undefined,
  random: () => number = Math.random
): QuestionState | null {
  if (!item || item.kind !== "question") return null
  const brick = item.brick
  const optionIds =
    "options" in brick
      ? (brick.options as { id: string }[]).map((o) => o.id)
      : []
  return {
    answer: initialAnswer(brick, random),
    attempts: 0,
    usedHint: false,
    hintOpen: false,
    whyOpen: false,
    result: null,
    phase: "answering",
    optionOrder:
      brick.type === "compare" ? optionIds : shuffle(optionIds, random),
    rightOrder:
      brick.type === "match"
        ? shuffle(
            brick.pairs.map((_, i) => i),
            random
          )
        : [],
    bank: brick.type === "blank" ? shuffle(wordBank(brick), random) : [],
  }
}

/**
 * The word chips for a blank brick: every choice once, except a word that more than one gap accepts,
 * which gets a chip per such gap (otherwise the second gap could never be filled).
 */
export function wordBank(brick: Extract<QuestionBrick, { type: "blank" }>) {
  const words = [...new Set(brick.blanks.flatMap((b) => b.choices ?? []))]
  return words.flatMap((word) => {
    const needed = brick.blanks.filter((b) => b.accept.includes(word)).length
    return Array<string>(Math.max(1, needed)).fill(word)
  })
}

function start(lesson: Lesson, startAt?: string): State {
  const items = buildSequence(lesson)
  // A demo opens on one brick; its shuffle is seeded so the server and the browser agree.
  const at = startAt
    ? items.findIndex((i) => "brick" in i && i.brick.id === startAt)
    : -1
  const index = at < 0 ? 0 : at
  return {
    items,
    index,
    results: {},
    mistakes: [],
    inFix: false,
    fixQueued: false,
    question: at < 0 ? null : freshQuestion(items[index], seeded(startAt!)),
  }
}

export type Action =
  | { type: "next" }
  | { type: "restart"; lesson: Lesson }
  | { type: "answer"; answer: Answer }
  | { type: "hint" }
  | { type: "why" }
  | { type: "check" }
  | { type: "retry" }
  | { type: "startFix" }

export function reducer(state: State, action: Action): State {
  const item = state.items[state.index]
  switch (action.type) {
    case "restart":
      return start(action.lesson)
    case "next": {
      let index = state.index + 1
      if (
        state.items[index]?.kind === "fix" &&
        state.mistakes.length === 0 &&
        !state.fixQueued
      )
        index++
      const nextItem = state.items[index]
      return {
        ...state,
        index,
        inFix: state.inFix || nextItem?.kind === "fix",
        question: freshQuestion(nextItem),
      }
    }
    case "startFix": {
      const retries: Item[] = state.mistakes.map((brick) => ({
        kind: "question",
        brick,
        role: "fix",
      }))
      const items = [
        ...state.items.slice(0, state.index + 1),
        ...retries,
        ...state.items.slice(state.index + 1),
      ]
      const index = state.index + 1
      return {
        ...state,
        items,
        index,
        mistakes: [],
        fixQueued: true,
        question: freshQuestion(items[index]),
      }
    }
    case "answer":
      // A change to the answer clears the marks kept from the last check.
      return state.question
        ? {
            ...state,
            question: {
              ...state.question,
              answer: action.answer,
              result: null,
            },
          }
        : state
    case "hint":
      return state.question
        ? {
            ...state,
            question: { ...state.question, usedHint: true, hintOpen: true },
          }
        : state
    case "why":
      return state.question
        ? { ...state, question: { ...state.question, whyOpen: true } }
        : state
    case "retry": {
      // The last check's marks stay until the answer changes, so the learner can see what to fix.
      if (!state.question || item?.kind !== "question") return state
      return {
        ...state,
        question: {
          ...state.question,
          phase: "answering",
          answer: retryAnswer(item.brick, state.question.answer),
        },
      }
    }
    case "check": {
      if (!state.question || item?.kind !== "question") return state
      const { brick, role } = item
      const s = state.question
      const result = checkAnswer(brick, s.answer)
      if (role === "hook")
        return { ...state, question: { ...s, result, phase: "revealed" } }
      if (result.correct) {
        const results =
          role === "fix" || brick.id in state.results
            ? state.results
            : {
                ...state.results,
                [brick.id]: outcomeFor(s.attempts, s.usedHint),
              }
        return {
          ...state,
          results,
          question: { ...s, result, phase: "feedback" },
        }
      }
      const attempts = s.attempts + 1
      if (attempts < 2)
        return {
          ...state,
          question: { ...s, attempts, result, phase: "feedback" },
        }
      const results =
        role === "fix"
          ? state.results
          : { ...state.results, [brick.id]: "missed" as const }
      const mistakes =
        role === "fix" ? state.mistakes : [...state.mistakes, brick]
      return {
        ...state,
        results,
        mistakes,
        question: {
          ...s,
          attempts,
          result,
          phase: "revealed",
          answer: solution(brick),
        },
      }
    }
  }
}

// ---------- player ----------

/** The Theory button and panel are hidden while the feature is being redesigned. */
const SHOW_THEORY = false

function Player({
  lesson,
  prefs,
  onPrefs,
  onShortcuts,
  headerSettings,
  trayOpen,
  onTrayToggle,
  onRename,
  startAt,
  chrome = true,
  expiresAt,
  homeHref,
  createHref,
  shareUrl,
}: {
  lesson: Lesson
  prefs: Preferences
  onPrefs: (patch: Partial<Preferences>) => void
  /** "?" was pressed: show (or hide) the keyboard shortcuts. */
  onShortcuts: () => void
  /** The app's settings, shown in the header. */
  headerSettings?: React.ReactNode
  trayOpen: boolean
  onTrayToggle: () => void
  onRename: (title: string) => void
  startAt?: string
  chrome?: boolean
  expiresAt?: number
  homeHref: string
  createHref?: string
  shareUrl?: string
}) {
  const { t, keyScope } = usePlayer()
  const { textSize } = prefs
  const ninja: NinjaLevel = prefs.ninja ?? "normal"
  const [state, dispatch] = React.useReducer(reducer, lesson, (l) =>
    start(l, startAt)
  )
  const [theoryOpen, setTheoryOpen] = React.useState(false)
  // Theory starts open where there's room for it beside the lesson.
  React.useEffect(() => {
    if (SHOW_THEORY && matchMedia("(min-width: 64rem)").matches)
      setTheoryOpen(true)
  }, [])
  const theoryId = React.useId()
  const item = state.items[state.index]!
  const scrollRef = React.useRef<HTMLElement>(null)
  // Each new screen starts at the top and takes focus, so keyboard and screen-reader users land on it.
  // Not on mount (a demo on a page must not pull focus), and robust to React running effects twice.
  const shownIndex = React.useRef(state.index)
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
    if (shownIndex.current !== state.index)
      scrollRef.current?.focus({ preventScroll: true })
    shownIndex.current = state.index
  }, [state.index])
  const parts = partAt(state.items, state.index, state.inFix)
  const coarse = useCoarsePointer()
  // The tray holds the screen's buttons in the middle and the player's settings at the end. The notch
  // opens and closes it (Enter keeps working either way); the buttons render into `actionsEl`.
  const [trayEl, setTrayEl] = React.useState<HTMLDivElement | null>(null)
  const [actionsEl, setActionsEl] = React.useState<HTMLDivElement | null>(
    null
  )
  const trayId = React.useId()
  // The tray's natural height, and its height while the notch is being dragged.
  const [trayHeight, setTrayHeight] = React.useState(0)
  const [dragHeight, setDragHeight] = React.useState<number | null>(null)
  // The same value in a ref: a quick flick can end before the state from its last move has rendered.
  const dragRef = React.useRef<number | null>(null)
  React.useEffect(() => {
    if (!trayEl) return
    const measure = () => setTrayHeight(trayEl.offsetHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(trayEl)
    return () => observer.disconnect()
  }, [trayEl])
  const shownHeight = dragHeight ?? (trayOpen ? trayHeight : 0)
  // "?" shows the keyboard shortcuts, as it does on most of the web.
  const shortcuts = React.useRef(onShortcuts)
  shortcuts.current = onShortcuts
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "?" || e.repeat || e.metaKey || e.ctrlKey || e.altKey)
        return
      const target = e.target as HTMLElement | null
      if (keyScope && !keyScope.current?.contains(target)) return
      if (target?.closest("input, textarea, select, [contenteditable=true]"))
        return
      e.preventDefault()
      shortcuts.current()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [keyScope])
  const seenConcepts = state.items
    .slice(0, state.index + 1)
    .flatMap((i) => (i.kind === "concept" ? [i.brick] : []))
  // The ninja lives on the card and reacts to each check: pleased when it's right, sorry when it's not.
  const cardRef = React.useRef<HTMLDivElement>(null)
  const q = state.question
  const cue: NinjaCue | null =
    item.kind === "question" && q?.result && q.phase !== "answering"
      ? {
          kind: q.result.correct ? "happy" : "sad",
          key: `${state.index}-${q.attempts}-${q.phase}`,
        }
      : null

  return (
    <>
      {chrome ? (
        <LessonHeader
          title={lesson.title}
          parts={parts}
          showParts={item.kind !== "intro"}
          expiresAt={expiresAt}
          homeHref={homeHref}
          createHref={createHref}
          shareUrl={shareUrl}
          settings={headerSettings}
          onRestart={() => {
            setTheoryOpen(false)
            dispatch({ type: "restart", lesson })
          }}
          onRename={onRename}
          t={t}
        />
      ) : null}
      <div
        className={cn(
          "relative flex min-h-0 flex-1 gap-4 sm:px-8",
          !chrome && "sm:px-0"
        )}
      >
        {/* The window: the content card on the tray's grey, so the card's corners stay round above it. */}
        <div
          className={cn(
            "relative flex min-w-0 flex-1 overflow-hidden border-y bg-muted sm:rounded-4xl sm:border",
            // In a product shot the mock browser frames the window; its own border would double up.
            !chrome && "border-0"
          )}
        >
          <div className="relative flex min-w-0 flex-1 flex-col">
            {SHOW_THEORY ? (
              <div className="absolute end-4 top-4 z-10 sm:end-6 sm:top-6">
                <Button
                  variant="outline"
                  size="sm"
                  aria-expanded={theoryOpen}
                  aria-controls={theoryOpen ? theoryId : undefined}
                  onPress={() => setTheoryOpen((open) => !open)}
                >
                  {t.theory}
                  {theoryOpen ? (
                    <PanelRightFilledIcon className="rtl:-scale-x-100" />
                  ) : (
                    <PanelRightIcon className="rtl:-scale-x-100" />
                  )}
                </Button>
              </div>
            ) : null}
            {/* The card's border sits on the window's, so the top reads as one line and the bottom as the card on the tray. */}
            <div
              ref={cardRef}
              className="relative isolate flex min-h-0 flex-1 flex-col bg-background sm:-m-px sm:rounded-4xl sm:border"
            >
              {item.kind === "intro" ? (
                <Aura
                  hue={hueFor(lesson.topic ?? lesson.title)}
                  // Half of the slot (88px) and its gap (20px): the content moves up this far without the ninja.
                  shift={ninja === "off" ? -54 : 0}
                />
              ) : null}
              <main
                ref={scrollRef}
                tabIndex={-1}
                className="min-h-0 flex-1 overflow-y-auto outline-none"
              >
                <div
                  key={state.index}
                  className={cn(
                    "mx-auto flex min-h-full w-full flex-col justify-center-safe gap-8 px-4 py-16 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1",
                    columnWidth(item),
                    item.kind === "question" && "pb-40"
                  )}
                >
                  <div
                    data-text-size={textSize}
                    className="flex flex-col gap-6"
                  >
                    <Screen
                      lesson={lesson}
                      item={item}
                      state={state}
                      dispatch={dispatch}
                      ninja={ninja !== "off"}
                    />
                  </div>
                  <ActionArea
                    lesson={lesson}
                    item={item}
                    state={state}
                    dispatch={dispatch}
                    textSize={textSize}
                    tray={{ el: actionsEl, id: trayId }}
                    ninja={ninja !== "off"}
                    level={ninja}
                  />
                </div>
              </main>
              {ninja !== "off" ? (
                <NinjaStage
                  area={cardRef}
                  screen={state.index}
                  cue={cue}
                  celebrate={item.kind === "wrap"}
                  level={ninja}
                />
              ) : null}
              {coarse ? null : (
                <TrayNotch
                  open={trayOpen}
                  controls={trayId}
                  onToggle={onTrayToggle}
                  onDrag={(dy) => {
                    const from = trayOpen ? trayHeight : 0
                    dragRef.current =
                      dy === null
                        ? null
                        : Math.min(trayHeight, Math.max(0, from - dy))
                    setDragHeight(dragRef.current)
                  }}
                  onDrop={() => {
                    const open = (dragRef.current ?? 0) > trayHeight / 2
                    if (open !== trayOpen) onTrayToggle()
                    dragRef.current = null
                    setDragHeight(null)
                  }}
                  t={t}
                />
              )}
            </div>
            {/* The tray stays mounted so it can slide; closed, it's clipped to nothing and inert. */}
            <div
              className={cn(
                "shrink-0 overflow-hidden",
                dragHeight === null &&
                  "transition-[height] duration-200 ease-out motion-reduce:transition-none"
              )}
              style={{ height: shownHeight }}
              inert={!trayOpen && dragHeight === null}
            >
              <div
                id={trayId}
                ref={setTrayEl}
                className="flex items-center gap-2 px-4 py-4"
              >
                {/* Equal sides keep the actions in the middle (they give way when a phone is too narrow). */}
                <div className="flex flex-1 items-center gap-1">
                  <PlayerSettings
                    side="start"
                    prefs={prefs}
                    onPrefs={onPrefs}
                    t={t}
                  />
                </div>
                <div
                  ref={setActionsEl}
                  className="flex flex-wrap items-center justify-center gap-2"
                />
                <div className="flex flex-1 items-center justify-end gap-1">
                  <PlayerSettings
                    side="end"
                    prefs={prefs}
                    onPrefs={onPrefs}
                    t={t}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {SHOW_THEORY && theoryOpen ? (
          <TheoryPanel
            id={theoryId}
            concepts={seenConcepts}
            onClose={() => setTheoryOpen(false)}
            t={t}
            textSize={textSize}
          />
        ) : null}
      </div>
    </>
  )
}

/**
 * Where the ninja stands on the intro and the wrap-up. With him off it folds shut (and swallows the
 * column's gap, passed as a negative margin class), so the rest of the screen stays centered.
 */
function NinjaSlot({ show, gap }: { show: boolean; gap: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "grid transition-[grid-template-rows,margin] duration-300 ease-out motion-reduce:transition-none",
        show ? "grid-rows-[1fr]" : cn("grid-rows-[0fr]", gap)
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div data-ninja-slot className="size-22" />
      </div>
    </div>
  )
}

/** Questions and short screens read best narrow; visuals and side-by-side bricks need room. */
function columnWidth(item: Item): string {
  if (item.kind === "intro") return "max-w-md"
  if (item.kind === "concept")
    return item.brick.visual ? "max-w-2xl" : "max-w-lg"
  if (item.kind !== "question") return "max-w-lg"
  const { brick } = item
  const wide =
    Boolean(brick.visual) ||
    hasOptionCards(brick) ||
    brick.type === "sort" ||
    brick.type === "match" ||
    brick.type === "hotspot"
  return wide ? "max-w-2xl" : "max-w-lg"
}

const Eyebrow = ({
  children,
  muted,
}: {
  children: React.ReactNode
  muted?: boolean
}) => (
  <div
    className={cn(
      "text-xs font-semibold tracking-[0.08em] uppercase",
      muted ? "text-muted-foreground" : "text-primary"
    )}
  >
    {children}
  </div>
)

/** Instructions under the prompt, only where the interaction isn't obvious (a single pick needs none). */
function helperFor(brick: QuestionBrick, t: Strings): string {
  switch (brick.type) {
    case "choice":
      return brick.multiple ? t.helper.choiceMany : ""
    case "compare":
    case "scenario":
    case "number":
      return ""
    case "hotspot":
      return brick.multiple ? t.helper.choiceMany : ""
    default:
      return t.helper[brick.type]
  }
}

export function Screen({
  lesson,
  item,
  state,
  dispatch,
  ninja = true,
}: {
  lesson: Lesson
  item: Item
  state: State
  dispatch: React.Dispatch<Action>
  /** Whether the ninja is on. Off, his slot folds away so the screen stays centered. */
  ninja?: boolean
}) {
  const { t } = usePlayer()
  switch (item.kind) {
    case "intro":
      return (
        // The ninja stands in the slot above the title (NinjaStage puts him there), in the lesson's light.
        <div className="flex flex-col items-center gap-5 text-center">
          <NinjaSlot show={ninja} gap="-mb-5" />
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {lesson.title}
            </h1>
            <p className="text-base font-medium text-pretty text-muted-foreground">
              {lesson.summary}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {lesson.topic ? (
              <Badge variant="outline">{lesson.topic}</Badge>
            ) : null}
            <Badge variant="outline">
              {t.minutes(lesson.estimatedMinutes)}
            </Badge>
            <Badge variant="outline">{t.levels[lesson.level]}</Badge>
          </div>
        </div>
      )
    case "concept":
      return <ConceptBrick brick={item.brick} />
    case "fix":
      return (
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">{t.fixTitle}</h2>
          <p className="text-sm font-medium text-muted-foreground">
            {t.fixBody(state.mistakes.length)}
          </p>
        </div>
      )
    case "wrap":
      return <WrapUp lesson={lesson} results={state.results} ninja={ninja} />
    case "question":
      return (
        <QuestionScreen
          item={item}
          state={state.question!}
          dispatch={dispatch}
        />
      )
  }
}

/** The explanation opens after "Why?", and by itself once a missed answer is revealed (not for the hook's guess). */
function explanationShown(s: QuestionState, role: Role): boolean {
  return s.whyOpen || (s.phase === "revealed" && role !== "hook")
}

function QuestionScreen({
  item,
  state,
  dispatch,
}: {
  item: Extract<Item, { kind: "question" }>
  state: QuestionState
  dispatch: React.Dispatch<Action>
}) {
  const { t } = usePlayer()
  const { brick, role } = item
  const locked = state.phase !== "answering"
  // After a second miss, show the solution. Where the marks name options (not positions in the
  // learner's answer), the last pick keeps its mark beside the right one.
  const keepsPick =
    role === "hook" ||
    brick.type === "choice" ||
    brick.type === "compare" ||
    brick.type === "scenario" ||
    brick.type === "hotspot"
  const marks: Record<string, Mark> =
    state.phase !== "revealed"
      ? (state.result?.marks ?? {})
      : keepsPick
        ? { ...solutionMarks(brick), ...state.result?.marks }
        : solutionMarks(brick)
  const explanation = explanationShown(state, role) ? brick.explanation : null
  const props = {
    brick,
    answer: state.answer,
    setAnswer: (answer: Answer) => dispatch({ type: "answer", answer }),
    marks,
    locked,
  }
  const helper = helperFor(brick, t)
  const showOutcomes =
    brick.type === "scenario" && state.result
      ? [
          ...(state.answer.kind === "select" ? state.answer.ids : []),
          ...(state.phase === "revealed"
            ? brick.options.filter((o) => o.quality === "best").map((o) => o.id)
            : []),
        ]
      : []

  return (
    <>
      <h2 className="text-lg font-semibold">
        <RichText text={brick.prompt} />
      </h2>
      {helper && helper !== brick.prompt ? (
        <p className="-mt-4 text-sm text-muted-foreground">{helper}</p>
      ) : null}
      {brick.type === "scenario" ? (
        <div className="rounded-e-lg border-s-2 border-primary bg-muted px-4 py-3 text-base">
          <RichText text={brick.situation} />
        </div>
      ) : null}
      {brick.visual && brick.type !== "hotspot" ? (
        <Visual visual={brick.visual} />
      ) : null}
      {brick.type === "choice" ||
      brick.type === "compare" ||
      brick.type === "scenario" ? (
        <OptionsBrick
          {...props}
          order={state.optionOrder}
          showOutcomes={showOutcomes}
          explanation={explanation}
        />
      ) : brick.type === "hotspot" ? (
        <HotspotBrick {...props} />
      ) : brick.type === "sort" ? (
        <SortBrick {...props} />
      ) : brick.type === "order" ? (
        <OrderBrick {...props} />
      ) : brick.type === "match" ? (
        <MatchBrick {...props} rightOrder={state.rightOrder} />
      ) : brick.type === "blank" ? (
        <BlankBrick {...props} bank={state.bank} />
      ) : null}
      {explanation && !explanationAnchor(brick, marks) ? (
        <Explanation text={explanation} />
      ) : null}
      {state.hintOpen && brick.hint ? (
        <Alert>
          <LightbulbIcon aria-hidden="true" />
          <AlertDescription className="text-base text-foreground">
            <RichText text={brick.hint} />
          </AlertDescription>
        </Alert>
      ) : null}
    </>
  )
}

function WrapUp({
  lesson,
  results,
  ninja = true,
}: {
  lesson: Lesson
  results: Record<string, Outcome>
  ninja?: boolean
}) {
  const { t } = usePlayer()
  const s = summarize(lesson, results)
  const pct = Math.round((s.first / s.total) * 100)
  const rows: [string, number, string][] = [
    ["bg-green-600", s.first, t.firstTry],
    ["bg-amber-500", s.hint, t.withHint],
    ["bg-primary", s.second, t.secondTry],
    ["bg-red-600", s.missed, t.missed],
  ]
  return (
    <div className="flex flex-col gap-6">
      {/* The ninja leaps up from the corner to cheer here (NinjaStage). */}
      <NinjaSlot show={ninja} gap="-mb-6" />
      <Eyebrow>{lesson.title}</Eyebrow>
      <h1 className="-mt-4 text-2xl font-semibold">{t.done}</h1>
      <div className="flex flex-wrap items-center gap-6">
        <div
          className="grid size-32 place-items-center rounded-full"
          style={{
            background: `conic-gradient(var(--color-green-600) ${pct}%, var(--muted) 0)`,
          }}
        >
          <div className="grid size-24 place-items-center rounded-full bg-card text-center">
            <div className="text-3xl font-extrabold tabular-nums">
              {s.first}/{s.total}
            </div>
          </div>
        </div>
        <ul className="grid gap-1.5 text-base">
          {rows.map(([color, n, label]) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={cn("size-2.5 rounded-full", color)}
                aria-hidden="true"
              />
              <span className="tabular-nums">{n}</span> {label}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <Eyebrow muted>{t.takeaways}</Eyebrow>
        <ul className="grid gap-2.5">
          {lesson.wrapup.takeaways.map((k) => (
            <li key={k}>
              <Card size="sm">
                <CardContent className="text-base">
                  <RichText text={k} />
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
        {lesson.wrapup.next ? (
          <p className="text-base text-muted-foreground">
            {t.next}:{" "}
            <strong className="text-foreground">{lesson.wrapup.next}</strong>
          </p>
        ) : null}
      </div>
    </div>
  )
}

// ---------- action bar ----------

type Tone = "neutral" | "good" | "warn"

/** The screen's main action (Enter runs it; the shortcuts dialog says so), and the feedback after checking. */
export function ActionArea({
  lesson,
  item,
  state,
  dispatch,
  textSize,
  tray,
  ninja = true,
  level = "normal",
}: {
  lesson: Lesson
  item: Item
  state: State
  dispatch: React.Dispatch<Action>
  textSize: TextSize
  /** The tray the buttons render into. `el` is null while it's closed: the buttons hide, Enter still works. */
  tray?: { el: HTMLDivElement | null; id: string }
  /** Whether the ninja is in the card's corner, so the feedback toast leaves him room. */
  ninja?: boolean
  /** The ninja's character, which picks the voice of the feedback lines. */
  level?: NinjaLevel
}) {
  const { t, keyScope, lang = "en" } = usePlayer()
  const pickLine = React.useMemo(
    () => createLinePicker(lesson.title),
    [lesson.title]
  )
  let tone: Tone = "neutral"
  let title: string | null = null
  let message: string | null = null
  let primary: {
    label: string
    onPress: () => void
    isDisabled?: boolean
    variant?: "default" | "warning" | "success"
  } = {
    label: t.continue,
    onPress: () => dispatch({ type: "next" }),
  }
  let secondary: React.ReactNode = null
  // "Why?" opens the explanation under the answer, so feedback stays one short line until the learner asks.
  let explanation: string | null = null
  const helpButton = (label: string, onPress: () => void) => (
    <Button
      variant="outline"
      size={tray ? "lg" : "sm"}
      className={cn(tray && TRAY_BUTTON)}
      onPress={onPress}
    >
      {label}
    </Button>
  )

  if (item.kind === "intro")
    primary = { label: t.start, onPress: () => dispatch({ type: "next" }) }
  else if (item.kind === "fix")
    primary = {
      label: t.fixStart,
      onPress: () => dispatch({ type: "startFix" }),
    }
  else if (item.kind === "wrap") {
    primary = {
      label: t.restart,
      onPress: () => dispatch({ type: "restart", lesson }),
    }
  } else if (item.kind === "question" && state.question) {
    const s = state.question
    const { brick, role } = item
    const r = s.result
    // One line per piece of feedback, from the character's voice, without repeats.
    const say = (moment: Moment) =>
      pickLine(
        `${state.index}-${s.attempts}-${s.phase}-${moment}-${level}`,
        voiceLines(lang, level, moment, t)
      )
    const canHelp = Boolean(brick.hint) && role !== "hook" && !s.usedHint
    const missText = (res: CheckResult) =>
      res.feedback ?? (res.missKey ? missMessage(res, t) : null)
    if (s.phase === "answering") {
      primary = {
        label: t.check,
        onPress: () => dispatch({ type: "check" }),
        isDisabled: !isReady(brick, s.answer),
      }
      if (canHelp)
        secondary = helpButton(t.getHelp, () => dispatch({ type: "hint" }))
    } else if (role === "hook" && r) {
      // The hook is a guess, so a miss still moves on, but both get the colors a checked answer would.
      tone = r.correct ? "good" : "warn"
      title = say(r.correct ? "goodGuess" : "hookMiss")
      explanation = brick.explanation
      primary = { ...primary, variant: r.correct ? "success" : "warning" }
    } else if (s.phase === "feedback" && r?.correct) {
      tone = "good"
      title = say(
        s.usedHint && s.attempts === 0 ? "correctWithHint" : "praise"
      )
      explanation = brick.explanation
      primary = { ...primary, variant: "success" }
    } else if (s.phase === "feedback" && r) {
      // A miss gets one short line: the option's own feedback, or a nudge to look again.
      tone = "warn"
      title = r.partial ? say("close") : (missText(r) ?? say("nudge"))
      message = r.partial ? missText(r) : null
      primary = {
        label: t.tryAgain,
        onPress: () => dispatch({ type: "retry" }),
        variant: "warning",
      }
      if (canHelp)
        secondary = helpButton(t.getHelp, () => {
          dispatch({ type: "retry" })
          dispatch({ type: "hint" })
        })
    } else if (s.phase === "revealed") {
      // The answer and why it's right open in the brick, so the toast only points there.
      title = say("answer")
      explanation = brick.explanation
    }
    if (explanation && !explanationShown(s, role))
      // The button goes once pressed, so focus moves on to Continue.
      secondary = helpButton(t.why, () => {
        dispatch({ type: "why" })
        primaryRef.current?.focus()
      })
  }
  const explanationOpen =
    item.kind === "question" &&
    state.question !== null &&
    explanationShown(state.question, item.role)

  // Enter runs the main action, including while an answer option has focus (Space still toggles it).
  const run = React.useRef(primary)
  run.current = primary
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.repeat || e.defaultPrevented) return
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
      const target = e.target as HTMLElement | null
      if (keyScope && !keyScope.current?.contains(target)) return
      const onOption = target?.closest("[data-slot=selectable]")
      if (
        !onOption &&
        target?.closest(
          "button, a, input, textarea, select, [role=grid], [role=menu], [role=dialog], [contenteditable=true]"
        )
      )
        return
      if (run.current.isDisabled) return
      e.preventDefault()
      e.stopPropagation()
      run.current.onPress()
    }
    window.addEventListener("keydown", onKey, { capture: true })
    return () => window.removeEventListener("keydown", onKey, { capture: true })
  }, [keyScope])

  // Once feedback appears, focus moves to its button (Continue or Try again). Not on mount: a demo
  // that loads already checked must not pull the page to itself.
  const primaryRef = React.useRef<HTMLButtonElement>(null)
  const hadFeedback = React.useRef(Boolean(title))
  React.useEffect(() => {
    const has = Boolean(title)
    if (has && !hadFeedback.current) primaryRef.current?.focus()
    hadFeedback.current = has
  }, [title])

  const toneClass: Record<Tone, string> = {
    neutral: "border-border bg-popover text-popover-foreground",
    // The marked rows' colors (markStyles in bricks.tsx), mixed into the page the way the browser blends them (sRGB), so the toast matches yet stays opaque.
    good: "border-green-600 bg-[color-mix(in_srgb,var(--color-green-600)_10%,var(--background))]",
    warn: "border-yellow-500 bg-[color-mix(in_srgb,var(--color-yellow-500)_10%,var(--background))]",
  }

  const buttons = (
    <>
      <Button
        ref={primaryRef}
        size={tray ? "lg" : "sm"}
        className={cn(tray && TRAY_BUTTON)}
        variant={primary.variant ?? "default"}
        onPress={primary.onPress}
        isDisabled={primary.isDisabled}
      >
        {primary.label}
      </Button>
      {secondary}
    </>
  )

  return (
    <>
      {tray ? (
        tray.el ? (
          createPortal(buttons, tray.el)
        ) : null
      ) : (
        <div className="flex flex-wrap items-center gap-2">{buttons}</div>
      )}
      <p aria-live="polite" className="sr-only">
        {title
          ? [title, message, explanationOpen ? explanation : null]
              .filter((x): x is string => Boolean(x))
              .map(plainText)
              .join(" ")
          : ""}
      </p>
      {title ? (
        <div
          key={`${state.index}-${state.question?.attempts ?? 0}-${tone}`}
          aria-hidden="true"
          data-text-size={textSize}
          className={cn(
            "absolute end-4 bottom-4 z-10 rounded-xl border px-4 py-3 shadow-xs motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 sm:end-auto sm:bottom-6 sm:w-fit sm:max-w-80",
            // In the player the ninja sits in the corner, so the toast starts beside him as a speech bubble:
            // the corner nearest him is squared off.
            tray && ninja
              ? "start-18 rounded-es-sm sm:start-20"
              : "start-4 sm:start-6",
            toneClass[tone]
          )}
        >
          <p className="text-sm font-semibold">
            <RichText text={title} />
          </p>
          {message ? (
            <RichText text={message} className="mt-1 block text-sm" />
          ) : null}
        </div>
      ) : null}
    </>
  )
}

/** True on touch screens (no hover, no keyboard to speak of). False until mounted. */
function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = React.useState(false)
  React.useEffect(() => {
    const query = matchMedia("(pointer: coarse)")
    const update = () => setCoarse(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  return coarse
}

/** A short bar on the content's bottom edge: click, press, or drag it to close or open the tray. */
function TrayNotch({
  open,
  controls,
  onToggle,
  onDrag,
  onDrop,
  t,
}: {
  open: boolean
  controls: string
  onToggle: () => void
  /** How far the pointer has moved down since it grabbed the notch, or null once released. */
  onDrag: (dy: number | null) => void
  /** The pointer let go after a drag: settle the tray open or closed. */
  onDrop: () => void
  t: Strings
}) {
  const SLOP = 4
  const start = React.useRef<number | null>(null)
  const dragged = React.useRef(false)
  const end = (e: React.PointerEvent) => {
    if (start.current === null) return
    start.current = null
    e.currentTarget.releasePointerCapture(e.pointerId)
    // Pointer capture keeps the pointer's release from reaching the button, so a plain tap toggles here.
    if (dragged.current) onDrop()
    else onToggle()
  }
  return (
    // Capture-phase handlers: the button's own press handling stops pointer events from bubbling.
    <div
      className="flex shrink-0 justify-center"
      style={{ touchAction: "none" }}
      onPointerDownCapture={(e) => {
        start.current = e.clientY
        dragged.current = false
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMoveCapture={(e) => {
        if (start.current === null) return
        const dy = e.clientY - start.current
        if (!dragged.current && Math.abs(dy) < SLOP) return
        dragged.current = true
        onDrag(dy)
      }}
      onPointerUpCapture={end}
      onPointerCancelCapture={end}
    >
      <Button
        variant="ghost"
        size="sm"
        aria-expanded={open}
        aria-controls={open ? controls : undefined}
        aria-label={open ? t.hideActions : t.showActions}
        onPress={(e) => {
          // Pointer presses are handled above; this is for Enter and Space.
          if (e.pointerType === "keyboard" || e.pointerType === "virtual")
            onToggle()
        }}
        // The hit area stays generous but invisible; only the bar reacts, like a grabber on iOS.
        className="h-7 w-24 cursor-ns-resize px-0 hover:bg-transparent active:translate-y-0 aria-expanded:bg-transparent dark:hover:bg-transparent"
      >
        <span
          aria-hidden="true"
          className="h-1.5 w-16 rounded-full bg-border transition-colors group-hover/button:bg-muted-foreground/60 group-active/button:bg-muted-foreground"
        />
      </Button>
    </div>
  )
}

function missMessage(r: CheckResult, t: Strings): string {
  switch (r.missKey) {
    case "sort":
      return t.miss.sort(r.count ?? 0)
    case "match":
      return t.miss.match(r.count ?? 0)
    case "missOne":
    case "hotspot":
    case "hotspotLine":
    case "order":
    case "blank":
      return t.miss[r.missKey]
    default:
      return ""
  }
}
