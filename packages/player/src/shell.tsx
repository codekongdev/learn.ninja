"use client"

import * as React from "react"
import {
  createLucideIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  GlobeIcon,
  KeyboardIcon,
  MonitorIcon,
  MoonIcon,
  RotateCcwIcon,
  SettingsIcon,
  ShareIcon,
  SunIcon,
  TypeIcon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
} from "lucide-react"

import type { ConceptBrick } from "@workspace/spec"
import { Button, LinkButton } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Kbd } from "@workspace/ui/components/kbd"
import { Popover, PopoverTrigger } from "@workspace/ui/components/popover"
import { Progress } from "@workspace/ui/components/progress"
import { Slider } from "@workspace/ui/components/slider"
import { cn } from "@workspace/ui/lib/utils"

import type { PartProgress } from "./flow"
import { Ninja, type NinjaMood } from "./ninja"
import { RichText } from "./rich-text"
import {
  UI_LANGUAGES,
  uiLanguageFor,
  type NinjaLevel,
  type Strings,
  type TextSize,
  type Theme,
} from "./strings"

// The frame around every lesson screen: header (home, title menu, progress, Share), the player's
// settings at the end of the tray, footer (credit and app settings), and the Theory panel. Layout
// follows the Figma frame "Learn" (node 2004:15459).
//
// Three kinds of controls, each in its own place: the header is about this lesson (title, progress,
// share, restart) plus a gear menu for the app (theme, language); the tray is about how you play
// (the screen's actions in the middle, the ninja at the start where he lives, text size at the end);
// the footer holds the credit, the legal and docs links, and the keyboard shortcuts.

export const BRAND = {
  name: "learn.ninja",
  maker: "@cmicpace",
  makerUrl: "https://x.com/cmicpace",
}

/** The working Learn logo: an outlined face with a cap, a smile, and tall oval eyes. */
export function LearnLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g stroke="currentColor" strokeWidth="5" strokeLinejoin="round">
        <path d="M7.01 24.83A26 26 0 0 1 56.99 24.83Q32 15.17 7.01 24.83Z" />
        <path d="M56.99 39.17Q32 48.83 7.01 39.17A26 26 0 0 0 56.99 39.17Z" />
      </g>
      <g fill="currentColor">
        <ellipse cx="25" cy="32" rx="2.9" ry="4.6" />
        <ellipse cx="39" cy="32" rx="2.9" ry="4.6" />
      </g>
    </svg>
  )
}

/** Lucide's PanelRight with the panel filled in, for showing the Theory panel is open. */
export const PanelRightFilledIcon = createLucideIcon("panel-right-filled", [
  [
    "rect",
    { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "frame" },
  ],
  ["path", { d: "M15 3v18", key: "divider" }],
  [
    "path",
    {
      d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4Z",
      fill: "currentColor",
      key: "panel",
    },
  ],
])

// ---------- viewer preferences (kept in this browser only) ----------

export interface Preferences {
  textSize: TextSize
  /** The viewer's chosen language for the player's own text. */
  uiLanguage?: string
  /** Whether the tray of action buttons under the lesson is open (it is until closed). */
  tray?: "open" | "closed"
  /** Sound effects (on until muted). */
  sound?: "on" | "off"
  /** The ninja's character (Default until changed). */
  ninja?: NinjaLevel
}

const PREFERENCES_KEY = "learn:preferences"

export function usePreferences() {
  const [prefs, setPrefs] = React.useState<Preferences>({ textSize: "sm" })
  React.useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(PREFERENCES_KEY) ?? "{}"
      ) as Partial<Preferences> & { ninja?: string }
      // The characters were renamed: Normal became Default, and Sensei took Caffeinated's place.
      const renamed: Record<string, NinjaLevel> = {
        normal: "default",
        caffeinated: "sensei",
      }
      if (saved.ninja && saved.ninja in renamed)
        saved.ninja = renamed[saved.ninja]
      setPrefs((p) => ({ ...p, ...(saved as Partial<Preferences>) }))
    } catch {
      // Storage can be blocked or empty; the defaults are fine.
    }
  }, [])
  const update = React.useCallback((patch: Partial<Preferences>) => {
    setPrefs((p) => {
      const next = { ...p, ...patch }
      try {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next))
      } catch {
        // Not saved; the choice still applies until the page closes.
      }
      return next
    })
  }, [])
  return [prefs, update] as const
}

