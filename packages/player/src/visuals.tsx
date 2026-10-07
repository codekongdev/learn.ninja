"use client"

import * as React from "react"

import type { Visual as VisualSpec } from "@workspace/spec"
import { Selectable } from "@workspace/ui/components/selectable"
import { cn } from "@workspace/ui/lib/utils"

import type { Mark } from "./check"
import { useIsDark, usePlayer } from "./context"
import { codeKey, mathKey, type CodeLines } from "./prepared"

/** Hotspot wiring for interactive visuals: which regions are selected or marked, and what a tap does. */
export interface HotspotControl {
  selected: string[]
  marks: Record<string, Mark>
  onToggle: (id: string) => void
  disabled: boolean
}

export function Visual({
  visual,
  hotspots,
  label,
}: {
  visual: VisualSpec
  hotspots?: HotspotControl
  label?: string
}) {
  if (visual.kind === "html")
    return (
      <HtmlFrame
        html={visual.html}
        css={visual.css}
        height={visual.height}
        hotspots={hotspots}
        label={label}
      />
    )
  if (visual.kind === "code")
    return (
      <CodeBlock
        code={visual.code}
        language={visual.language}
        highlight={visual.highlight}
        spots={visual.hotspots}
        hotspots={hotspots}
      />
    )
  return <MathBlock tex={visual.tex} />
}

// ---------- HTML: a sandboxed iframe with no scripts ----------

function HtmlFrame({
  html,
  css,
  height,
  hotspots,
  label,
}: {
  html: string
  css?: string
  height?: number
  hotspots?: HotspotControl
  label?: string
}) {
  const { visualsCss, dir } = usePlayer()
  const dark = useIsDark()
  const ref = React.useRef<HTMLIFrameElement>(null)
  const [measured, setMeasured] = React.useState<number | null>(null)
  const [loaded, setLoaded] = React.useState(0)
  const hotspotsRef = React.useRef(hotspots)
  hotspotsRef.current = hotspots

  // The document is fixed per lesson visual; theme and direction are applied after load without reloading.
  const srcDoc = React.useMemo(
    () =>
      // Without an explicit height the body keeps its natural size, so the player can measure it.
      `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${visualsCss}"><style>html,body{background:transparent}body{margin:0;padding:16px;display:flex;justify-content:center;align-items:center;box-sizing:border-box${height ? ";min-height:100vh" : ""}}${css ?? ""}</style></head><body>${html}</body></html>`,
    [html, css, visualsCss, height]
  )

  // Size the frame to its content. allow-same-origin (without allow-scripts) lets the player measure it.
  React.useEffect(() => {
    const doc = ref.current?.contentDocument
    if (!doc?.body || height) return
    const measure = () =>
      setMeasured(Math.ceil(doc.body.getBoundingClientRect().height))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(doc.body)
    return () => observer.disconnect()
  }, [loaded, height])

  React.useEffect(() => {
    const doc = ref.current?.contentDocument
    if (!doc) return
    doc.documentElement.classList.toggle("dark", dark)
    doc.documentElement.dir = dir
  }, [loaded, dark, dir])

  // Hotspots: the player attaches the taps from outside the sandbox.
  React.useEffect(() => {
    const doc = ref.current?.contentDocument
    if (!doc || !hotspotsRef.current) return
    const targets = [...doc.querySelectorAll<HTMLElement>("[data-hotspot]")]
    const cleanups = targets.map((el) => {
      const id = el.dataset.hotspot!
      el.tabIndex = 0
      el.setAttribute("role", "button")
      const toggle = (e: Event) => {
        e.preventDefault()
        const h = hotspotsRef.current
        if (h && !h.disabled) h.onToggle(id)
      }
      const key = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") toggle(e)
      }
      el.addEventListener("click", toggle)
      el.addEventListener("keydown", key)
      return () => {
        el.removeEventListener("click", toggle)
        el.removeEventListener("keydown", key)
      }
    })
    return () => cleanups.forEach((c) => c())
  }, [loaded])

  React.useEffect(() => {
    const doc = ref.current?.contentDocument
    if (!doc || !hotspots) return
    for (const el of doc.querySelectorAll<HTMLElement>("[data-hotspot]")) {
      const id = el.dataset.hotspot!
      const mark = hotspots.marks[id]
      el.setAttribute("aria-pressed", String(hotspots.selected.includes(id)))
      el.classList.toggle("hs-on", hotspots.selected.includes(id) && !mark)
      el.classList.toggle("hs-good", mark === "correct")
      el.classList.toggle("hs-bad", mark === "wrong")
      el.classList.toggle("hs-locked", hotspots.disabled)
    }
  }, [loaded, hotspots])

  const interactive = Boolean(hotspots)
  return (
    <div
      className="visual-stage overflow-hidden rounded-2xl border bg-muted/40 bg-[radial-gradient(var(--border)_1px,transparent_1.2px)] [background-size:16px_16px]"
      inert={!interactive}
    >
      <iframe
        ref={ref}
        title={label ?? "Example"}
        sandbox="allow-same-origin"
        srcDoc={srcDoc}
        onLoad={() => setLoaded((n) => n + 1)}
        tabIndex={interactive ? 0 : -1}
        className={cn(
          "block w-full border-0",
          !interactive && "pointer-events-none"
        )}
        style={{ height: height ?? measured ?? 120 }}
      />
    </div>
  )
}

