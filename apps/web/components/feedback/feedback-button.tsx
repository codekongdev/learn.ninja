"use client"

import * as React from "react"
import { BugIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Tooltip, TooltipTrigger } from "@workspace/ui/components/tooltip"

import type { FeedbackApi } from "@/lib/feedback/browser"

import { FeedbackDialog } from "./feedback-dialog"

/** The header's bug button, on every page and in the player: opens the feedback dialog. */
export function FeedbackButton({
  lessonId,
  onReport,
  api,
  className,
}: {
  lessonId?: string
  onReport?: () => void
  api?: FeedbackApi
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <TooltipTrigger delay={300}>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Report a bug"
          onPress={() => setOpen(true)}
          className={className}
        >
          <BugIcon />
        </Button>
        <Tooltip>Report a bug</Tooltip>
      </TooltipTrigger>
      <FeedbackDialog
        isOpen={open}
        onOpenChange={setOpen}
        lessonId={lessonId}
        onReport={onReport}
        api={api}
      />
    </>
  )
}
