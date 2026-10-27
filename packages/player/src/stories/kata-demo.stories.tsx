import type { Meta, StoryObj } from "@storybook/react-vite"

import { KataDemo } from "../kata-demo"
import { lessons, prepared } from "./fixtures"

// One kata, playable on its own, as on the home page and in the docs. Continue starts it over.

const meta = {
  title: "Player/Kata demo",
  component: KataDemo,
  args: { lesson: lessons.buttons, kataId: "p1", prepared },
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
} satisfies Meta<typeof KataDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Choice: Story = {}

/** Without the Check and help buttons, as in the docs: the kata can be tried but not checked. */
export const NoActions: Story = {
  args: { actions: false },
}

/** Already checked with a wrong pick, to show its feedback. */
export const CheckedWrong: Story = {
  args: { checked: { kind: "select", ids: ["b"] } },
}

export const Concept: Story = {
  args: { lesson: lessons.compound, kataId: "c1" },
}

export const Sort: Story = {
  args: { lesson: lessons.coding, kataId: "p3" },
}

export const BlankWithCode: Story = {
  args: { lesson: lessons.coding, kataId: "p1" },
}

export const Scenario: Story = {
  args: { lesson: lessons.prd, kataId: "ch" },
}
