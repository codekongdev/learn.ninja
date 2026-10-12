import type { Meta, StoryObj } from "@storybook/react-vite"
import { useGlobals } from "storybook/preview-api"

import { LessonPlayer } from "../lesson-player"
import { lessons, prepared } from "./fixtures"

// The whole player, playable end to end. Switch language and theme in the toolbar or the footer.

const meta = {
  title: "Player/Lesson player",
  component: LessonPlayer,
  args: { lesson: lessons.buttons, prepared },
  argTypes: { lesson: { control: false }, prepared: { control: false } },
  render: function Render(args, { globals }) {
    const [, updateGlobals] = useGlobals()
    return (
      <div className="h-screen">
        <LessonPlayer
          key={globals.ui}
          {...args}
          uiLanguage={globals.ui}
          expiresAt={Date.now() + 14 * 3.6e6}
          homeHref="#"
          docsHref="#"
          privacyHref="#"
          termsHref="#"
          theme={globals.theme === "dark" ? "dark" : "light"}
          onThemeChange={(theme) =>
            updateGlobals({
              theme:
                theme === "system"
                  ? matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
                  : theme,
            })
          }
        />
      </div>
    )
  },
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
export const CorrelationVsCausation: Story = {
  name: "Correlation vs causation",
  args: { lesson: lessons.correlation },
}
export const BronzeAgeCollapse: Story = {
  name: "Bronze Age collapse",
  args: { lesson: lessons.bronze },
}
// The player reads its preferences on mount, so these stories save a choice before it renders.
const withPrefs = (prefs: object) => [
  () =>
    localStorage.setItem(
      "learn:preferences",
      JSON.stringify({ textSize: "sm", ...prefs })
    ),
]

/** The tray of buttons under the lesson closes with the notch; Enter still runs the main action. */
export const TrayClosed: Story = {
  args: { lesson: lessons.buttons },
  loaders: withPrefs({ tray: "closed" }),
}
/**
 * The ninja as the sensei: he settles and bows in, breathes while he waits, and bows at the earned
 * moments. On a lesson you can play through by keyboard, to reach the wrap-up and his line there.
 */
export const NinjaSensei: Story = {
  args: { lesson: lessons.compound },
  loaders: withPrefs({ ninja: "sensei" }),
}
/** The ninja setting at its top stop: bigger moves, and two reactions to every answer. */
export const NinjaUnhinged: Story = {
  args: { lesson: lessons.buttons },
  loaders: withPrefs({ ninja: "unhinged" }),
}
/** The ninja setting off: no ninja, and the feedback toast starts at the card's edge. */
export const NinjaOff: Story = {
  args: { lesson: lessons.buttons },
  loaders: withPrefs({ ninja: "off" }),
}
