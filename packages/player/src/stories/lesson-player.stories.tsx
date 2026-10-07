import type { Meta, StoryObj } from "@storybook/react-vite"

import { LessonPlayer } from "../lesson-player"
import { lessons, prepared } from "./fixtures"

// The whole player, playable end to end. Switch language and theme in the toolbar.

const meta = {
  title: "Player/Lesson player",
  component: LessonPlayer,
  args: { lesson: lessons.buttons, prepared },
  argTypes: { lesson: { control: false }, prepared: { control: false } },
  render: (args, { globals }) => (
    <div className="h-screen">
      <LessonPlayer
        key={globals.ui}
        {...args}
        uiLanguage={globals.ui}
        expiresAt={Date.now() + 14 * 3.6e6}
      />
    </div>
  ),
} satisfies Meta<typeof LessonPlayer>

export default meta
type Story = StoryObj<typeof meta>

export const ButtonHierarchy: Story = { args: { lesson: lessons.buttons } }
export const WritingAPrd: Story = {
  name: "Writing a PRD",
  args: { lesson: lessons.prd },
}
export const CompoundInterest: Story = { args: { lesson: lessons.compound } }
export const SpanishGreetings: Story = { args: { lesson: lessons.spanish } }
export const MapVsForEach: Story = {
  name: "map vs forEach",
  args: { lesson: lessons.coding },
}