/** Hours until the link expires (at least 1), updated every minute. Null until mounted. */
export function useHoursLeft(expiresAt?: number): number | null {
  const [hours, setHours] = React.useState<number | null>(null)
  React.useEffect(() => {
    if (!expiresAt) return
    const update = () =>
      setHours(Math.max(1, Math.floor((expiresAt - Date.now()) / 3.6e6)))
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [expiresAt])
  return expiresAt ? hours : null
}

// ---------- header ----------

export function LessonHeader({
  title,
  parts,
  showParts = true,
  expiresAt,
  homeHref,
  createHref,
  shareUrl,
  settings,
  onRestart,
  onRename,
  t,
}: {
  title: string
  parts: PartProgress
  /** False on the title screen: the bar appears with the first question. */
  showParts?: boolean
  expiresAt?: number
  homeHref: string
  createHref?: string
  shareUrl?: string
  /** The app's settings menu, shown before Share. */
  settings?: React.ReactNode
  onRestart: () => void
  /** Called with the new title when the learner renames the lesson in the header. */
  onRename?: (title: string) => void
  t: Strings
}) {
  const hours = useHoursLeft(expiresAt)
  const [confirmRestart, setConfirmRestart] = React.useState(false)
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-4 sm:h-16 sm:px-8">
      <div className="flex min-w-0 flex-1 items-center">
        <LinkButton
          href={homeHref}
          variant="ghost"
          size="icon-sm"
          aria-label={t.home}
        >
          <LearnLogo className="size-5.5" />
        </LinkButton>
        {/* The mark sits 3px inside its box and the title text 10px inside its button, so the slash's
            margins are uneven on purpose: the visible gaps come out the same on both sides. */}
        <span aria-hidden="true" className="ms-2 text-xs text-muted-foreground">
          /
        </span>
        <div className="flex min-w-0 items-center">
          <LessonTitle title={title} onRename={onRename} t={t} />
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon-sm" aria-label={t.lessonMenu}>
              <ChevronDownIcon />
            </Button>
            <DropdownMenu className="w-auto">
              <DropdownMenuGroup>
                {hours !== null ? (
                  <DropdownMenuLabel className="flex items-center gap-1.5">
                    <ClockIcon className="size-3.5" aria-hidden="true" />
                    {t.expires(hours)}
                  </DropdownMenuLabel>
                ) : null}
                <DropdownMenuItem onAction={() => setConfirmRestart(true)}>
                  <RotateCcwIcon />
                  {t.restart}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenu>
          </DropdownMenuTrigger>
        </div>
        <Dialog isOpen={confirmRestart} onOpenChange={setConfirmRestart}>
          <DialogHeader>
            <DialogTitle>{t.restartTitle}</DialogTitle>
            <DialogDescription>{t.restartBody}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>{t.stay}</DialogClose>
            <DialogClose variant="destructive" onPress={onRestart}>
              {t.restart}
            </DialogClose>
          </DialogFooter>
        </Dialog>
      </div>
      {showParts ? (
        <PartsProgress parts={parts} t={t} />
      ) : (
        // Holds the middle of the header so the buttons don't shift when the bar appears.
        <div aria-hidden="true" className="min-w-0 sm:flex-1" />
      )}
      <div className="flex items-center justify-end gap-1 sm:flex-1">
        {settings}
        <ShareButton title={title} url={shareUrl} t={t} />
        {createHref ? (
          <LinkButton href={createHref} size="sm" className="max-sm:hidden">
            {t.createLesson}
          </LinkButton>
        ) : null}
      </div>
    </header>
  )
}

