import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import type { Step } from "@workspace/spec"

import {
  checkAnswer,
  initialAnswer,
  shuffle,
  solution,
  solutionMarks,
  type Answer,
  type Mark,
} from "../check"
import {
  BlankExercise,
  HotspotExercise,
  MatchExercise,
  OptionsExercise,
  OrderExercise,
  SortExercise,
} from "../exercises"
import { RichText } from "../rich-text"
import { Visual } from "../visuals"
import { lessons, PlayerFrame } from "./fixtures"

// Every building block in every state. Use the "state" control to switch between idle (interactive),
// wrong (after a first miss), correct, and revealed (after a second miss).

type Mode = "idle" | "wrong" | "correct" | "revealed"

interface HarnessProps {
  step: Step
  /** The wrong answer to show in the "wrong" state. */
  wrong: Answer
  mode: Mode
}

/** A seeded shuffle, so idle stories look the same on every load. */
function seeded(seed = 7) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

function Harness({ step, wrong, mode }: HarnessProps) {
  const start = (): Answer =>
    mode === "idle"
      ? initialAnswer(step, seeded())
      : mode === "wrong"
        ? wrong
        : solution(step)
  const [answer, setAnswer] = React.useState<Answer>(start)
  const marks: Record<string, Mark> =
    mode === "idle"
      ? {}
      : mode === "wrong"
        ? checkAnswer(step, wrong).marks
        : mode === "correct"
          ? checkAnswer(step, solution(step)).marks
          : solutionMarks(step)
  const props = { step, answer, setAnswer, marks, locked: mode !== "idle" }
  const optionIds =
    "options" in step ? (step.options as { id: string }[]).map((o) => o.id) : []
  const showOutcomes =
    step.type === "scenario" && mode !== "idle" && answer.kind === "select"
      ? answer.ids
      : []

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 py-8">
      <h2 className="text-2xl font-bold tracking-tight text-balance">
        <RichText text={step.prompt} />
      </h2>
      {step.type === "scenario" ? (
        <div className="rounded-e-2xl border-s-[3px] border-primary bg-muted px-4 py-3">
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
          order={
            step.type === "compare" ? optionIds : shuffle(optionIds, seeded())
          }
          showOutcomes={showOutcomes}
        />
      ) : step.type === "hotspot" ? (
        <HotspotExercise {...props} />
      ) : step.type === "sort" ? (
        <SortExercise {...props} />
      ) : step.type === "order" ? (
        <OrderExercise {...props} />
      ) : step.type === "match" ? (
        <MatchExercise
          {...props}
          rightOrder={shuffle(
            step.pairs.map((_, i) => i),
            seeded()
          )}
        />
      ) : step.type === "blank" ? (
        <BlankExercise
          {...props}
          bank={shuffle(
            [...new Set(step.blanks.flatMap((b) => b.choices ?? []))],
            seeded()
          )}
        />
      ) : null}
    </div>
  )
}

const meta = {
  title: "Player/Exercises",
  component: Harness,
  argTypes: {
    mode: {
      name: "state",
      control: "inline-radio",
      options: ["idle", "wrong", "correct", "revealed"],
    },
    step: { control: false },
    wrong: { control: false },
  },
  args: { mode: "idle" },
  render: (args, { globals }) => (
    <PlayerFrame ui={globals.ui}>
      <Harness key={`${args.mode}-${globals.ui}`} {...args} />
    </PlayerFrame>
  ),
} satisfies Meta<typeof Harness>

export default meta
type Story = StoryObj<typeof meta>

const { buttons, prd, compound, spanish, coding } = lessons
const practice = (l: typeof buttons, loop: number, i: number) =>
  l.loops[loop]!.practice[i]!

export const MultipleChoice: Story = {
  args: {
    step: practice(buttons, 0, 0),
    wrong: { kind: "select", ids: ["b"] },
  },
}
export const MultipleChoiceWithCode: Story = {
  args: { step: practice(coding, 0, 1), wrong: { kind: "select", ids: ["b"] } },
}
export const MultiSelect: Story = {
  args: {
    step: practice(prd, 0, 1),
    wrong: { kind: "select", ids: ["a", "c"] },
  },
}
export const CompareVisual: Story = {
  name: "Compare (A vs B), visual",
  args: { step: buttons.hook, wrong: { kind: "select", ids: ["a"] } },
}
export const CompareText: Story = {
  name: "Compare (A vs B), text",
  args: {
    step: practice(compound, 1, 1),
    wrong: { kind: "select", ids: ["b"] },
  },
}
export const HotspotHtml: Story = {
  name: "Hotspot, HTML",
  args: {
    step: practice(buttons, 0, 1),
    wrong: { kind: "select", ids: ["create"] },
  },
}
export const HotspotCode: Story = {
  name: "Hotspot, code lines",
  args: {
    step: practice(coding, 1, 1),
    wrong: { kind: "select", ids: ["l1"] },
  },
}
export const Sort: Story = {
  args: {
    step: practice(buttons, 1, 0),
    wrong: {
      kind: "zones",
      zones: { pool: [], pri: ["a"], sec: ["c"], ter: ["b", "d", "e"] },
    },
  },
}
export const OrderVisual: Story = {
  name: "Order, visual items",
  args: {
    step: practice(buttons, 1, 1),
    wrong: { kind: "sequence", ids: ["c", "a", "b"] },
  },
}
export const OrderText: Story = {
  name: "Order, dialogue",
  args: {
    step: spanish.challenge,
    wrong: { kind: "sequence", ids: ["b", "a", "c", "d"] },
  },
}
export const Match: Story = {
  args: {
    step: practice(spanish, 0, 0),
    wrong: { kind: "pairs", links: { 0: 1, 1: 0, 2: 2, 3: 3 } },
  },
}
export const BlankText: Story = {
  name: "Blank, word chips",
  args: {
    step: practice(spanish, 1, 0),
    wrong: { kind: "gaps", values: { c: "Dónde", g: "gracias" } },
  },
}
export const BlankCode: Story = {
  name: "Blank, code",
  args: {
    step: practice(coding, 0, 0),
    wrong: { kind: "gaps", values: { m: "forEach" } },
  },
}
export const Scenario: Story = {
  args: { step: buttons.challenge, wrong: { kind: "select", ids: ["b"] } },
}
