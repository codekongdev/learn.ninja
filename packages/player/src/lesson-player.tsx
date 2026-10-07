"use client"

import * as React from "react"
import { ClockIcon, LightbulbIcon, PanelRightIcon } from "lucide-react"

import type { Lesson, Step } from "@workspace/spec"
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
  BlankExercise,
  HotspotExercise,
  MatchExercise,
  OptionsExercise,
  OrderExercise,
  SortExercise,
} from "./exercises"
import {
  buildSequence,
  outcomeFor,
  progressAt,
  summarize,
  type Item,
  type Outcome,
  type Role,
} from "./flow"
import { Mascot, type MascotMood } from "./mascot"
import { emptyPrepared, type Prepared } from "./prepared"
import { RichText } from "./rich-text"
import {
  LessonFooter,
  LessonHeader,
  TheoryPanel,
  useHoursLeft,
  usePreferences,
} from "./shell"
import { ariaLocaleFor, stringsFor, type Strings, type Theme } from "./strings"
import { Visual } from "./visuals"

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
  /** The link Share copies. Defaults to the current page. */
  shareUrl?: string
  /** The app's color theme. Pass both to show the theme setting in the footer. */
  theme?: Theme
  onThemeChange?: (theme: Theme) => void
}

export function LessonPlayer({
  lesson,
  prepared = emptyPrepared,
  uiLanguage,
  expiresAt,
  visualsCss = "/lesson-visuals.css",
  homeHref = "/",
  shareUrl,
  theme,
  onThemeChange,
}: LessonPlayerProps) {
  const [prefs, setPrefs] = usePreferences()
  // A choice made in the footer wins over the page's default for this session.
  const [chosen, setChosen] = React.useState<string>()
  const ui = chosen ?? uiLanguage ?? prefs.uiLanguage ?? lesson.language
  const t = stringsFor(ui)
  const locale = ariaLocaleFor(ui)
  const dir = /^(ar|he|fa|ur)\b/i.test(ui) ? "rtl" : "ltr"
  return (
    <DirectionProvider locale={locale}>
      <PlayerProvider value={{ prepared, t, dir, visualsCss }}>
        <div
          dir={dir}
          lang={ui}
          className="flex h-full min-h-0 flex-col bg-background text-foreground"
        >
          <Player
            lesson={lesson}
            expiresAt={expiresAt}
            homeHref={homeHref}
            shareUrl={shareUrl}
          />
          <LessonFooter
            t={t}
            prefs={prefs}
            onPrefs={(patch) => {
              if (patch.uiLanguage) setChosen(patch.uiLanguage)
              setPrefs(patch)
            }}
            uiLanguage={ui}
            theme={theme}
            onThemeChange={onThemeChange}
          />
        </div>
      </PlayerProvider>
    </DirectionProvider>
  )
}

// ---------- state ----------

type Phase = "answering" | "feedback" | "revealed"

interface StepState {
  answer: Answer
  attempts: number
  usedHint: boolean
  hintOpen: boolean
  result: CheckResult | null
  phase: Phase
  /** Display order for options and match columns, fixed for the life of the step. */
  optionOrder: string[]
  rightOrder: number[]
  bank: string[]
}

interface State {
  items: Item[]
  index: number
  results: Record<string, Outcome>
  mistakes: Step[]
  inFix: boolean
  fixQueued: boolean
  step: StepState | null
}

function freshStep(item: Item | undefined): StepState | null {
  if (!item || item.kind !== "step") return null
  const step = item.step
  const optionIds =
    "options" in step ? (step.options as { id: string }[]).map((o) => o.id) : []
  return {
    answer: initialAnswer(step),
    attempts: 0,
    usedHint: false,
    hintOpen: false,
    result: null,
    phase: "answering",
    optionOrder: step.type === "compare" ? optionIds : shuffle(optionIds),
    rightOrder:
      step.type === "match" ? shuffle(step.pairs.map((_, i) => i)) : [],
    bank:
      step.type === "blank"
        ? shuffle([...new Set(step.blanks.flatMap((b) => b.choices ?? []))])
        : [],
  }
}

