import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@workspace/ui/components/button"

import { Ninja, REACTIONS, useNinjaLife, type NinjaMood } from "../ninja"

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

/** Alive (he looks around, blinks, follows the pointer) with buttons for every reaction, at both sizes. */
export const Reactions: Story = {
  render: () => <ReactionsDemo />,
}

function ReactionsDemo() {
  const area = React.useRef<HTMLDivElement>(null)
  const big = React.useRef<SVGSVGElement>(null)
  const small = React.useRef<SVGSVGElement>(null)
  const bigLife = useNinjaLife(big, area)
  const smallLife = useNinjaLife(small, area)
  const [label, setLabel] = React.useState("idle")
  return (
    <div
      ref={area}
      className="flex min-h-screen flex-col items-center justify-center gap-8 p-8"
    >
      <div className="flex items-end gap-10">
        <Ninja ref={big} className="size-32" />
        <Ninja ref={small} className="size-10" />
      </div>
      <p className="font-mono text-xs text-muted-foreground">{label}</p>
      {(["happy", "sad"] as const).map((kind) => (
        <div key={kind} className="flex flex-col items-center gap-2">
          <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            {kind}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(REACTIONS[kind]).map(([name, beats]) => (
              <Button
                key={name}
                size="sm"
                variant="outline"
                onPress={() => {
                  setLabel(`${kind} · ${name}`)
                  void bigLife.play(beats)
                  void smallLife.play(beats)
                }}
              >
                {name}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
