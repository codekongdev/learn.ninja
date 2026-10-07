"use client"

import * as React from "react"

import type { Step } from "@workspace/spec"
import { Selectable } from "@workspace/ui/components/selectable"
import { cn } from "@workspace/ui/lib/utils"

import { POOL, type Answer, type Mark } from "./check"
import { usePlayer } from "./context"
import { DropZone } from "./dnd"
import { RichText } from "./rich-text"
import { Visual } from "./visuals"

export interface ExerciseProps {
  step: Step
  answer: Answer
  setAnswer: (answer: Answer) => void
  marks: Record<string, Mark>
  /** True after checking: the answer can't change until the learner tries again. */
  locked: boolean
}

const markStyles =
  "data-[status=correct]:border-green-600 data-[status=correct]:bg-green-600/10 " +
  "data-[status=wrong]:border-red-600 data-[status=wrong]:bg-red-600/10 " +
  "data-[status=partial]:border-amber-500 data-[status=partial]:bg-amber-500/10"

const cardStyles =
  "w-full rounded-lg border bg-background text-start shadow-xs transition-colors " +
  "hover:bg-muted data-selected:border-primary data-selected:bg-muted data-pressed:translate-y-px " +
  markStyles

const letter = (i: number) => String.fromCharCode(65 + i)

function KeyBadge({ i }: { i: number }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-6 shrink-0 place-items-center rounded-md border font-mono text-xs font-semibold text-muted-foreground group-data-selected:border-primary group-data-selected:bg-primary group-data-selected:text-primary-foreground"
    >
      {letter(i)}
    </span>
  )
}

// ---------- choice, compare, scenario ----------

export function OptionsExercise({
  step,
  answer,
  setAnswer,
  marks,
  locked,
  order,
  showOutcomes,
}: ExerciseProps & { order: string[]; showOutcomes: string[] }) {
  const { t } = usePlayer()
  if (
    step.type !== "choice" &&
    step.type !== "compare" &&
    step.type !== "scenario"
  )
    return null
  const selected = answer.kind === "select" ? answer.ids : []
  const multiple = step.type === "choice" && step.multiple
  const toggle = (id: string) => {
    if (multiple)
      setAnswer({
        kind: "select",
        ids: selected.includes(id)
          ? selected.filter((x) => x !== id)
          : [...selected, id],
      })
    else setAnswer({ kind: "select", ids: [id] })
  }
  const options = order
    .map((id) => (step.options as { id: string }[]).find((o) => o.id === id)!)
    .filter(Boolean)

  return (
    <div
      role="group"
      aria-label={step.prompt}
      className={cn("grid gap-3", step.type === "compare" && "sm:grid-cols-2")}
    >
      {options.map((raw, i) => {
        const o = raw as {
          id: string
          text?: string
          visual?: import("@workspace/spec").Visual
          lang?: string
          outcome?: string
        }
        const isCompare = step.type === "compare"
        return (
          <Selectable
            key={o.id}
            isSelected={selected.includes(o.id)}
            onChange={() => toggle(o.id)}
            isDisabled={locked}
            data-status={marks[o.id]}
            className={cn(
              "group",
              cardStyles,
              isCompare
                ? "flex flex-col gap-2 p-3"
                : "flex items-start gap-3 px-4 py-3.5"
            )}
          >
            {isCompare ? (
              <>
                <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <KeyBadge i={i} />
                  {t.optionLabel(letter(i))}
                </span>
                {o.visual ? (
                  <Visual visual={o.visual} label={t.optionLabel(letter(i))} />
                ) : null}
                {o.text ? (
                  <RichText
                    text={o.text}
                    lang={o.lang}
                    className="px-1 text-[0.96875rem]"
                  />
                ) : null}
              </>
            ) : (
              <>
                <KeyBadge i={i} />
                <span className="flex min-w-0 flex-col gap-2 pt-0.5">
                  {o.text ? (
                    <RichText
                      text={o.text}
                      lang={o.lang}
                      className="text-[0.96875rem]"
                    />
                  ) : null}
                  {o.visual ? <Visual visual={o.visual} /> : null}
                  {o.outcome && showOutcomes.includes(o.id) ? (
                    <RichText
                      text={o.outcome}
                      className="text-sm text-muted-foreground"
                    />
                  ) : null}
                </span>
              </>
            )}
          </Selectable>
        )
      })}
    </div>
  )
}

// ---------- hotspot ----------