/** The lesson's title. Press it to edit; Enter or leaving the field saves, Escape cancels. */
function LessonTitle({
  title,
  onRename,
  t,
}: {
  title: string
  onRename?: (title: string) => void
  t: Strings
}) {
  const [draft, setDraft] = React.useState<string | null>(null)
  const commit = () => {
    const next = draft?.trim()
    if (next && next !== title) onRename?.(next)
    setDraft(null)
  }
  if (draft !== null)
    return (
      // Edited in place: the field takes the title's exact look and spot, and its width follows the
      // text (the hidden copy underneath sets the size). Nothing moves when editing starts.
      // The field floats over an invisible copy of the text, so only the text sets the width: an
      // input in the flow would widen the box to its own default size on short titles.
      <span className="relative inline-block max-w-40 min-w-0 shrink sm:max-w-80">
        <span
          aria-hidden="true"
          className="invisible block h-7 border border-transparent px-2.5 text-sm font-medium whitespace-pre"
        >
          {draft || " "}
        </span>
        <Input
          autoFocus
          aria-label={t.lessonName}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={(e) => e.target.select()}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit()
            if (e.key === "Escape") setDraft(null)
          }}
          className="absolute inset-0 h-7 w-full min-w-0 border-transparent bg-muted px-2.5 text-sm font-medium shadow-none md:text-sm dark:bg-muted"
        />
      </span>
    )
  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label={t.renameLesson}
      onPress={() => setDraft(title)}
      // Hugs the title up to a cap, then truncates (titles are at most 60 characters).
      className="max-w-40 min-w-0 shrink sm:max-w-80"
    >
      <span className="truncate">{title}</span>
    </Button>
  )
}

/**
 * One segment per part: finished parts and upcoming parts are short pills, the current part is a full bar.
 * It mounts when the lesson starts, so each segment slides in, one after the other.
 */
function PartsProgress({ parts, t }: { parts: PartProgress; t: Strings }) {
  const enter = (i: number) => ({
    className:
      "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500",
    style: { animationDelay: `${i * 90}ms` },
  })
  return (
    <div className="flex min-w-0 items-center gap-1.5 sm:flex-1 sm:gap-2">
      {Array.from({ length: parts.count }, (_, i) =>
        i === parts.current ? (
          <Progress
            key={i}
            value={Math.round(parts.fraction * 100)}
            aria-label={t.progress}
            valueLabel={t.part(i + 1, parts.count)}
            style={enter(i).style}
            className={cn(
              "w-16 min-w-0 shrink-0 transition-all duration-500 sm:w-auto sm:max-w-[400px] sm:flex-1 sm:shrink [&_[data-slot=progress-indicator]]:rounded-full [&_[data-slot=progress-track]]:h-2.5",
              enter(i).className
            )}
          />
        ) : (
          <span
            key={i}
            aria-hidden="true"
            style={enter(i).style}
            className={cn(
              "h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-500 sm:w-5",
              i < parts.current || parts.done ? "bg-primary" : "bg-muted",
              enter(i).className
            )}
          />
        )
      )}
    </div>
  )
}

function ShareButton({
  title,
  url,
  t,
}: {
  title: string
  url?: string
  t: Strings
}) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(id)
  }, [copied])

  async function share() {
    const link = url ?? window.location.href
    // Phones get the system share sheet; everywhere else copies the link.
    if (navigator.share && matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, url: link })
      } catch {
        // Dismissed by the viewer.
      }
      return
    }
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
    } catch {
      // Clipboard blocked; nothing else to do.
    }
  }

  const label = copied ? t.linkCopied : t.share
  return (
    <>
      <Button variant="outline" size="sm" onPress={share} aria-label={label}>
        {copied ? (
          <CheckIcon data-icon="inline-start" />
        ) : (
          <ShareIcon className="sm:hidden" />
        )}
        <span className="max-sm:sr-only">{label}</span>
      </Button>
      <span aria-live="polite" className="sr-only">
        {copied ? t.linkCopied : ""}
      </span>
    </>
  )
}

// ---------- footer ----------

