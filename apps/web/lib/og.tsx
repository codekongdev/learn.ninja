import { ImageResponse } from "next/og"

import { plainText, stringsFor, type Strings } from "@workspace/player"
import type { Lesson } from "@workspace/spec"

import { getLesson } from "./lessons"
import { INSTALL_COMMAND, SITE } from "./site"

// Link preview images (Open Graph), drawn with next/og: the site's card, one per lesson, and one for
// expired links. They mirror the player: a bordered window showing the lesson's first question.

export const OG_SIZE = { width: 1200, height: 630 }

// The dark theme's tokens, as fixed colors (next/og can't read CSS variables).
const C = {
  page: "#151515",
  window: "#1f1f1f",
  card: "#262626",
  border: "#2e2e33",
  borderStrong: "#3f3f46",
  foreground: "#fafafa",
  body: "#d4d4d8",
  muted: "#a1a1aa",
  faint: "#52525b",
  primary: "#fafafa",
}

// ---------- fonts ----------

// Inter, the site's font, fetched from Google Fonts as TTF (the only format next/og reads) and kept for
// the life of the process. If the fetch fails, next/og falls back to its bundled font.
const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600"
/** An old browser, so Google serves TTF instead of woff2. */
const TTF_USER_AGENT =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1"

type Weight = 400 | 500 | 600
type Font = { name: string; data: ArrayBuffer; weight: Weight; style: "normal" }

let fonts: Promise<Font[]> | undefined

function loadFonts(): Promise<Font[]> {
  fonts ??= (async () => {
    try {
      const css = await fetch(FONT_CSS, {
        headers: { "user-agent": TTF_USER_AGENT },
      }).then((r) => r.text())
      const faces = [
        ...css.matchAll(/font-weight:\s*(400|500|600);[^}]*?url\(([^)]+)\)/g),
      ]
      return await Promise.all(
        faces.map(async ([, weight, url]) => ({
          name: "Inter",
          data: await fetch(url!).then((r) => r.arrayBuffer()),
          weight: Number(weight) as Weight,
          style: "normal" as const,
        }))
      )
    } catch {
      return []
    }
  })()
  return fonts
}

async function respond(element: React.ReactElement) {
  const loaded = await loadFonts()
  return new ImageResponse(element, {
    ...OG_SIZE,
    fonts: loaded.length ? loaded : undefined,
  })
}

// ---------- pieces ----------

const row = { display: "flex", alignItems: "center" } as const
const column = { display: "flex", flexDirection: "column" } as const

function Mark({
  size,
  color = C.foreground,
}: {
  size: number
  color?: string
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <g stroke={color} strokeWidth="5" strokeLinejoin="round">
        <path d="M7.01 24.83A26 26 0 0 1 56.99 24.83Q32 15.17 7.01 24.83Z" />
        <path d="M56.99 39.17Q32 48.83 7.01 39.17A26 26 0 0 0 56.99 39.17Z" />
      </g>
      <ellipse cx="25" cy="32" rx="2.9" ry="4.6" fill={color} />
      <ellipse cx="39" cy="32" rx="2.9" ry="4.6" fill={color} />
    </svg>
  )
}

/** The page: the dark stage, with the content padded in. */
function Page({
  children,
  dir = "ltr",
}: {
  children: React.ReactNode
  dir?: "ltr" | "rtl"
}) {
  return (
    <div
      style={{
        ...column,
        width: "100%",
        height: "100%",
        padding: "48px 64px",
        background: C.page,
        color: C.foreground,
        fontFamily: "Inter",
        direction: dir,
      }}
    >
      {children}
    </div>
  )
}

function Header({ end }: { end?: string }) {
  return (
    <div style={{ ...row, justifyContent: "space-between" }}>
      <div style={{ ...row, gap: 12 }}>
        <Mark size={34} />
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: -0.5,
          }}
        >
          {SITE.name}
        </div>
      </div>
      {end ? (
        <div style={{ display: "flex", fontSize: 22, color: C.muted }}>
          {end}
        </div>
      ) : null}
    </div>
  )
}

function Pill({ children }: { children: string }) {
  return (
    <div
      style={{
        display: "flex",
        padding: "8px 16px",
        borderRadius: 999,
        border: `1.5px solid ${C.borderStrong}`,
        background: C.card,
        fontSize: 20,
        fontWeight: 500,
        color: C.body,
      }}
    >
      {children}
    </div>
  )
}

/** The player's progress bar: four parts, the first under way. */
function Progress() {
  return (
    <div style={{ ...row, gap: 6 }}>
      <div
        style={{
          display: "flex",
          width: 150,
          height: 8,
          borderRadius: 999,
          background: C.border,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 40,
            height: 8,
            borderRadius: 999,
            background: C.primary,
          }}
        />
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            display: "flex",
            width: 8,
            height: 8,
            borderRadius: 999,
            background: C.border,
          }}
        />
      ))}
    </div>
  )
}

