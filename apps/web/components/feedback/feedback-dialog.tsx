"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"

import { FormError } from "@/components/account/form-error"
import {
  FEEDBACK_MAX,
  feedbackApi,
  type FeedbackApi,
} from "@/lib/feedback/browser"

/**
 * Tell the people who run learn.ninja about a bug: one text field, sent to Slack with the page,
 * the lesson, the browser, and the account it came from. `onReport` offers the lesson's own
 * report instead, for a problem with what a lesson says rather than with the site.
 */
export function FeedbackDialog({
  isOpen,
  onOpenChange,
  lessonId,
  onReport,
  api = feedbackApi,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  /** The published lesson open now, sent along with the message. */
  lessonId?: string
  /** Opens the lesson's report, on a listed lesson the viewer doesn't own. */
  onReport?: () => void
  api?: FeedbackApi
}) {
  const [message, setMessage] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [sent, setSent] = React.useState(false)
  const fieldId = React.useId()

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const text = message.trim()
    if (!text) return setError("Say what happened first.")
    setBusy(true)
    setError(null)
    const result = await api.send(text, lessonId)
    setBusy(false)
    if (result.error) return setError(result.error)
    setSent(true)
  }

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) {
          setMessage("")
          setError(null)
          setSent(false)
        }
      }}
    >
      {sent ? (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckIcon className="size-4 text-green-600" aria-hidden="true" />
              Thanks, got it
            </DialogTitle>
            <DialogDescription>
              Your note is with the people who build {"learn.ninja"}.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose variant="default">Done</DialogClose>
          </DialogFooter>
        </>
      ) : (
        <form onSubmit={(e) => void send(e)} className="contents">
          <DialogHeader>
            <DialogTitle>Something broken?</DialogTitle>
            <DialogDescription>
              Tell us what went wrong and we&apos;ll take a look.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor={fieldId}>What happened?</Label>
            <Textarea
              id={fieldId}
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={FEEDBACK_MAX}
              disabled={busy}
              className="min-h-28"
            />
            <FormError>{error}</FormError>
            {onReport ? (
              <p className="text-muted-foreground">
                A problem with what this lesson says?{" "}
                <Button
                  variant="link"
                  className="h-auto p-0"
                  onPress={() => {
                    onOpenChange(false)
                    onReport()
                  }}
                >
                  Report the lesson
                </Button>
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button type="submit" isDisabled={busy}>
              Send
            </Button>
          </DialogFooter>
        </form>
      )}
    </Dialog>
  )
}
