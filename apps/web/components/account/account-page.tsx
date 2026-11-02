import type { DayStreak } from "@workspace/player"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import type { AccountInfo } from "@/lib/auth/account-info"

/** The frame for the log-in, settings, and keep pages: a narrow centered column, or `wide` to
 * match the footer. */
export function AccountPage({
  account,
  streak,
  wide = false,
  children,
}: {
  /** The logged-in user, or null when nobody is logged in. */
  account: AccountInfo | null
  /** The logged-in learner's streak, for the header's lantern. */
  streak?: DayStreak | null
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader account={account} streak={streak} feedback />
      <main
        className={
          wide
            ? "mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6 sm:py-16"
            : "mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-12 sm:px-6"
        }
      >
        {children}
      </main>
      <SiteFooter className="max-w-3xl" />
    </div>
  )
}