function start(lesson: Lesson): State {
  const items = buildSequence(lesson)
  return {
    items,
    index: 0,
    results: {},
    mistakes: [],
    inFix: false,
    fixQueued: false,
    step: null,
  }
}

type Action =
  | { type: "next" }
  | { type: "restart"; lesson: Lesson }
  | { type: "answer"; answer: Answer }
  | { type: "hint" }
  | { type: "check" }
  | { type: "retry" }
  | { type: "startFix" }

function reducer(state: State, action: Action): State {
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
        step: freshStep(nextItem),
      }
    }
    case "startFix": {
      const retries: Item[] = state.mistakes.map((step) => ({
        kind: "step",
        step,
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
        step: freshStep(items[index]),
      }
    }
    case "answer":
      return state.step
        ? { ...state, step: { ...state.step, answer: action.answer } }
        : state
    case "hint":
      return state.step
        ? { ...state, step: { ...state.step, usedHint: true, hintOpen: true } }
        : state
    case "retry": {
      if (!state.step || item?.kind !== "step") return state
      return {
        ...state,
        step: {
          ...state.step,
          phase: "answering",
          result: null,
          answer: retryAnswer(item.step, state.step.answer),
        },
      }
    }
    case "check": {
      if (!state.step || item?.kind !== "step") return state
      const { step, role } = item
      const s = state.step
      const result = checkAnswer(step, s.answer)
      if (role === "hook")
        return { ...state, step: { ...s, result, phase: "revealed" } }
      if (result.correct) {
        const results =
          role === "fix" || step.id in state.results
            ? state.results
            : {
                ...state.results,
                [step.id]: outcomeFor(s.attempts, s.usedHint),
              }
        return { ...state, results, step: { ...s, result, phase: "feedback" } }
      }
      const attempts = s.attempts + 1
      if (attempts < 2)
        return { ...state, step: { ...s, attempts, result, phase: "feedback" } }
      const results =
        role === "fix"
          ? state.results
          : { ...state.results, [step.id]: "missed" as const }
      const mistakes =
        role === "fix" ? state.mistakes : [...state.mistakes, step]
      return {
        ...state,
        results,
        mistakes,
        step: {
          ...s,
          attempts,
          result,
          phase: "revealed",
          answer: solution(step),
        },
      }
    }
  }
}

// ---------- player ----------

function Player({
  lesson,
  expiresAt,
  homeHref,
  shareUrl,
}: {
  lesson: Lesson
  expiresAt?: number
  homeHref: string
  shareUrl?: string
}) {
  const { t } = usePlayer()
  const [state, dispatch] = React.useReducer(reducer, lesson, start)
  const [theoryOpen, setTheoryOpen] = React.useState(false)
  const theoryId = React.useId()
  const item = state.items[state.index]!
  const scrollRef = React.useRef<HTMLElement>(null)
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [state.index])
  const progress = progressAt(state.items, state.index, state.inFix)
  const seenConcepts = state.items
    .slice(0, state.index + 1)
    .flatMap((i) => (i.kind === "concept" ? [i.concept] : []))

  return (
    <>
      <LessonHeader
        title={lesson.title}
        progress={progress}
        expiresAt={expiresAt}
        homeHref={homeHref}
        shareUrl={shareUrl}
        onRestart={() => {
          setTheoryOpen(false)
          dispatch({ type: "restart", lesson })
        }}
        t={t}
      />
      <div className="flex min-h-0 flex-1 sm:px-8">
        <div className="relative flex min-w-0 flex-1 overflow-hidden border-y bg-background sm:rounded-xl sm:border">
          <div className="relative flex min-w-0 flex-1 flex-col">
            <div className="absolute end-4 top-4 z-10 sm:end-6 sm:top-6">
              <Button
                variant="outline"
                size="xs"
                aria-expanded={theoryOpen}
                aria-controls={theoryOpen ? theoryId : undefined}
                onPress={() => setTheoryOpen((open) => !open)}
              >
                {t.theory}
                <PanelRightIcon className="rtl:-scale-x-100" />
              </Button>
            </div>
            <main ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
              <div
                key={state.index}
                className="mx-auto flex max-w-2xl flex-col gap-5 px-4 pt-14 pb-10 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-1 sm:px-6 sm:pt-16"
              >
                <Screen
                  lesson={lesson}
                  item={item}
                  state={state}
                  dispatch={dispatch}
                  expiresAt={expiresAt}
                />
              </div>
            </main>
            <ActionBar
              lesson={lesson}
              item={item}
              state={state}
              dispatch={dispatch}
            />
          </div>
          {theoryOpen ? (
            <TheoryPanel
              id={theoryId}
              concepts={seenConcepts}
              onClose={() => setTheoryOpen(false)}
              t={t}
            />
          ) : null}
        </div>
      </div>
    </>
  )
}

