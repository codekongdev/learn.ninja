import "server-only"

import * as Plot from "@observablehq/plot"
import { parseHTML } from "linkedom"

import type { ChartVisual } from "@workspace/spec"

// Server-only: draws a lesson's chart visuals with Observable Plot into plain SVG, once per lesson,
// so the learner's browser loads no chart library and the frame runs no script. Colors are the
// theme's tokens, so one drawing serves light and dark.

/** One series takes the primary color; more take these, in order. */
const SERIES_COLORS = [
  "var(--primary)",
  "var(--chart-2)",
  "var(--muted-foreground)",
]
const TREND_COLOR = "var(--chart-2)"

// linkedom, not jsdom: jsdom crashed the publish routes on Vercel, and Plot only needs to build elements.
let doc: Document | null = null
const documentFor = () =>
  (doc ??= parseHTML("<!doctype html><html><body></body></html>")
    .document as unknown as Document)

/** The chart as an SVG string. `compact` is for option and item cards, which are narrower. */
export function renderChart(chart: ChartVisual, compact = false): string {
  const data = chart.data
  const series = [
    ...new Set(data.map((d) => d.series).filter(Boolean)),
  ] as string[]
  const byseries = series.length > 0
  const numericX = data.every((d) => typeof d.x === "number")
  const categories = [...new Set(data.map((d) => String(d.x)))]
  const color = {
    domain: series,
    range: SERIES_COLORS.slice(0, Math.max(1, series.length)),
  }
  const fill = byseries ? "series" : SERIES_COLORS[0]
  const marks: Plot.Markish[] = []
  const x: Plot.ScaleOptions = { label: chart.x?.label ?? null, nice: true }
  const y: Plot.ScaleOptions = {
    label: chart.y?.label ?? null,
    nice: true,
    grid: true,
  }

  if (chart.type === "scatter") {
    x.grid = true
    if (chart.trend)
      marks.push(
        Plot.linearRegressionY(data, {
          x: "x",
          y: "y",
          ci: 0,
          stroke: byseries ? "series" : TREND_COLOR,
        })
      )
    marks.push(Plot.dot(data, { x: "x", y: "y", r: compact ? 3.5 : 4.5, fill }))
    if (data.some((d) => d.label))
      marks.push(
        Plot.text(data, {
          x: "x",
          y: "y",
          text: "label",
          dy: compact ? -9 : -11,
          fill: "var(--muted-foreground)",
        })
      )
    // The legend: a swatch and name per series, in the top start corner.
    series.forEach((name, i) => {
      const dy = 6 + i * (compact ? 15 : 17)
      marks.push(
        Plot.dot([name], {
          frameAnchor: "top-left",
          dx: 10,
          dy,
          r: 4,
          fill: () => name,
        }),
        Plot.text([name], {
          frameAnchor: "top-left",
          dx: 20,
          dy,
          text: (d: string) => d,
          textAnchor: "start",
          fill: () => name,
        })
      )
    })
  } else {
    // Bars and lines keep the lesson's order: the months stay Jan to Dec, not alphabetical.
    if (chart.type === "bar" || !numericX) x.domain = categories
    if (chart.type === "bar") {
      x.nice = false
      marks.push(
        Plot.barY(data, { x: "x", y: "y", fill, rx: 3 }),
        Plot.ruleY([0])
      )
    } else {
      marks.push(
        Plot.lineY(data, { x: "x", y: "y", stroke: fill, strokeWidth: 2 })
      )
      if (data.length <= 24)
        marks.push(Plot.dot(data, { x: "x", y: "y", r: 3, fill }))
      // Each line is named at its end, where a legend would make the reader look away.
      if (byseries) {
        const ends = series.map((name) =>
          data.filter((d) => d.series === name).at(-1)!
        )
        marks.push(
          Plot.text(ends, {
            x: "x",
            y: "y",
            text: "series",
            dx: 8,
            textAnchor: "start",
            fill: "series",
          })
        )
      }
    }
  }

  const svg = Plot.plot({
    document: documentFor(),
    className: "chart",
    width: compact ? 320 : 480,
    height: compact ? 220 : 300,
    marginLeft: compact ? 40 : 48,
    marginBottom: compact ? 36 : 44,
    marginRight:
      chart.type === "line" && byseries
        ? compact
          ? 64
          : 80
        : compact
          ? 16
          : 20,
    style: {
      background: "transparent",
      color: "var(--muted-foreground)",
      fontFamily: "inherit",
      fontSize: compact ? "11px" : "12px",
      overflow: "visible",
    },
    x,
    y,
    color,
    marks,
  })
  return (svg as unknown as Element).outerHTML
}
