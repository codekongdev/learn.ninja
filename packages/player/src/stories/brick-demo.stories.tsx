import type { Meta, StoryObj } from "@storybook/react-vite"

import { BrickDemo } from "../brick-demo"
import { lessons, prepared } from "./fixtures"

// One brick, playable on its own, as on the home page and in the docs. Continue starts it over.

const meta = {
  title: "Player/Brick demo",
  component: BrickDemo,
  args: { lesson: lessons.buttons, brickId: "p1", prepared },
  argTypes: {
    lesson: { control: false },
    prepared: { control: false },
    checked: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-2xl p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BrickDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Choice: Story = {}

/** Already checked with a wrong pick, to show its feedback. */
export const CheckedWrong: Story = {
  args: { checked: { kind: "select", ids: ["b"] } },
}

export const Concept: Story = {
  args: { lesson: lessons.compound, brickId: "c1" },
}

export const Sort: Story = {
  args: { lesson: lessons.prd, brickId: "p3" },
}

export const BlankWithCode: Story = {
  args: { lesson: lessons.coding, brickId: "p1" },
}

export const Scenario: Story = {
  args: { lesson: lessons.prd, brickId: "ch" },
}
