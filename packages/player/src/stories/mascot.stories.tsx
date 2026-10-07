import type { Meta, StoryObj } from "@storybook/react-vite"

import { Mascot, type MascotMood } from "../mascot"

// The placeholder mascot until the real one is designed.

const MOODS: MascotMood[] = ["idle", "think", "happy", "oops", "cheer"]

const meta = {
  title: "Player/Mascot",
  component: Mascot,
  argTypes: {
    mood: { control: "inline-radio", options: MOODS },
    size: { control: "inline-radio", options: ["md", "lg"] },
  },
  args: { mood: "happy", size: "lg" },
  render: (args) => (
    <div className="grid min-h-screen place-items-center">
      <Mascot {...args} />
    </div>
  ),
} satisfies Meta<typeof Mascot>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const AllMoods: Story = {
  render: () => (
    <div className="flex min-h-screen flex-wrap items-center justify-center gap-10">
      {MOODS.map((mood) => (
        <figure key={mood} className="flex flex-col items-center gap-2">
          <Mascot mood={mood} size="lg" />
          <figcaption className="text-sm text-muted-foreground">
            {mood}
          </figcaption>
        </figure>
      ))}
    </div>
  ),
}
