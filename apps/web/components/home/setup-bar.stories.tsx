import type * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import type { SetupId } from "@/lib/site"
import { setSetup } from "@/lib/use-setup"

import { SetupBar } from "./setup-bar"

type Args = React.ComponentProps<typeof SetupBar> & { setup: SetupId }

const meta = {
  title: "Site/Setup bar",
  component: SetupBar,
  parameters: { layout: "fullscreen" },
  args: { fixed: false },
  argTypes: {
    // Not a prop: the story sets the page's CLI/MCP setting before the bar reads it.
    setup: { control: "radio", options: ["cli", "mcp"] },
  },
  decorators: [
    (Story, context) => {
      setSetup(context.args.setup)
      return <Story />
    },
  ],
} satisfies Meta<Args>

export default meta
type Story = StoryObj<Args>

/** The skill, the page's default. */
export const Cli: Story = { args: { setup: "cli" } }

/** The MCP server. */
export const Mcp: Story = { args: { setup: "mcp" } }