export function LessonFooter({
  homeHref,
  privacyHref,
  termsHref,
  docsHref,
  t,
  shortcutsOpen,
  onShortcutsChange,
}: {
  homeHref: string
  /** The legal pages and the docs. Omit any to hide its link. */
  privacyHref?: string
  termsHref?: string
  docsHref?: string
  t: Strings
  /** The keyboard shortcuts dialog, which "?" also opens. */
  shortcutsOpen: boolean
  onShortcutsChange: (open: boolean) => void
}) {
  const links = [
    [docsHref, t.docs],
    [privacyHref, t.privacy],
    [termsHref, t.terms],
  ].filter((l): l is [string, string] => Boolean(l[0]))
  return (
    <footer className="flex h-12 shrink-0 items-center gap-2 px-4 pb-[env(safe-area-inset-bottom,0px)] sm:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm font-medium">
        <a
          href={homeHref}
          className="shrink-0 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="max-sm:hidden">© {new Date().getFullYear()} </span>
          {BRAND.name}
        </a>
        {links.map(([href, label]) => (
          <React.Fragment key={href}>
            <span aria-hidden="true" className="text-muted-foreground">
              ·
            </span>
            <a
              href={href}
              className="shrink-0 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {label}
            </a>
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1">
        {/* Touch screens have no keys to list. */}
        <Button
          variant="ghost"
          size="sm"
          aria-label={t.shortcuts}
          className="pointer-coarse:hidden"
          onPress={() => onShortcutsChange(true)}
        >
          <KeyboardIcon />
          <Kbd>?</Kbd>
        </Button>
        <ShortcutsDialog
          isOpen={shortcutsOpen}
          onOpenChange={onShortcutsChange}
          t={t}
        />
      </div>
    </footer>
  )
}

/** The app's settings behind a gear in the header: theme and language as submenus. */
export function AppSettings({
  theme,
  onThemeChange,
  uiLanguage,
  onPrefs,
  t,
}: {
  theme?: Theme
  onThemeChange?: (theme: Theme) => void
  uiLanguage: string
  onPrefs: (patch: Partial<Preferences>) => void
  t: Strings
}) {
  const language = uiLanguageFor(uiLanguage) ?? UI_LANGUAGES[0]
  const ThemeIcon =
    theme === "dark" ? MoonIcon : theme === "light" ? SunIcon : MonitorIcon
  const single = (onPick: (key: string) => void) => ({
    selectionMode: "single" as const,
    disallowEmptySelection: true,
    onSelectionChange: (keys: "all" | Iterable<unknown>) => {
      if (keys === "all") return
      const [key] = keys
      if (key !== undefined) onPick(String(key))
    },
  })
  return (
    <DropdownMenuTrigger>
      <Button variant="ghost" size="icon-sm" aria-label={t.settings}>
        <SettingsIcon />
      </Button>
      <DropdownMenu placement="bottom end" className="w-auto min-w-44">
        <DropdownMenuGroup aria-label={t.settings}>
          {onThemeChange ? (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger textValue={t.theme}>
                <ThemeIcon />
                {t.theme}
                <span className="text-muted-foreground">
                  {t.themes[theme ?? "system"]}
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                aria-label={t.theme}
                selectedKeys={[theme ?? "system"]}
                {...single((key) => onThemeChange(key as Theme))}
              >
                {(["system", "light", "dark"] as const).map((id) => (
                  <DropdownMenuItem key={id} id={id} textValue={t.themes[id]}>
                    {t.themes[id]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ) : null}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger textValue={t.language}>
              <GlobeIcon />
              {t.language}
              <span className="text-muted-foreground">{language.label}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              aria-label={t.language}
              // About nine rows; the rest scrolls.
              maxHeight={320}
              selectedKeys={[language.code]}
              {...single((code) => onPrefs({ uiLanguage: code }))}
            >
              {UI_LANGUAGES.map((l) => (
                <DropdownMenuItem key={l.code} id={l.code} textValue={l.label}>
                  <span lang={l.code}>{l.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenu>
    </DropdownMenuTrigger>
  )
}

/** The keys the player answers to. Opened from the footer or with "?". */
function ShortcutsDialog({
  isOpen,
  onOpenChange,
  t,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  t: Strings
}) {
  const rows: [keys: string[], label: string][] = [
    [["Enter"], t.shortcutMain],
    [["1", "9"], t.shortcutPick],
    [["?"], t.shortcutHelp],
  ]
  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{t.shortcuts}</DialogTitle>
      </DialogHeader>
      <ul className="flex flex-col divide-y">
        {rows.map(([keys, label]) => (
          <li
            key={label}
            className="flex items-center justify-between gap-4 py-2 text-sm"
          >
            <span>{label}</span>
            <span className="flex shrink-0 items-center gap-1">
              {keys.map((key, i) => (
                <React.Fragment key={key}>
                  {i > 0 ? (
                    <span className="text-xs text-muted-foreground">–</span>
                  ) : null}
                  <Kbd className="bg-muted text-foreground">{key}</Kbd>
                </React.Fragment>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </Dialog>
  )
}

// ---------- player settings (the end of the tray) ----------

/** Every button in the tray is `lg` and a pill, with room for the round ends. */
export const TRAY_BUTTON = "rounded-full px-4"

/** Sound effects aren't in yet; the setting is ready for when they are. */
const SHOW_SOUND = false

export const NINJA_LEVELS = [
  "off",
  "default",
  "sensei",
  "unhinged",
] as const satisfies readonly NinjaLevel[]

/** The signature move the preview plays when you land on each level. */
const NINJA_PREVIEW: Record<NinjaLevel, NinjaMood> = {
  off: "closed",
  default: "happy",
  sensei: "nod",
  unhinged: "flip",
}

/**
 * Settings that change how the lesson plays, in the tray. The ninja's sits at the start, under the
 * corner he lives in; text size and sound sit at the end.
 */
export function PlayerSettings({
  side,
  prefs,
  onPrefs,
  t,
}: {
  side: "start" | "end"
  prefs: Preferences
  onPrefs: (patch: Partial<Preferences>) => void
  t: Strings
}) {
  const sound = prefs.sound ?? "on"
  const ninja = prefs.ninja ?? "default"
  if (side === "start")
    return (
      <NinjaSetting
        value={ninja}
        onChange={(ninja) => onPrefs({ ninja })}
        t={t}
      />
    )
  return (
    <>
      <SettingMenu
        label={t.textSize}
        icon={<TypeIcon />}
        value={prefs.textSize}
        valueLabel={t.sizesShort[prefs.textSize]}
        defaultValue="sm"
        defaultLabel={t.defaultOption}
        options={(["sm", "md", "lg"] as const).map((id) => ({
          id,
          label: t.sizes[id],
        }))}
        onChange={(textSize) => onPrefs({ textSize })}
        size="lg"
        className={TRAY_BUTTON}
      />
      {SHOW_SOUND ? (
        <Button
          variant="ghost"
          size="lg"
          className={TRAY_BUTTON}
          aria-label={`${t.sound}: ${sound === "on" ? t.sound : t.muted}`}
          onPress={() => onPrefs({ sound: sound === "on" ? "off" : "on" })}
        >
          {sound === "on" ? <Volume2Icon /> : <VolumeXIcon />}
          <span className="max-sm:sr-only">
            {sound === "on" ? t.sound : t.muted}
          </span>
        </Button>
      ) : null}
    </>
  )
}

/** The ninja's character: a slider with four stops, from hidden to unhinged, with him previewing each and a line on what to expect. */
function NinjaSetting({
  value,
  onChange,
  t,
}: {
  value: NinjaLevel
  onChange: (level: NinjaLevel) => void
  t: Strings
}) {
  const index = NINJA_LEVELS.indexOf(value)
  return (
    <PopoverTrigger>
      <Button
        variant="ghost"
        size="lg"
        className={TRAY_BUTTON}
        aria-label={`${t.ninja}: ${t.ninjaLevels[value]}`}
      >
        <Ninja mood={value === "off" ? "closed" : "idle"} />
        <span className="max-sm:sr-only">{t.ninjaLevels[value]}</span>
      </Button>
      <Popover placement="top start" className="w-64 gap-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium">{t.ninja}</span>
          {/* Announced on change, since the slider itself only says the stop's number. */}
          <span aria-live="polite" className="text-muted-foreground">
            {t.ninjaLevels[value]}
          </span>
        </div>
        {/* What each character is like, so the names don't have to explain themselves. */}
        <p className="text-sm text-muted-foreground">{t.ninjaHints[value]}</p>
        <div className="flex items-center gap-4">
          <Ninja
            mood={NINJA_PREVIEW[value]}
            className={cn(
              "size-10 shrink-0 transition-opacity",
              value === "off" && "opacity-30"
            )}
          />
          <Slider
            aria-label={t.ninja}
            minValue={0}
            maxValue={NINJA_LEVELS.length - 1}
            step={1}
            ticks
            value={index}
            onChange={(v) => {
              const next = NINJA_LEVELS[Array.isArray(v) ? v[0]! : v]
              if (next && next !== value) onChange(next)
            }}
          />
        </div>
      </Popover>
    </PopoverTrigger>
  )
}

function SettingMenu<K extends string>({
  label,
  icon,
  value,
  valueLabel,
  defaultValue,
  defaultLabel,
  options,
  onChange,
  placement = "top end",
  size = "sm",
  className,
}: {
  label: string
  icon: React.ReactNode
  value: K
  valueLabel: string
  /** The option used until the viewer picks one, marked with defaultLabel. */
  defaultValue?: K
  defaultLabel?: string
  options: { id: K; label: string; lang?: string }[]
  onChange: (value: K) => void
  /** Up from the tray, down from the header. */
  placement?: "top end" | "bottom end"
  size?: "sm" | "lg"
  className?: string
}) {
  return (
    <DropdownMenuTrigger>
      <Button
        variant="ghost"
        size={size}
        className={className}
        aria-label={`${label}: ${valueLabel}`}
      >
        {icon}
        <span className="max-sm:sr-only">{valueLabel}</span>
      </Button>
      <DropdownMenu
        placement={placement}
        // About nine rows; longer lists (languages) scroll inside.
        maxHeight={320}
        className="w-auto min-w-40"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[value]}
        onSelectionChange={(keys) => {
          if (keys === "all") return
          const [key] = keys
          if (key !== undefined) onChange(String(key) as K)
        }}
      >
        <DropdownMenuGroup aria-label={label}>
          {options.map((o) => (
            <DropdownMenuItem key={o.id} id={o.id} textValue={o.label}>
              <span>
                <span lang={o.lang}>{o.label}</span>
                {o.id === defaultValue ? (
                  <span className="text-muted-foreground"> {defaultLabel}</span>
                ) : null}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenu>
    </DropdownMenuTrigger>
  )
}

// ---------- Theory panel ----------

/** The concepts the learner has reached so far, to re-read during practice. */
export function TheoryPanel({
  id,
  concepts,
  onClose,
  t,
  textSize,
}: {
  id: string
  concepts: ConceptBrick[]
  onClose: () => void
  t: Strings
  textSize: TextSize
}) {
  return (
    <aside
      id={id}
      aria-label={t.theory}
      className="absolute inset-0 z-20 flex flex-col overflow-hidden border-y bg-background motion-safe:animate-in motion-safe:fade-in-0 sm:inset-x-8 sm:rounded-2xl sm:border lg:static lg:w-[360px] lg:shrink-0"
    >
      <div className="flex items-center justify-between gap-2 px-6 pt-6 pb-4">
        <h2 className="text-xl font-semibold">{t.theory}</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={t.closeTheory}
          onPress={onClose}
          className="lg:hidden"
        >
          <XIcon />
        </Button>
      </div>
      <div
        data-text-size={textSize}
        className="min-h-0 flex-1 overflow-y-auto px-6 pb-6"
      >
        {concepts.length ? (
          <ol className="flex flex-col gap-6">
            {concepts.map((c) => (
              <li key={c.id} className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <RichText text={c.body} className="block text-sm" />
                {c.term ? (
                  <dl className="mt-1 flex flex-col gap-1 border-s-2 border-primary ps-4">
                    <dt className="text-sm font-semibold">{c.term.word}</dt>
                    <dd className="text-sm text-muted-foreground">
                      <RichText text={c.term.definition} />
                    </dd>
                  </dl>
                ) : null}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">{t.theoryEmpty}</p>
        )}
      </div>
    </aside>
  )
}