export function HotspotExercise({
  step,
  answer,
  setAnswer,
  marks,
  locked,
}: ExerciseProps) {
  if (step.type !== "hotspot") return null
  const selected = answer.kind === "select" ? answer.ids : []
  const onToggle = (id: string) =>
    setAnswer({
      kind: "select",
      ids: step.multiple
        ? selected.includes(id)
          ? selected.filter((x) => x !== id)
          : [...selected, id]
        : [id],
    })
  return (
    <Visual
      visual={step.visual}
      hotspots={{ selected, marks, onToggle, disabled: locked }}
      label={step.prompt}
    />
  )
}

// ---------- sort and order (drag and drop) ----------

function moveItem(
  zones: Record<string, string[]>,
  itemId: string,
  toZone: string,
  index: number
): Record<string, string[]> {
  const next = Object.fromEntries(
    Object.entries(zones).map(([z, ids]) => [
      z,
      ids.filter((id) => id !== itemId),
    ])
  )
  const target = next[toZone] ?? []
  target.splice(Math.min(index, target.length), 0, itemId)
  next[toZone] = target
  return next
}

export function SortExercise({
  step,
  answer,
  setAnswer,
  marks,
  locked,
}: ExerciseProps) {
  const { t } = usePlayer()
  if (step.type !== "sort" || answer.kind !== "zones") return null
  const byId = new Map(step.items.map((i) => [i.id, i]))
  const zoneItems = (zone: string) =>
    (answer.zones[zone] ?? []).map((id) => {
      const it = byId.get(id)!
      return {
        id,
        textValue: it.text.replace(/[*`]/g, ""),
        content: <RichText text={it.text} />,
        lang: it.lang,
        mark: marks[id],
      }
    })
  const onMove = (itemId: string, zone: string, index: number) =>
    setAnswer({
      kind: "zones",
      zones: moveItem(answer.zones, itemId, zone, index),
    })

  return (
    <div className="flex flex-col gap-3">
      <DropZone
        zoneId={POOL}
        label={t.pool}
        items={zoneItems(POOL)}
        emptyText={t.allPlaced}
        onMove={onMove}
        layout="grid"
        disabled={locked}
      />
      <div
        className={cn(
          "grid gap-3",
          step.groups.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
        )}
      >
        {step.groups.map((g) => (
          <div key={g.id} className="flex min-w-0 flex-col gap-2">
            <div
              lang={g.lang}
              className="px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
            >
              {g.label}
            </div>
            <DropZone
              zoneId={g.id}
              label={g.label}
              items={zoneItems(g.id)}
              emptyText={t.dropHere}
              onMove={onMove}
              disabled={locked}
              className="min-h-28"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export function OrderExercise({
  step,
  answer,
  setAnswer,
  marks,
  locked,
}: ExerciseProps) {
  if (step.type !== "order" || answer.kind !== "sequence") return null
  const byId = new Map(step.items.map((i) => [i.id, i]))
  const items = answer.ids.map((id) => {
    const it = byId.get(id)!
    return {
      id,
      textValue: it.text?.replace(/[*`]/g, "") ?? id,
      content: it.visual ? (
        <Visual visual={it.visual} />
      ) : (
        <RichText text={it.text ?? ""} />
      ),
      lang: it.lang,
      mark: marks[id],
    }
  })
  const onMove = (itemId: string, _zone: string, index: number) => {
    const rest = answer.ids.filter((id) => id !== itemId)
    rest.splice(Math.min(index, rest.length), 0, itemId)
    setAnswer({ kind: "sequence", ids: rest })
  }
  return (
    <DropZone
      zoneId="order"
      label={step.prompt}
      items={items}
      emptyText=""
      onMove={onMove}
      disabled={locked}
    />
  )
}

// ---------- match ----------

const PAIR_COLORS = ["#3b6cf6", "#d98b06", "#d6337a", "#0f9a9a", "#8b5cf6"]

