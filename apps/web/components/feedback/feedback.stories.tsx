import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import { Button } from "@workspace/ui/components/button"

import type { FeedbackApi } from "@/lib/feedback/browser"

import { FeedbackButton } from "./feedback-button"
import { FeedbackDialog } from "./feedback-dialog"

// The bug button and its dialog with a fake server: a message with "fail" in it is refused.

const fakeApi: FeedbackApi = {
  async send(message) {
    await new Promise((r) => setTimeout(r, 400))
    return message.includes("fail")
      ? {
          error:
            "That's a lot of feedback from here recently. Try again later.",
        }
      : {}
  },
}

const meta: Meta = { title: "Site/Feedback" }
export default meta
type Story = StoryObj

export const ButtonInHeader: Story = {
  name: "Bug button",
  render: () => <FeedbackButton api={fakeApi} />,
}

export const Dialog: Story = {
  name: "Feedback dialog",
  render: function Render() {
    const [open, setOpen] = React.useState(true)
    return (
      <>
        <Button variant="outline" onPress={() => setOpen(true)}>
          Report a bug
        </Button>
        <FeedbackDialog isOpen={open} onOpenChange={setOpen} api={fakeApi} />
      </>
    )
  },
}

export const OnALesson: Story = {
  name: "Feedback dialog (on a listed lesson)",
  render: function Render() {
    const [open, setOpen] = React.useState(true)
    return (
      <>
        <Button variant="outline" onPress={() => setOpen(true)}>
          Report a bug
        </Button>
        <FeedbackDialog
          isOpen={open}
          onOpenChange={setOpen}
          lessonId="k3x9a2mq"
          onReport={() => alert("The lesson's report opens here.")}
          api={fakeApi}
        />
      </>
    )
  },
}