// ---------- code: highlighted on the server, lines tappable for code hotspots ----------

function CodeBlock({
  code,
  language,
  highlight,
  spots,
  hotspots,
}: {
  code: string
  language: string
  highlight?: number[]
  spots?: { id: string; line: number }[]
  hotspots?: HotspotControl
}) {
  const { prepared } = usePlayer()
  const lines: CodeLines =
    prepared.code[codeKey(language, code)] ??
    code.split("\n").map((l) => [{ content: l }])
  const spotByLine = new Map((spots ?? []).map((s) => [s.line, s.id]))

  return (
    <div
      dir="ltr"
      className="overflow-x-auto rounded-2xl border bg-muted/40 text-start"
    >
      <pre className="m-0 flex min-w-max flex-col py-3 font-mono text-[14.5px] leading-7">
        {lines.map((tokens, i) => {
          const n = i + 1
          const id = hotspots ? spotByLine.get(n) : undefined
          const body = (
            <>
              <span
                aria-hidden="true"
                className="w-6 shrink-0 text-end text-muted-foreground/70 select-none"
              >
                {n}
              </span>
              <span className="whitespace-pre">
                {tokens.length === 0 ||
                (tokens.length === 1 && tokens[0]!.content === "")
                  ? " "
                  : tokens.map((t, j) => (
                      <span
                        key={j}
                        className="shiki-token"
                        style={t.style as React.CSSProperties}
                      >
                        {t.content}
                      </span>
                    ))}
              </span>
            </>
          )
          const lineClass = cn(
            "flex gap-4 border-s-[3px] border-transparent px-4",
            highlight?.includes(n) && "bg-primary/5"
          )
          if (!id || !hotspots)
            return (
              <span key={n} className={lineClass}>
                {body}
              </span>
            )
          const mark = hotspots.marks[id]
          return (
            <Selectable
              key={n}
              aria-label={`Line ${n}`}
              isSelected={hotspots.selected.includes(id)}
              onChange={() => hotspots.onToggle(id)}
              isDisabled={hotspots.disabled}
              data-status={mark}
              className={cn(
                lineClass,
                "w-full cursor-pointer text-start hover:bg-primary/5 data-selected:border-primary data-selected:bg-primary/10",
                "data-[status=correct]:border-green-600 data-[status=correct]:bg-green-600/10 data-[status=wrong]:border-red-600 data-[status=wrong]:bg-red-600/10"
              )}
            >
              {body}
            </Selectable>
          )
        })}
      </pre>
    </div>
  )
}

// ---------- math: rendered by KaTeX on the server ----------

function MathBlock({ tex }: { tex: string }) {
  const { prepared } = usePlayer()
  const html = prepared.math[mathKey(tex, true)]
  return (
    <div
      dir="ltr"
      className="flex justify-center overflow-x-auto rounded-2xl border bg-muted/40 px-4 py-5 text-lg"
    >
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <code>{tex}</code>
      )}
    </div>
  )
}
