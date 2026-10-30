"use client"

import * as React from "react"
import {
  ArrowUpRightIcon,
  BookOpenIcon,
  LogOutIcon,
  SettingsIcon,
  UserRoundIcon,
} from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"

import type { AccountInfo } from "@/lib/auth/account-info"
import { accountApi, type AccountApi } from "@/lib/auth/browser"

import { logOutAndLeave } from "./log-out-button"
import { UserAvatar } from "./user-avatar"

/** How long the pointer rests on the picture before the menu opens, and off it before it closes. */
const OPEN_DELAY = 100
const CLOSE_DELAY = 200

/**
 * The header's account control once logged in: the profile picture, with a menu of everywhere
 * the user can go (Explore, their profile, their lessons, settings, the docs in a new tab) and
 * log out. With a mouse the menu opens on hover and stays while the pointer is on it; a tap,
 * a click, or Enter opens it too, so phones and keyboards aren't left out. A lesson turns the hover
 * off (`hover={false}`), so passing the picture on the way to Share doesn't open anything.
 */
export function AccountMenu({
  account,
  api = accountApi,
  navigate,
  hover = true,
  defaultOpen = false,
  className,
}: {
  account: AccountInfo
  api?: AccountApi
  /** Whether a resting mouse opens the menu, as well as a click. */
  hover?: boolean
  /** Where to go after logging out; the browser's own navigation by default. */
  navigate?: (to: string) => void
  /** For stories: start with the menu open. */
  defaultOpen?: boolean
  className?: string
}) {
  const [open, setOpen] = React.useState(defaultOpen)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  // Whether a mouse is on the picture: a click there then keeps the menu you're looking at
  // instead of toggling it away.
  const overTrigger = React.useRef(false)
  const later = (fn: () => void, ms: number) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(fn, ms)
  }
  React.useEffect(() => () => clearTimeout(timer.current), [])
  const enter = () => later(() => setOpen(true), OPEN_DELAY)
  const leave = () => later(() => setOpen(false), CLOSE_DELAY)
  const byMouse = (e: React.PointerEvent) => hover && e.pointerType !== "touch"

  return (
    <DropdownMenuTrigger
      isOpen={open}
      onOpenChange={(next) => {
        if (!next && overTrigger.current) return
        clearTimeout(timer.current)
        setOpen(next)
      }}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`${accountName(account)}: account menu`}
        className={cn("ms-1 rounded-full", className)}
        onHoverStart={
          hover
            ? () => {
                overTrigger.current = true
                enter()
              }
            : undefined
        }
        onHoverEnd={
          hover
            ? () => {
                overTrigger.current = false
                leave()
              }
            : undefined
        }
      >
        <UserAvatar
          image={account.image}
          handle={account.handle}
          size="header"
        />
      </Button>
      <DropdownMenu
        placement="bottom end"
        className="w-auto min-w-44"
        isNonModal
        onPointerEnter={(e) => {
          if (byMouse(e)) clearTimeout(timer.current)
        }}
        onPointerLeave={(e) => {
          if (byMouse(e)) leave()
        }}
      >
        <DropdownMenuGroup aria-label="Account">
          <AccountPlaces account={account} />
          <DropdownMenuItem href="/docs" target="_blank" textValue="Docs">
            <BookOpenIcon />
            Docs
            <ArrowUpRightIcon
              className="ms-auto size-3.5 text-muted-foreground"
              aria-hidden="true"
            />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <LogOutItem api={api} navigate={navigate} />
        </DropdownMenuGroup>
      </DropdownMenu>
    </DropdownMenuTrigger>
  )
}

/** The account's rows for a lesson's phone menu, which has no profile picture to open this menu. */
export function AccountMenuItems({ account }: { account: AccountInfo }) {
  return (
    <DropdownMenuGroup aria-label="Account">
      <AccountPlaces account={account} />
      <LogOutItem />
    </DropdownMenuGroup>
  )
}

function accountName(account: AccountInfo) {
  return account.handle ? `@${account.handle}` : "Account"
}

function AccountPlaces({ account }: { account: AccountInfo }) {
  return (
    <>
      <DropdownMenuLabel>
        <bdi dir="ltr">{accountName(account)}</bdi>
      </DropdownMenuLabel>
      {account.handle ? (
        <DropdownMenuItem href={`/u/${account.handle}`}>
          <UserRoundIcon />
          Profile
        </DropdownMenuItem>
      ) : null}
      <DropdownMenuItem href="/settings">
        <SettingsIcon />
        Settings
      </DropdownMenuItem>
    </>
  )
}

function LogOutItem({
  api = accountApi,
  navigate,
}: {
  api?: AccountApi
  navigate?: (to: string) => void
}) {
  return (
    <DropdownMenuItem onAction={() => void logOutAndLeave(api, navigate)}>
      <LogOutIcon />
      Log out
    </DropdownMenuItem>
  )
}