function ExpiryPill({ expiresAt, t }: { expiresAt: number; t: Strings }) {
  const hours = useHoursLeft(expiresAt)
  if (hours === null) return null
  return (
    <Badge variant="outline" className="tabular-nums">
      <ClockIcon data-icon="inline-start" aria-hidden="true" />
      {t.expires(hours)}
    </Badge>
  )
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

function roleLabel(role: Role, t: Strings) {
  return role === "hook"
    ? t.warmUp
    : role === "practice"
      ? t.practice
      : role === "challenge"
        ? t.challenge
        : t.fixing
}

function helperFor(step: Step, t: Strings): string {
  switch (step.type) {
    case "choice":
      return step.multiple ? t.helper.choiceMany : t.helper.choiceOne
    case "hotspot":
      return step.visual.kind === "code"
        ? t.helper.hotspotLine
        : t.helper.hotspot
    case "number":
      return ""
    default:
      return t.helper[step.type]
  }
}

function Screen({
  lesson,
  item,
  state,
  dispatch,
  expiresAt,
}: {
  lesson: Lesson
  item: Item
  state: State
  dispatch: React.Dispatch<Action>
  expiresAt?: number
}) {
  const { t } = usePlayer()
  switch (item.kind) {
    case "intro":
      return (
        <div className="flex flex-col gap-4 pt-6">
          <Mascot mood="happy" size="lg" />
          {lesson.topic ? <Eyebrow>{lesson.topic}</Eyebrow> : null}
          <h1 className="text-4xl font-bold tracking-tight text-balance">
            {lesson.title}
          </h1>
          <p className="max-w-prose text-lg text-muted-foreground">
            {lesson.summary}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              <ClockIcon data-icon="inline-start" aria-hidden="true" />
              {t.minutes(lesson.estimatedMinutes)}
            </Badge>
            <Badge variant="outline">{t.levels[lesson.level]}</Badge>
            {expiresAt ? <ExpiryPill expiresAt={expiresAt} t={t} /> : null}
          </div>
          <Card size="sm">
            <CardContent className="gap-1 text-base">
              <Eyebrow muted>{t.objective}</Eyebrow>
              <p>{lesson.objective}</p>
            </CardContent>
          </Card>
        </div>
      )
    case "concept": {
      const c = item.concept
      return (
        <>
          <Eyebrow>{t.concept(item.index, item.total)}</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            {c.title}
          </h2>
          {c.visual ? <Visual visual={c.visual} /> : null}
          <p className="max-w-prose text-lg">
            <RichText text={c.body} />
          </p>
          {c.term ? (
            <div className="flex items-baseline gap-3 rounded-lg bg-secondary px-4 py-3 text-secondary-foreground">
              <strong className="font-semibold whitespace-nowrap">
                {c.term.word}
              </strong>
              <RichText text={c.term.definition} />
            </div>
          ) : null}
        </>
      )
    }
    case "fix":
      return (
        <div className="flex flex-col gap-4 pt-6">
          <Mascot mood="idle" size="lg" />
          <Eyebrow>{t.fixing}</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight">{t.fixTitle}</h2>
          <p className="text-lg text-muted-foreground">
            {t.fixBody(state.mistakes.length)}
          </p>
        </div>
      )
    case "wrap":
      return <WrapUp lesson={lesson} results={state.results} />
    case "step":
      return <StepScreen item={item} state={state.step!} dispatch={dispatch} />
  }
}

function StepScreen({
  item,
  state,
  dispatch,
}: {
  item: Extract<Item, { kind: "step" }>
  state: StepState
  dispatch: React.Dispatch<Action>
}) {
  const { t } = usePlayer()
  const { step, role } = item
  const locked = state.phase !== "answering"
  // After a second miss, show the solution. The hook shows the learner's pick and the right answer.
  const marks: Record<string, Mark> =
    state.phase !== "revealed"
      ? (state.result?.marks ?? {})
      : role === "hook"
        ? { ...solutionMarks(step), ...state.result?.marks }
        : solutionMarks(step)
  const props = {
    step,
    answer: state.answer,
    setAnswer: (answer: Answer) => dispatch({ type: "answer", answer }),
    marks,
    locked,
  }
  const helper = helperFor(step, t)
  const showOutcomes =
    step.type === "scenario" && state.result
      ? [
          ...(state.answer.kind === "select" ? state.answer.ids : []),
          ...(state.phase === "revealed"
            ? step.options.filter((o) => o.quality === "best").map((o) => o.id)
            : []),
        ]
      : []

  return (
    <>
      <Eyebrow muted={role === "hook"}>{roleLabel(role, t)}</Eyebrow>
      <h2 className="text-2xl font-bold tracking-tight text-balance">
        <RichText text={step.prompt} />
      </h2>
      {helper && helper !== step.prompt ? (
        <p className="-mt-3 text-sm text-muted-foreground">{helper}</p>
      ) : null}
      {step.type === "scenario" ? (
        <div className="rounded-e-lg border-s-2 border-primary bg-muted px-4 py-3 text-[1.03125rem]">
          <RichText text={step.situation} />
        </div>
      ) : null}
      {step.visual && step.type !== "hotspot" ? (
        <Visual visual={step.visual} />
      ) : null}
      {step.type === "choice" ||
      step.type === "compare" ||
      step.type === "scenario" ? (
        <OptionsExercise
          {...props}
          order={state.optionOrder}
          showOutcomes={showOutcomes}
        />
      ) : step.type === "hotspot" ? (
        <HotspotExercise {...props} />
      ) : step.type === "sort" ? (
        <SortExercise {...props} />
      ) : step.type === "order" ? (
        <OrderExercise {...props} />
      ) : step.type === "match" ? (
        <MatchExercise {...props} rightOrder={state.rightOrder} />
      ) : step.type === "blank" ? (
        <BlankExercise {...props} bank={state.bank} />
      ) : null}
      {state.hintOpen && step.hint ? (
        <Alert>
          <LightbulbIcon aria-hidden="true" />
          <AlertDescription className="text-[0.9375rem] text-foreground">
            <RichText text={step.hint} />
          </AlertDescription>
        </Alert>
      ) : null}
    </>
  )
}

function WrapUp({
  lesson,
  results,
}: {
  lesson: Lesson
  results: Record<string, Outcome>
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
    <div className="flex flex-col gap-6 pt-6">
      <Mascot mood="cheer" size="lg" />
      <Eyebrow>{lesson.title}</Eyebrow>
      <h1 className="-mt-3 text-4xl font-bold tracking-tight">{t.done}</h1>
      <div className="flex flex-wrap items-center gap-6">
        <div
          className="grid size-32 place-items-center rounded-full"
          style={{
            background: `conic-gradient(var(--color-green-600) ${pct}%, var(--muted) 0)`,
          }}
        >
          <div className="grid size-24 place-items-center rounded-full bg-background text-center">
            <div className="text-3xl font-extrabold tabular-nums">
              {s.first}/{s.total}
            </div>
          </div>
        </div>
        <ul className="grid gap-1.5 text-[0.9375rem]">
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
          <p className="text-[0.9375rem] text-muted-foreground">
            {t.next}:{" "}
            <strong className="text-foreground">{lesson.wrapup.next}</strong>
          </p>
        ) : null}
      </div>
    </div>
  )
}

