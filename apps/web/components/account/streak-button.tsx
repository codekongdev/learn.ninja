"use client"

import { ArrowRightIcon } from "lucide-react"

import { Lantern, StreakWeek, type DayStreak } from "@workspace/player"
import { Button } from "@workspace/ui/components/button"
import { Popover, PopoverTrigger } from "@workspace/ui/components/popover"

import { ButtonLink } from "@/components/site/button-link"

/**
 * The header's streak, before the profile picture: a lantern and the days in a row. The lantern is
 * lit once today has a finished lesson and unlit until then, so the header says whether today
 * still needs one. Pressing it opens the last seven days, the best streak, and the way to the
 * profile's activity grid.
 */
export function StreakButton({
  streak,
  profileHref,
  defaultOpen,
}: {
  streak: DayStreak
  /** The learner's profile, where the activity grid is; left out for a learner without a handle. */
  profileHref?: string
  /** For stories: start with the popover open. */
  defaultOpen?: boolean
}) {
  const today = streak.days.at(-1)?.state === "lit"
  const { current, longest, rest } = streak
  const title = `${current}-day streak`
  const hint =
    current === 0
      ? "Finish a lesson to light your first lantern."
      : today
        ? "Today's lantern is lit."
        : rest > 0
          ? "Finish a lesson today, or a rest day will keep your streak."
          : "Finish a lesson today to keep your streak."
  return (
    <PopoverTrigger defaultOpen={defaultOpen}>
      <Button
        variant="ghost"
        size="sm"
        aria-label={`${title}. ${hint}`}
        className="gap-1.5 px-2 tabular-nums"
      >
        <Lantern look={today ? "lit" : "unlit"} />
        {current}
      </Button>
      <Popover placement="bottom end" className="w-72 gap-0 p-0">
        <div className="flex flex-col gap-3 p-3">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-medium">{title}</p>
            {longest > 0 ? (
              <p className="text-xs text-muted-foreground tabular-nums">
                Best {longest}
              </p>
            ) : null}
          </div>
          <StreakWeek days={streak.days} />
          <p className="text-muted-foreground">{hint}</p>
        </div>
        {/* The rest days saved, and how more are earned, so the rule is never a surprise. */}
        <div className="flex flex-col gap-1 border-t p-3">
          <p className="flex items-center gap-1.5 font-medium">
            <Lantern look="rest" />
            {rest === 0
              ? "No rest days saved"
              : rest === 1
                ? "1 rest day saved"
                : `${rest} rest days saved`}
          </p>
          <p className="text-muted-foreground">
            Every 3 days you learn saves a rest day, up to 2. A day without a
            lesson uses one.
          </p>
        </div>
        {profileHref ? (
          <div className="border-t p-1">
            <ButtonLink
              href={profileHref}
              variant="ghost"
              size="sm"
              className="w-full justify-between"
            >
              Your activity
              <ArrowRightIcon
                data-icon="inline-end"
                className="rtl:-scale-x-100"
              />
            </ButtonLink>
          </div>
        ) : null}
      </Popover>
    </PopoverTrigger>
  )
}
