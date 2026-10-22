"use client"

import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  EyeOffIcon,
  GlobeIcon,
  LockIcon,
  PencilIcon,
} from "lucide-react"

import { LEVELS, type Level } from "@workspace/spec"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import { cn } from "@workspace/ui/lib/utils"

import { usePlayer } from "./context"
import { LESSON_CHANGES, type LessonChange, type Strings } from "./strings"

/**
 * The wrap-up's card for the lesson's maker, in the heart's place: where the lesson stands, Publish
 * while it's private, and Make changes, a dialog that turns a new level, ticked changes, and the
 * maker's own words into one prompt to paste back into the chat that made the lesson.
 */
export function CreatorCard({ level }: { level: Level }) {
  const { t, creator } = usePlayer()
  // Publishing here moves it on without a reload.
  const [status, setStatus] = React.useState(creator?.status ?? "private")
  const [busy, setBusy] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  const [changesOpen, setChangesOpen] = React.useState(false)
  if (!creator) return null

  async function publish() {
    if (!creator?.onPublish || busy) return
    setBusy(true)
    setFailed(false)
    const result = await creator.onPublish().catch(() => ({ error: "network" }))
    setBusy(false)
    if (result.error) return setFailed(true)
    setStatus("published")
  }

  const { Icon, label, body } = standing(t)[status]
  return (
    <>
      <Card size="sm">
        <CardContent className="flex flex-col gap-3">
          <div aria-live="polite" className="flex flex-col gap-1">
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Icon aria-hidden="true" className="size-3.5" />
              {label}
            </p>
            {status === "private" ? (
              <p className="text-sm font-semibold">{t.publishTitle}</p>
            ) : null}
            <p className="text-sm text-muted-foreground">{body}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {status === "private" && creator.onPublish ? (
              <Button
                size="sm"
                isDisabled={busy}
                onPress={() => void publish()}
              >
                <GlobeIcon data-icon="inline-start" />
                {t.publish}
              </Button>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              onPress={() => setChangesOpen(true)}
            >
              <PencilIcon data-icon="inline-start" />
              {t.makeChanges}
            </Button>
          </div>
          {failed ? (
            <p role="alert" className="text-sm text-destructive">
              {t.publishFailed}
            </p>
          ) : null}
        </CardContent>
      </Card>
      <ChangesDialog
        isOpen={changesOpen}
        onOpenChange={setChangesOpen}
        url={creator.url}
        level={level}
      />
    </>
  )
}

function standing(t: Strings) {
  return {
    private: { Icon: LockIcon, label: t.creatorPrivate, body: t.publishBody },
    published: {
      Icon: GlobeIcon,
      label: t.creatorPublished,
      body: t.publishedBody,
    },
    hidden: { Icon: EyeOffIcon, label: t.creatorHidden, body: t.hiddenBody },
  }
}

/**
 * The prompt Make changes copies: the lesson's link, then each change as a line of a list, a new
 * level first when there is one.
 */
export function changesPrompt(
  t: Strings,
  url: string,
  picked: LessonChange[],
  other: string,
  level?: Level
): string {
  const lines = [
    ...(level ? [t.changeLevel(t.levels[level])] : []),
    ...LESSON_CHANGES.filter((c) => picked.includes(c)).map(
      (c) => t.changes[c]
    ),
    ...(other.trim() ? [other.trim()] : []),
  ]
  if (!lines.length) return ""
  return `${t.changesPrompt(url)}\n${lines.map((l) => `- ${l}`).join("\n")}`
}

/**
 * The level to pick, starting at the lesson's own, ready-made changes to tick, and a box for anything
 * else, copied as one prompt. The page can't reach the maker's chat, so they paste it there; their
 * agent updates the lesson at the same link. The picks stay while the page is open, in case they
 * come back for more.
 */
function ChangesDialog({
  isOpen,
  onOpenChange,
  url,
  level,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  url: string
  level: Level
}) {
  const { t } = usePlayer()
  const [target, setTarget] = React.useState(level)
  const [picked, setPicked] = React.useState<LessonChange[]>([])
  const [other, setOther] = React.useState("")
  const [note, setNote] = React.useState<{ error: boolean; text: string }>()
  const [copied, setCopied] = React.useState(false)
  const id = React.useId()

  // An edit after copying makes the copy stale: back to Copy changes.
  function edited() {
    setCopied(false)
    setNote(undefined)
  }

  async function copy(e: React.FormEvent) {
    e.preventDefault()
    if (copied) return close(false)
    const text = changesPrompt(
      t,
      url,
      picked,
      other,
      target === level ? undefined : target
    )
    if (!text) return setNote({ error: true, text: t.changesEmpty })
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setNote({ error: false, text: t.changesCopied })
    } catch {
      setNote({ error: true, text: t.copyFailed })
    }
  }

  function close(open: boolean) {
    onOpenChange(open)
    if (!open) edited()
  }

  return (
    <Dialog isOpen={isOpen} onOpenChange={close}>
      <form onSubmit={(e) => void copy(e)} className="contents">
        <DialogHeader>
          <DialogTitle>{t.makeChanges}</DialogTitle>
          <DialogDescription>{t.changesBody}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Label id={`${id}-level`}>{t.changesLevel}</Label>
          <ToggleGroup
            aria-labelledby={`${id}-level`}
            variant="outline"
            spacing={1}
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[target]}
            onSelectionChange={(keys) => {
              const [next] = keys
              if (next === undefined) return
              setTarget(next as Level)
              edited()
            }}
            className="w-full"
          >
            {LEVELS.map((l) => (
              // Selected as other controls are: the toggle's own fill alone vanishes in dark mode.
              <ToggleGroupItem
                key={l}
                id={l}
                className="flex-1 data-selected:border-primary"
              >
                {t.levels[l]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="flex flex-col gap-3">
          {LESSON_CHANGES.map((change) => (
            <div key={change} className="flex items-center gap-2">
              <Checkbox
                id={`${id}-${change}`}
                isSelected={picked.includes(change)}
                onChange={(on) => {
                  setPicked((was) =>
                    on ? [...was, change] : was.filter((c) => c !== change)
                  )
                  edited()
                }}
              />
              <Label htmlFor={`${id}-${change}`} className="font-normal">
                {t.changes[change]}
              </Label>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-other`}>{t.changesOther}</Label>
          <Textarea
            id={`${id}-other`}
            value={other}
            placeholder={t.changesPlaceholder}
            onChange={(e) => {
              setOther(e.target.value)
              edited()
            }}
          />
        </div>
        <DialogFooter className="sm:items-center">
          <p
            role="status"
            className={cn(
              "text-sm sm:me-auto",
              note?.error ? "text-destructive" : "text-muted-foreground",
              !note && "sr-only"
            )}
          >
            {note?.text}
          </p>
          <DialogClose>{t.cancel}</DialogClose>
          <Button type="submit">
            {copied ? (
              <CheckIcon data-icon="inline-start" />
            ) : (
              <CopyIcon data-icon="inline-start" />
            )}
            {copied ? t.changesDone : t.copyChanges}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
