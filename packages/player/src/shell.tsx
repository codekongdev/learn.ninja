"use client"

import * as React from "react"
import {
  createLucideIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  GlobeIcon,
  MonitorIcon,
  MoonIcon,
  RotateCcwIcon,
  ShareIcon,
  SmileIcon,
  SunIcon,
  TypeIcon,
  XIcon,
} from "lucide-react"

import type { Concept } from "@workspace/spec"
import { Button, LinkButton } from "@workspace/ui/components/button"
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
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Progress } from "@workspace/ui/components/progress"
import { cn } from "@workspace/ui/lib/utils"

import type { PartProgress } from "./flow"
import { RichText } from "./rich-text"
import {
  UI_LANGUAGES,
  uiLanguageFor,
  type Strings,
  type TextSize,
  type Theme,
} from "./strings"

// The frame around every lesson screen: header (home, title menu, progress, Share), footer (credit and
// viewer settings), and the Theory panel. Layout follows the Figma frame "Learn" (node 2004:15459).

export const BRAND = {
  name: "Learn.ninja",
  maker: "@cmicpace",
  makerUrl: "https://x.com/cmicpace",
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
}

const PREFERENCES_KEY = "learn:preferences"

export function usePreferences() {
  const [prefs, setPrefs] = React.useState<Preferences>({ textSize: "sm" })
  React.useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(PREFERENCES_KEY) ?? "{}"
      ) as Partial<Preferences>
      setPrefs((p) => ({ ...p, ...saved }))
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
  expiresAt,
  homeHref,
  docsHref,
  createHref,
  shareUrl,
  onRestart,
  t,
}: {
  title: string
  parts: PartProgress
  expiresAt?: number
  homeHref: string
  docsHref?: string
  createHref?: string
  shareUrl?: string
  onRestart: () => void
  t: Strings
}) {
  const hours = useHoursLeft(expiresAt)
  const [confirmRestart, setConfirmRestart] = React.useState(false)
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-4 sm:h-16 sm:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <LinkButton
          href={homeHref}
          variant="ghost"
          size="icon-sm"
          aria-label={t.home}
        >
          <SmileIcon />
        </LinkButton>
        <span aria-hidden="true" className="text-xs text-muted-foreground">
          /
        </span>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="sm" className="min-w-0 shrink gap-3">
            <span className="truncate">{title}</span>
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
      <PartsProgress parts={parts} t={t} />
      <div className="flex items-center justify-end gap-2 sm:flex-1">
        {docsHref ? (
          <LinkButton
            href={docsHref}
            variant="ghost"
            size="sm"
            className="max-sm:hidden"
          >
            {t.docs}
          </LinkButton>
        ) : null}
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

/** One segment per part: finished parts and upcoming parts are short pills, the current part is a full bar. */
function PartsProgress({ parts, t }: { parts: PartProgress; t: Strings }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 sm:flex-1 sm:gap-2">
      {Array.from({ length: parts.count }, (_, i) =>
        i === parts.current ? (
          <Progress
            key={i}
            value={Math.round(parts.fraction * 100)}
            aria-label={t.progress}
            valueLabel={t.part(i + 1, parts.count)}
            className="w-16 min-w-0 shrink-0 transition-all duration-500 sm:w-auto sm:max-w-[400px] sm:flex-1 sm:shrink [&_[data-slot=progress-indicator]]:rounded-full [&_[data-slot=progress-track]]:h-3"
          />
        ) : (
          <span
            key={i}
            aria-hidden="true"
            className={cn(
              "h-3 w-3 shrink-0 rounded-full transition-colors duration-500 sm:w-[18px]",
              i < parts.current || parts.done ? "bg-primary" : "bg-muted"
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
  t,
  prefs,
  onPrefs,
  uiLanguage,
  theme,
  onThemeChange,
}: {
  t: Strings
  prefs: Preferences
  onPrefs: (patch: Partial<Preferences>) => void
  uiLanguage: string
  theme?: Theme
  onThemeChange?: (theme: Theme) => void
}) {
  const language = uiLanguageFor(uiLanguage) ?? UI_LANGUAGES[0]
  const ThemeIcon =
    theme === "dark" ? MoonIcon : theme === "light" ? SunIcon : MonitorIcon
  return (
    <footer className="flex h-14 shrink-0 items-center gap-2 px-4 pb-[env(safe-area-inset-bottom,0px)] sm:h-16 sm:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm font-medium">
        <span className="truncate">
          <span className="max-sm:hidden">© {new Date().getFullYear()} </span>
          {BRAND.name} {t.by}
        </span>
        <LinkButton
          variant="secondary"
          size="sm"
          href={BRAND.makerUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <bdi dir="ltr">{BRAND.maker}</bdi>
        </LinkButton>
      </div>
      <div className="flex items-center justify-end gap-2">
        <SettingMenu
          label={t.textSize}
          icon={<TypeIcon />}
          value={prefs.textSize}
          valueLabel={t.sizesShort[prefs.textSize]}
          options={(["sm", "md", "lg"] as const).map((id) => ({
            id,
            label: t.sizes[id],
          }))}
          onChange={(textSize) => onPrefs({ textSize })}
        />
        {onThemeChange ? (
          <SettingMenu
            label={t.theme}
            icon={<ThemeIcon />}
            value={theme ?? "system"}
            valueLabel={t.themes[theme ?? "system"]}
            options={(["system", "light", "dark"] as const).map((id) => ({
              id,
              label: t.themes[id],
            }))}
            onChange={onThemeChange}
          />
        ) : null}
        <SettingMenu
          label={t.language}
          icon={<GlobeIcon />}
          value={language.code}
          valueLabel={language.label}
          options={UI_LANGUAGES.map((l) => ({
            id: l.code,
            label: l.label,
            lang: l.code,
          }))}
          onChange={(code) => onPrefs({ uiLanguage: code })}
        />
      </div>
    </footer>
  )
}

function SettingMenu<K extends string>({
  label,
  icon,
  value,
  valueLabel,
  options,
  onChange,
}: {
  label: string
  icon: React.ReactNode
  value: K
  valueLabel: string
  options: { id: K; label: string; lang?: string }[]
  onChange: (value: K) => void
}) {
  return (
    <DropdownMenuTrigger>
      <Button variant="ghost" size="sm" aria-label={`${label}: ${valueLabel}`}>
        {icon}
        <span className="max-sm:sr-only">{valueLabel}</span>
      </Button>
      <DropdownMenu
        placement="top end"
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
        <DropdownMenuGroup>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          {options.map((o) => (
            <DropdownMenuItem key={o.id} id={o.id} textValue={o.label}>
              <span lang={o.lang}>{o.label}</span>
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
  concepts: Concept[]
  onClose: () => void
  t: Strings
  textSize: TextSize
}) {
  return (
    <aside
      id={id}
      aria-label={t.theory}
      className="absolute inset-0 z-20 flex flex-col overflow-hidden border-y bg-card motion-safe:animate-in motion-safe:fade-in-0 sm:inset-x-8 sm:rounded-xl sm:border-0 sm:shadow-xs sm:ring-1 sm:ring-foreground/10 lg:static lg:w-[360px] lg:shrink-0"
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
                  <p className="text-sm text-muted-foreground">
                    <strong className="font-semibold text-foreground">
                      {c.term.word}
                    </strong>{" "}
                    <RichText text={c.term.definition} />
                  </p>
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
