"use client"

import { usePathname } from "next/navigation"

import type { DayStreak } from "@workspace/player"
import { cn } from "@workspace/ui/lib/utils"

import type { Account } from "@/components/account/account-link"
import { AccountMenu } from "@/components/account/account-menu"
import { StreakButton } from "@/components/account/streak-button"
import { ButtonLink } from "@/components/site/button-link"

/**
 * The end of a lesson's header, in the same spot as on the rest of the site: the lantern and the
 * profile picture once logged in, Sign up for a visitor. Phones keep the lantern and find the
 * picture's menu in the lesson's own menu. A visitor comes back to this lesson after signing up;
 * until a prerendered page has read the marker cookie, Sign up holds its space invisibly.
 */
export function LessonAccount({
  account,
  streak,
}: {
  account: Account
  /** The logged-in learner's streak, for pages that know it. */
  streak?: DayStreak
}) {
  const pathname = usePathname()
  if (!account)
    return (
      <ButtonLink
        href={`/login?signup=1&callback=${encodeURIComponent(pathname)}`}
        variant="outline"
        size="sm"
        className={cn(account === undefined && "invisible")}
        aria-hidden={account === undefined || undefined}
      >
        Sign up
      </ButtonLink>
    )
  return (
    <div className="flex items-center gap-1">
      {streak ? (
        <StreakButton
          streak={streak}
          profileHref={account.handle ? `/u/${account.handle}` : undefined}
        />
      ) : null}
      <AccountMenu account={account} hover={false} className="max-sm:hidden" />
    </div>
  )
}