// ---------- action bar ----------

type Tone = "neutral" | "good" | "bad" | "warn" | "info"

function ActionBar({
  lesson,
  item,
  state,
  dispatch,
}: {
  lesson: Lesson
  item: Item
  state: State
  dispatch: React.Dispatch<Action>
}) {
  const { t } = usePlayer()
  let tone: Tone = "neutral"
  let mood: MascotMood | null = null
  let title: string | null = null
  let message: string | null = null
  let primary: { label: string; onPress: () => void; isDisabled?: boolean } = {
    label: t.continue,
    onPress: () => dispatch({ type: "next" }),
  }
  let secondary: React.ReactNode = null

  if (item.kind === "intro")
    primary = { label: t.start, onPress: () => dispatch({ type: "next" }) }
  else if (item.kind === "concept") mood = "think"
  else if (item.kind === "fix")
    primary = {
      label: t.fixStart,
      onPress: () => dispatch({ type: "startFix" }),
    }
  else if (item.kind === "wrap") {
    tone = "good"
    primary = {
      label: t.restart,
      onPress: () => dispatch({ type: "restart", lesson }),
    }
  } else if (item.kind === "step" && state.step) {
    const s = state.step
    const { step, role } = item
    const r = s.result
    const missText = (res: CheckResult) =>
      res.feedback ?? (res.missKey ? missMessage(res, t) : null)
    if (s.phase === "answering") {
      primary = {
        label: t.check,
        onPress: () => dispatch({ type: "check" }),
        isDisabled: !isReady(step, s.answer),
      }
      if (step.hint && role !== "hook")
        secondary = (
          <Button
            variant="ghost"
            onPress={() => dispatch({ type: "hint" })}
            isDisabled={s.usedHint}
          >
            <LightbulbIcon data-icon="inline-start" />
            {t.hint}
          </Button>
        )
    } else if (role === "hook" && r) {
      tone = "info"
      mood = r.correct ? "happy" : "think"
      title = r.correct ? t.goodGuess : t.hookMiss
      message = [!r.correct ? missText(r) : null, step.explanation, t.hookNote]
        .filter(Boolean)
        .join(" ")
    } else if (s.phase === "feedback" && r?.correct) {
      tone = "good"
      mood = "happy"
      title = s.usedHint && s.attempts === 0 ? t.correctWithHint : t.correct
      message = step.explanation
    } else if (s.phase === "feedback" && r) {
      tone = r.partial ? "warn" : "bad"
      mood = "oops"
      title = r.partial ? t.close : t.notQuite
      message = missText(r)
      primary = {
        label: t.tryAgain,
        onPress: () => dispatch({ type: "retry" }),
      }
    } else if (s.phase === "revealed") {
      tone = "bad"
      mood = "think"
      title = t.answer
      message = step.explanation
    }
  }

  const toneClass: Record<Tone, string> = {
    neutral: "bg-background",
    good: "border-green-600/30 bg-green-600/10",
    bad: "border-red-600/30 bg-red-600/10",
    warn: "border-amber-500/40 bg-amber-500/10",
    info: "bg-secondary",
  }
  const titleClass: Record<Tone, string> = {
    neutral: "",
    good: "text-green-700 dark:text-green-400",
    bad: "text-red-700 dark:text-red-400",
    warn: "text-amber-700 dark:text-amber-400",
    info: "",
  }

  return (
    <div
      className={cn(
        "border-t px-4 py-3.5 transition-colors sm:px-6",
        toneClass[tone]
      )}
    >
      <div
        aria-live="polite"
        className="mx-auto flex max-w-2xl flex-wrap items-center gap-3"
      >
        <div className="flex min-w-0 flex-[1_1_20rem] items-center gap-3">
          {mood ? (
            <Mascot
              key={`${state.index}-${mood}-${state.step?.attempts ?? 0}`}
              mood={mood}
            />
          ) : null}
          {title ? (
            <div className="min-w-0">
              <div
                className={cn(
                  "text-lg leading-tight font-bold",
                  titleClass[tone]
                )}
              >
                {title}
              </div>
              {message ? (
                <RichText
                  text={message}
                  className="mt-0.5 block text-[0.9375rem]"
                />
              ) : null}
            </div>
          ) : (
            secondary
          )}
        </div>
        <Button
          size="lg"
          className="min-w-36 max-sm:flex-1"
          onPress={primary.onPress}
          isDisabled={primary.isDisabled}
          autoFocus={Boolean(title)}
        >
          {primary.label}
        </Button>
      </div>
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
