import type { Meta, StoryObj } from "@storybook/react-vite"
import { useGlobals } from "storybook/preview-api"

import type { Lesson } from "@workspace/spec"

import { buildSequence, scoredQuestions, type Outcome } from "../flow"
import { LessonPlayer, type State } from "../lesson-player"
import { fingerprint } from "../progress"
import { lessons, prepared } from "./fixtures"

// The whole player, playable end to end. Switch language and theme in the toolbar or the footer.

const HOUR = 3.6e6
const DAY = 24 * HOUR

const meta = {
  title: "Player/Lesson player",
  component: LessonPlayer,
  // A freshly published link: the lesson menu (the chevron by the title) says it expires in 7 days.
  args: { lesson: lessons.buttons, prepared, expiresAt: Date.now() + 7 * DAY },
  argTypes: {
    lesson: { control: false },
    prepared: { control: false },
    expiresAt: { control: "date" },
  },
  render: function Render(args, { globals }) {
    const [, updateGlobals] = useGlobals()
    return (
      <div className="h-screen">
        <LessonPlayer
          key={globals.ui}
          {...args}
          uiLanguage={globals.ui}
          homeHref="#"
          nextPrompt={(topic, after) =>
            `Make me a learn.ninja lesson about ${topic}, as a follow-up to my lesson "${after}".`
          }
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
/** Under a day left: the lesson menu counts the link's time in hours instead of days. */
export const ExpiresSoon: Story = {
  args: { lesson: lessons.buttons, expiresAt: Date.now() + 14 * HOUR },
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
/**
 * Story mode: a scenario opens with the ninja's brief. He steps up to tell it, goes back to his
 * corner for the question, says what each pick led to, and a miss rewinds to the decision.
 */
export const ScenarioStoryMode: Story = {
  name: "Scenario story mode",
  args: { lesson: lessons.buttons, startAt: "ch" },
  loaders: withPrefs({ ninja: "casual" }),
}

/**
 * Opens on the wrap-up, as if the lesson was just finished with these outcomes (in play order, the
 * rest first try), by saving that progress for the player to resume. The time isn't known there.
 */
const atWrap = (lesson: Lesson, key: string, outcomes: Outcome[] = []) => [
  () => {
    const items = buildSequence(lesson)
    const state: State = {
      items,
      index: items.length - 1,
      results: Object.fromEntries(
        scoredQuestions(lesson).map((b, i) => [b.id, outcomes[i] ?? "first"])
      ),
      mistakes: [],
      fixed: [],
      inFix: false,
      fixQueued: false,
      question: null,
      run: 0,
    }
    localStorage.setItem(
      `learn:progress:${key}`,
      JSON.stringify({
        v: 1,
        fingerprint: fingerprint(lesson),
        savedAt: Date.now(),
        state,
      })
    )
  },
]

/** The wrap-up after a perfect run: all first tries, and Share leads. */
export const WrapUpPerfect: Story = {
  name: "Wrap-up: perfect run",
  args: { lesson: lessons.buttons, progressKey: "story-wrap-perfect" },
  loaders: atWrap(lessons.buttons, "story-wrap-perfect"),
}
/** A good run (at most one missed): Share still leads. */
export const WrapUpGood: Story = {
  name: "Wrap-up: good run",
  args: { lesson: lessons.buttons, progressKey: "story-wrap-good" },
  loaders: atWrap(lessons.buttons, "story-wrap-good", ["first", "second"]),
}
/** A rough run (more than one missed): Restart leads. */
export const WrapUpRough: Story = {
  name: "Wrap-up: rough run",
  args: { lesson: lessons.buttons, progressKey: "story-wrap-rough" },
  loaders: atWrap(lessons.buttons, "story-wrap-rough", [
    "missed",
    "first",
    "missed",
    "second",
  ]),
}
