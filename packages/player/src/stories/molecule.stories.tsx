import type { Meta, StoryObj } from "@storybook/react-vite"

import type { Lesson } from "@workspace/spec"

import { BrickDemo } from "../brick-demo"
import { Visual } from "../visuals"
import { lessons, PlayerFrame, prepared } from "./fixtures"
import { moleculeSamples } from "./visual-kit"

// Molecules drawn from their SMILES by OpenChemLib on the server (stories:prepare draws these the
// same way): bonds in the text color, oxygen red and nitrogen blue mixed toward it, highlighted
// groups on a halo in the accent. Switch the toolbar's theme to check both.

const byName = (name: string) =>
  moleculeSamples.find((s) => s.name === name)!.molecule

const meta = {
  title: "Player/Molecule",
  component: Visual,
  argTypes: { visual: { control: false } },
  decorators: [
    (Story, { globals }) => (
      <PlayerFrame ui={globals.ui}>
        <div className="mx-auto max-w-2xl p-8">
          <Story />
        </div>
      </PlayerFrame>
    ),
  ],
} satisfies Meta<typeof Visual>

export default meta
type Story = StoryObj<typeof meta>

/** A skeletal formula: carbons at the corners and line ends, their hydrogens left out. */
export const Skeletal: Story = { args: { visual: byName("Caffeine") } }

/** `style: "full"`: every atom and bond, as beginners first meet a displayed formula. */
export const Full: Story = { args: { visual: byName("Ethanol") } }

/** A group marked by a SMARTS pattern: the ester of aspirin. */
export const Highlight: Story = { args: { visual: byName("Aspirin") } }

/** Two groups in a full drawing: each keeps the hydrogens on its nitrogen or oxygen. */
export const TwoGroups: Story = { args: { visual: byName("Glycine") } }

/** Every sample at its own size: one scale for all, so water stays small and cholesterol fits. */
export const Gallery: Story = {
  args: { visual: byName("Caffeine") },
  render: () => (
    <div className="grid gap-6">
      {moleculeSamples.map(({ name, molecule }) => (
        <div key={name}>
          <p className="mb-2 text-sm font-medium">{name}</p>
          <Visual visual={molecule} />
        </div>
      ))}
    </div>
  ),
}

/** Before it's drawn (a lesson without prepared data), the alt stands in. */
export const NotDrawn: Story = {
  args: {
    visual: {
      kind: "molecule",
      smiles: "C",
      alt: "Methane: one carbon with four hydrogens.",
    },
  },
}

/** The molecules in a lesson: a concept, and a question whose options are molecules. */
const moleculeLesson: Lesson = {
  ...lessons.buttons,
  language: "en",
  bricks: [
    {
      id: "c1",
      type: "concept",
      title: "Alcohols",
      body: "An **alcohol** has an OH group on a carbon. The OH is what makes ethanol mix with water.",
      visual: byName("Ethanol"),
    },
    {
      id: "p1",
      type: "choice",
      prompt: "Which of these is an alcohol?",
      options: [
        { id: "a", visual: byName("Propan-1-ol") },
        {
          id: "b",
          visual: byName("Propanone"),
          feedback: "Its oxygen is double-bonded to a carbon: a ketone.",
        },
        {
          id: "c",
          visual: byName("Propanoic acid"),
          feedback:
            "The OH sits on a C=O carbon, which makes it a carboxylic acid.",
        },
        {
          id: "d",
          visual: byName("Methoxyethane"),
          feedback: "Its oxygen sits between two carbons, with no H: an ether.",
        },
      ],
      correct: ["a"],
      multiple: false,
      explanation:
        "Propan-1-ol has an OH on a carbon with no C=O beside it, so it's an alcohol.",
    },
    ...lessons.buttons.bricks.slice(2),
  ],
} as Lesson

export const InAConcept: Story = {
  args: { visual: byName("Ethanol") },
  render: () => (
    <BrickDemo lesson={moleculeLesson} brickId="c1" prepared={prepared} />
  ),
}

export const AsOptions: Story = {
  args: { visual: byName("Ethanol") },
  render: () => (
    <BrickDemo lesson={moleculeLesson} brickId="p1" prepared={prepared} />
  ),
}
