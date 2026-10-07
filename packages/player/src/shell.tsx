"use client"

import * as React from "react"
import {
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

// ---------- viewer preferences (kept in this browser only) ----------

export interface Preferences {
  textSize: TextSize
  /** The viewer's chosen language for the player's own text. */
  uiLanguage?: string
}

const PREFERENCES_KEY = "learn:preferences"
const ROOT_FONT_SIZE: Record<TextSize, string> = {
  sm: "",
  md: "112.5%",
  lg: "125%",
}

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
  // Everything is sized in rem, so the root font size scales the whole lesson.
  React.useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = ROOT_FONT_SIZE[prefs.textSize]
    return () => {
      root.style.fontSize = ""
    }
  }, [prefs.textSize])
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
  progress,
  expiresAt,
  homeHref,
  shareUrl,
  onRestart,
  t,
}: {
  title: string
  progress: number
  expiresAt?: number
  homeHref: string
  shareUrl?: string
  onRestart: () => void
  t: Strings
}) {
  const hours = useHoursLeft(expiresAt)
  const [confirmRestart, setConfirmRestart] = React.useState(false)
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-4 sm:h-20 sm:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <LinkButton
          href={homeHref}
          variant="ghost"
          size="icon-xs"
          aria-label={t.home}
        >
          <SmileIcon />
        </LinkButton>
        <span aria-hidden="true" className="text-xs text-muted-foreground">
          /
        </span>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="xs" className="min-w-0 shrink gap-3">
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
      <div
        role="progressbar"
        aria-label={t.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="h-2 w-16 shrink-0 overflow-hidden rounded-full bg-muted sm:w-auto sm:max-w-[400px] sm:flex-1 sm:shrink"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-end sm:flex-1">
        <ShareButton title={title} url={shareUrl} t={t} />
      </div>
    </header>
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
      <Button size="xs" onPress={share} aria-label={label}>
        {copied ? <CheckIcon /> : <ShareIcon />}
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
    <footer className="flex h-14 shrink-0 items-center gap-2 px-4 pb-[env(safe-area-inset-bottom,0px)] sm:h-20 sm:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 text-sm font-medium">
        <span className="truncate">
          <span className="max-sm:hidden">© {new Date().getFullYear()} </span>
          {BRAND.name}
        </span>
        <span className="text-muted-foreground">{t.by}</span>
        <LinkButton
          size="xs"
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
      <Button
        variant="outline"
        size="xs"
        aria-label={`${label}: ${valueLabel}`}
      >
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
}: {
  id: string
  concepts: Concept[]
  onClose: () => void
  t: Strings
}) {
  return (
    <aside
      id={id}
      aria-label={t.theory}
      className="absolute inset-0 z-20 flex flex-col bg-background motion-safe:animate-in motion-safe:fade-in-0 lg:static lg:w-96 lg:shrink-0 lg:border-s"
    >
      <div className="flex items-center justify-between gap-2 px-6 pt-6 pb-3">
        <h2 className="text-sm font-semibold">{t.theory}</h2>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={t.closeTheory}
          onPress={onClose}
        >
          <XIcon />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        {concepts.length ? (
          <ol className="grid gap-3">
            {concepts.map((c) => (
              <li key={c.id} className="rounded-2xl border bg-card p-4">
                <h3 className="font-semibold">{c.title}</h3>
                <RichText
                  text={c.body}
                  className="mt-1 block text-[0.9375rem] text-muted-foreground"
                />
                {c.term ? (
                  <p className="mt-3 text-sm">
                    <strong className="font-semibold">{c.term.word}</strong>{" "}
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