/** A lesson's first question, as the player shows it: a bordered window with option rows. */
function Window({
  prompt,
  options,
  t,
}: {
  prompt: string
  options: string[]
  t: Strings
}) {
  return (
    <div
      style={{
        ...column,
        width: 440,
        padding: 28,
        gap: 22,
        borderRadius: 24,
        border: `1.5px solid ${C.borderStrong}`,
        background: C.window,
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
      }}
    >
      <Progress />
      <div
        style={{
          display: "flex",
          fontSize: 22,
          fontWeight: 600,
          lineHeight: 1.3,
          letterSpacing: -0.3,
          lineClamp: 2,
        }}
      >
        {prompt}
      </div>
      <div style={{ ...column, gap: 10 }}>
        {options.map((text, i) => (
          <div
            key={i}
            style={{
              ...row,
              justifyContent: "space-between",
              gap: 12,
              padding: "12px 14px",
              borderRadius: 10,
              border: `1.5px solid ${C.border}`,
              background: C.card,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 500,
                color: C.body,
                lineClamp: 1,
              }}
            >
              {text}
            </div>
            <div
              style={{
                ...row,
                justifyContent: "center",
                width: 24,
                height: 24,
                borderRadius: 6,
                border: `1px solid ${C.borderStrong}`,
                fontSize: 13,
                color: C.muted,
              }}
            >
              {i + 1}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignSelf: "flex-start",
          padding: "9px 16px",
          borderRadius: 8,
          background: C.primary,
          color: C.page,
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        {t.check}
      </div>
    </div>
  )
}

/** The hook's prompt and option texts, if it has text options to show. */
function peek(lesson: Lesson) {
  const options = lesson.hook.options
    .map((o) => (o.text ? plainText(o.text) : ""))
    .filter(Boolean)
    .slice(0, 3)
  return options.length >= 2
    ? { prompt: plainText(lesson.hook.prompt), options }
    : null
}

function Headline({
  title,
  text,
  size = 60,
}: {
  title: string
  text?: string
  size?: number
}) {
  return (
    <div style={{ ...column, gap: 20 }}>
      <div
        style={{
          display: "flex",
          fontSize: size,
          fontWeight: 600,
          lineHeight: 1.08,
          letterSpacing: -2,
          lineClamp: 3,
        }}
      >
        {title}
      </div>
      {text ? (
        <div
          style={{
            display: "flex",
            fontSize: 26,
            lineHeight: 1.4,
            color: C.muted,
            lineClamp: 3,
          }}
        >
          {text}
        </div>
      ) : null}
    </div>
  )
}

// ---------- cards ----------

/** The site's card: the tagline beside one of the example lessons. */
export function siteImage() {
  const t = stringsFor("en")
  const example = getLesson("compound-interest")
  const shown = example ? peek(example) : null
  return respond(
    <Page>
      <Header />
      <div style={{ ...row, flex: 1, gap: 56 }}>
        <div style={{ ...column, flex: 1, gap: 32 }}>
          <Headline title={SITE.tagline} size={64} />
          <div
            style={{
              ...row,
              alignSelf: "flex-start",
              gap: 12,
              padding: "12px 20px",
              borderRadius: 10,
              border: `1.5px solid ${C.borderStrong}`,
              background: C.card,
              fontSize: 22,
              color: C.body,
            }}
          >
            <span style={{ color: C.faint }}>$</span>
            {INSTALL_COMMAND}
          </div>
        </div>
        {shown ? <Window {...shown} t={t} /> : null}
      </div>
    </Page>
  )
}

/** A lesson's card: title and summary, with its first question in the player's window. */
export function lessonImage(lesson: Lesson) {
  const t = stringsFor(lesson.language)
  const dir = /^(ar|he|fa|ur)\b/i.test(lesson.language) ? "rtl" : "ltr"
  const shown = peek(lesson)
  const facts = [
    lesson.topic,
    t.minutes(lesson.estimatedMinutes),
    t.levels[lesson.level],
  ].filter(Boolean) as string[]
  return respond(
    <Page dir={dir}>
      <Header />
      <div style={{ ...row, flex: 1, gap: 56 }}>
        <div style={{ ...column, flex: 1, gap: 28 }}>
          <Headline title={lesson.title} text={lesson.summary} />
          <div style={{ ...row, gap: 10, flexWrap: "wrap" }}>
            {facts.map((f) => (
              <Pill key={f}>{f}</Pill>
            ))}
          </div>
        </div>
        {shown ? (
          <Window {...shown} t={t} />
        ) : (
          <Mark size={220} color={C.border} />
        )}
      </div>
    </Page>
  )
}

/** The card for a link whose lesson has expired. */
export function expiredImage() {
  return respond(
    <Page>
      <Header />
      <div style={{ ...row, flex: 1, gap: 56 }}>
        <div style={{ ...column, flex: 1 }}>
          <Headline
            title="This lesson has expired"
            text="Lessons last 24 hours. Ask for a fresh link."
          />
        </div>
        <Mark size={220} color={C.border} />
      </div>
    </Page>
  )
}
