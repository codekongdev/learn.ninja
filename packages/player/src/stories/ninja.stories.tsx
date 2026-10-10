import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@workspace/ui/components/button"

import {
  enter,
  Ninja,
  NINJA_ENERGY,
  NINJA_GAZE,
  REACTIONS,
  useNinjaLife,
  WRAP,
  type CueKind,
  type NinjaEnergy,
  type NinjaMood,
} from "../ninja"

// The logo as a character: his moods, and the reactions the player picks from after a check.

const MOODS: NinjaMood[] = [
  "idle",
  "happy",
  "wide",
  "half",
  "closed",
  "oops",
  "droop",
  "lookaway",
  "tilt",
]

const meta = {
  title: "Player/Ninja",
  component: Ninja,
  argTypes: { mood: { control: "inline-radio", options: MOODS } },
  args: { mood: "happy" },
  render: (args) => (
    <div className="grid min-h-screen place-items-center">
      <Ninja {...args} className="size-32" />
    </div>
  ),
} satisfies Meta<typeof Ninja>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Moods: Story = {
  render: () => (
    <div className="flex min-h-screen flex-wrap items-center justify-center gap-10">
      {MOODS.map((mood) => (
        <figure key={mood} className="flex flex-col items-center gap-2">
          <Ninja mood={mood} className="size-24" />
          <figcaption className="text-sm text-muted-foreground">
            {mood}
          </figcaption>
        </figure>
      ))}
    </div>
  ),
}

/**
 * Alive (he looks around, blinks, follows the pointer, and at the livelier settings pulls stunts on
 * his own) with buttons for every reaction of the chosen setting, at both sizes, plus the
 * character's entrance and wrap-up send-off.
 */
export const Reactions: StoryObj<{ level: NinjaEnergy }> = {
  argTypes: {
    level: {
      control: "inline-radio",
      options: ["default", "sensei", "unhinged"],
    },
  },
  args: { level: "default" },
  render: ({ level }) => <ReactionsDemo key={level} level={level} />,
}

const KINDS: CueKind[] = ["happy", "earned", "sad", "close", "reveal"]

function ReactionsDemo({ level }: { level: NinjaEnergy }) {
  const area = React.useRef<HTMLDivElement>(null)
  const big = React.useRef<SVGSVGElement>(null)
  const small = React.useRef<SVGSVGElement>(null)
  const bigLife = useNinjaLife(big, area, level)
  const smallLife = useNinjaLife(small, area, level)
  const [label, setLabel] = React.useState("idle")
  const play = (name: string, beats: Parameters<typeof bigLife.play>[0]) => {
    setLabel(name)
    void bigLife.play(beats)
    void smallLife.play(beats)
  }
  const group = (title: string, children: React.ReactNode) => (
    <div key={title} className="flex flex-col items-center gap-2">
      <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
        {title}
      </p>
      <div className="flex flex-wrap justify-center gap-2">{children}</div>
    </div>
  )
  return (
    <div
      ref={area}
      className="flex min-h-screen flex-col items-center justify-center gap-8 p-8"
      style={
        {
          "--ninja-energy": NINJA_ENERGY[level],
          "--ninja-gaze": NINJA_GAZE[level],
        } as React.CSSProperties
      }
    >
      <div className="flex items-end gap-10">
        <Ninja ref={big} className="size-32" />
        <Ninja ref={small} className="size-10" />
      </div>
      <p className="font-mono text-xs text-muted-foreground">{label}</p>
      {KINDS.map((kind) => {
        const set = REACTIONS[level][kind]
        if (!set) return null
        return group(
          kind,
          Object.entries(set).map(([name, beats]) => (
            <Button
              key={name}
              size="sm"
              variant="outline"
              onPress={() => play(`${kind} · ${name}`, beats)}
            >
              {name}
            </Button>
          ))
        )
      })}
      {group(
        "screens",
        <>
          <Button
            size="sm"
            variant="outline"
            onPress={() => {
              setLabel("entrance")
              for (const [mark, life] of [
                [big, bigLife],
                [small, smallLife],
              ] as const)
                if (mark.current) enter(mark.current, life, level)
            }}
          >
            entrance
          </Button>
          {(["done", "perfect"] as const).map((end) => (
            <Button
              key={end}
              size="sm"
              variant="outline"
              onPress={() => play(`wrap · ${end}`, WRAP[level][end])}
            >
              wrap · {end}
            </Button>
          ))}
        </>
      )}
    </div>
  )
}