export function MatchExercise({
  step,
  answer,
  setAnswer,
  marks,
  locked,
  rightOrder,
}: ExerciseProps & { rightOrder: number[] }) {
  const [armed, setArmed] = React.useState<number | null>(null)
  if (step.type !== "match" || answer.kind !== "pairs") return null
  const links = answer.links
  const paired = Object.keys(links)
    .map(Number)
    .sort((a, b) => a - b)
  const pairNumber = (left: number) => paired.indexOf(left)
  const ownerOf = (right: number) => paired.find((l) => links[l] === right)

  const pressLeft = (i: number) => {
    const next = { ...links }
    delete next[i]
    setAnswer({ kind: "pairs", links: next })
    setArmed(armed === i ? null : i)
  }
  const pressRight = (j: number) => {
    const next = { ...links }
    const owner = ownerOf(j)
    if (owner !== undefined) delete next[owner]
    if (armed !== null) {
      next[armed] = j
      setArmed(null)
    }
    setAnswer({ kind: "pairs", links: next })
  }

  const badge = (k: number) => (
    <span
      aria-hidden="true"
      className="grid size-6 shrink-0 place-items-center rounded-full border border-dashed text-[0.6875rem] font-bold text-white"
      style={
        k >= 0
          ? {
              background: PAIR_COLORS[k % PAIR_COLORS.length],
              borderColor: PAIR_COLORS[k % PAIR_COLORS.length],
              borderStyle: "solid",
            }
          : undefined
      }
    >
      {k >= 0 ? k + 1 : ""}
    </span>
  )
  const chip =
    "flex w-full items-center gap-2.5 rounded-lg border bg-background px-3 py-2.5 text-start text-[0.9375rem] shadow-xs hover:bg-muted data-selected:border-primary data-selected:bg-muted " +
    markStyles

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex min-w-0 flex-col gap-2">
        {step.pairs.map((p, i) => (
          <Selectable
            key={i}
            isSelected={armed === i}
            onChange={() => pressLeft(i)}
            isDisabled={locked}
            data-status={marks[`L${i}`]}
            lang={step.leftLang}
            className={chip}
          >
            {badge(pairNumber(i))}
            <RichText text={p.left} />
          </Selectable>
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-2">
        {rightOrder.map((j) => {
          const owner = ownerOf(j)
          return (
            <Selectable
              key={j}
              isSelected={false}
              onChange={() => pressRight(j)}
              isDisabled={locked}
              data-status={marks[`R${j}`]}
              lang={step.rightLang}
              className={chip}
            >
              {badge(owner === undefined ? -1 : pairNumber(owner))}
              <RichText text={step.pairs[j]!.right} />
            </Selectable>
          )
        })}
      </div>
    </div>
  )
}

// ---------- blank (word chips) ----------

export function BlankExercise({
  step,
  answer,
  setAnswer,
  marks,
  locked,
  bank,
}: ExerciseProps & { bank: string[] }) {
  const { t } = usePlayer()
  const [active, setActive] = React.useState<string | null>(null)
  if (step.type !== "blank" || answer.kind !== "gaps") return null
  const values = answer.values
  const gapIds = step.blanks.map((b) => b.id)
  const firstEmpty = gapIds.find((id) => !values[id])
  const target = active ?? firstEmpty ?? gapIds[gapIds.length - 1]!

  const place = (word: string) => {
    const next = { ...values, [target]: word }
    setAnswer({ kind: "gaps", values: next })
    setActive(gapIds.find((id) => !next[id]) ?? null)
  }
  const clear = (id: string) => {
    setAnswer({ kind: "gaps", values: { ...values, [id]: "" } })
    setActive(id)
  }

  const code = step.format === "code"
  const parts = step.template.split(/(\[\[[^\]]+\]\])/)
  return (
    <div className="flex flex-col gap-4">
      <div
        lang={step.lang}
        dir={code ? "ltr" : undefined}
        className={cn(
          "rounded-xl bg-card px-5 py-4 whitespace-pre-wrap shadow-xs ring-1 ring-foreground/10",
          code
            ? "font-mono text-[0.9375rem] leading-loose"
            : "text-xl leading-[2.3]"
        )}
      >
        {parts.map((part, i) => {
          const m = part.match(/^\[\[(.+)\]\]$/)
          if (!m) return <React.Fragment key={i}>{part}</React.Fragment>
          const id = m[1]!
          const value = values[id]
          return (
            <Selectable
              key={i}
              aria-label={value || t.emptyGap}
              isSelected={!locked && target === id && !value}
              onChange={() => clear(id)}
              isDisabled={locked}
              data-status={marks[id]}
              className={cn(
                "mx-0.5 inline-block min-w-[4.5rem] rounded-md border-b-2 border-primary bg-muted px-2 text-center align-baseline leading-normal",
                "data-selected:bg-primary/10",
                value && "border border-border bg-background shadow-xs",
                markStyles
              )}
            >
              {value || " "}
            </Selectable>
          )
        })}
      </div>
      <div
        role="group"
        aria-label={t.wordBank}
        className="flex flex-wrap gap-2"
      >
        {bank.map((word) => {
          const used = Object.values(values).includes(word)
          return (
            <Selectable
              key={word}
              isSelected={used}
              onChange={() => !used && place(word)}
              isDisabled={locked}
              lang={step.lang}
              className={cn(
                "rounded-md border bg-background px-3 py-1.5 shadow-xs hover:bg-muted data-selected:opacity-45",
                code ? "font-mono text-sm" : "text-[0.9375rem]"
              )}
            >
              {word}
            </Selectable>
          )
        })}
      </div>
    </div>
  )
}
