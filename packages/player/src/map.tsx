import * as React from "react"
import {
  geoAzimuthalEqualArea,
  geoNaturalEarth1,
  geoPath,
  type GeoPath,
  type GeoPermissibleObjects,
} from "d3-geo"
import type { Feature, MultiPolygon, Polygon } from "geojson"
import { feature, mesh } from "topojson-client"
import type { GeometryCollection, Topology } from "topojson-specification"

import {
  COUNTRIES,
  MAP_REGIONS,
  type MapRegion,
  type MapVisual,
} from "@workspace/spec"
import { cn } from "@workspace/ui/lib/utils"

import { usePlayer } from "./context"
import data from "./map-data.json"

// A world or regional map drawn as SVG in the browser from Natural Earth's countries (public
// domain, simplified by scripts/build-map.ts): land, borders, shaded countries, and marked places.
// visuals.tsx loads this module only for a lesson that has a map, since the shapes are most of its
// size. It's drawn in theme tokens: land a faint wash of the text color, borders in the page color,
// shaded countries in the accent, so one drawing serves light and dark.

const topology = data as unknown as Topology<{ countries: GeometryCollection }>
const countries = feature(topology, topology.objects.countries)
  .features as Feature<Polygon | MultiPolygon>[]
const borders = mesh(topology, topology.objects.countries, (a, b) => a !== b)
const land = { type: "FeatureCollection" as const, features: countries }

/** The drawing's width; its height follows the region. Text is sized against the shown width. */
const WIDTH = 480
/** Text, dots, and rings in px as shown, whatever the map's width. */
const TEXT = 12
const DOT = 4
const RING = 7
/** A shaded country smaller than this (in px across) gets a ring, so it can be found. */
const TINY = 10

/**
 * Shaded countries take the accent; with groups, each group a color of its own, in order: the
 * accent, a neutral grey, then the far end of the blues from the page (deep in light, pale in dark).
 */
const GROUPS = [
  {
    fill: "fill-chart-2/70",
    stroke: "stroke-chart-2",
    swatch: "bg-chart-2/70",
  },
  {
    fill: "fill-foreground/40",
    stroke: "stroke-foreground/60",
    swatch: "bg-foreground/40",
  },
  {
    fill: "fill-chart-5 dark:fill-chart-1",
    stroke: "stroke-chart-5 dark:stroke-chart-1",
    swatch: "bg-chart-5 dark:bg-chart-1",
  },
]

/** A region's projection, fitted to its box, and the drawing's height. Made once per region. */
const frames = new Map<MapRegion, { path: GeoPath; height: number }>()
function frameFor(region: MapRegion) {
  const known = frames.get(region)
  if (known) return known
  const [w, s, e, n] = MAP_REGIONS[region]
  const east = e < w ? e + 360 : e
  // The box's edges as points every degree or so, so the fit follows the parallels, not chords.
  const outline: GeoPermissibleObjects = {
    type: "MultiPoint",
    coordinates: [
      ...steps(w, east).flatMap((lon) => [
        [lon, s],
        [lon, n],
      ]),
      ...steps(s, n).flatMap((lat) => [
        [w, lat],
        [east, lat],
      ]),
    ],
  }
  // The world in the Natural Earth projection; a region in an equal-area view from above its middle,
  // which keeps far-north and far-south countries their true size, with only the near side drawn.
  const projection =
    region === "world"
      ? geoNaturalEarth1()
      : geoAzimuthalEqualArea()
          .rotate([-(w + east) / 2, -(s + n) / 2])
          .clipAngle(90)
  projection.fitWidth(WIDTH, outline)
  const height = Math.round(geoPath(projection).bounds(outline)[1][1])
  projection.clipExtent([
    [0, 0],
    [WIDTH, height],
  ])
  const frame = { path: geoPath(projection), height }
  frames.set(region, frame)
  return frame
}

const steps = (from: number, to: number) => {
  const n = Math.max(2, Math.ceil(to - from))
  return Array.from({ length: n + 1 }, (_, i) => from + ((to - from) * i) / n)
}

export default function WorldMap({
  map,
  plain,
}: {
  map: MapVisual
  /** On an option or item card: shorter, to fit the card. */
  plain: boolean
}) {
  const { dir } = usePlayer()
  const ref = React.useRef<SVGSVGElement>(null)
  const region = map.region ?? "world"
  const { path, height } = frameFor(region)
  // Drawn size over shown size, measured in the browser, so text stays one size on any screen. A
  // tall region (Africa, South America) is held to a height and centered, so it can be the limit.
  const [k, setK] = React.useState(1)
  React.useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const measure = () => {
      const { width: w, height: h } = svg.getBoundingClientRect()
      if (w && h) setK(Math.max(WIDTH / w, height / h))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(svg)
    return () => observer.disconnect()
  }, [height])
  const projection = path.projection() as (
    p: [number, number]
  ) => [number, number] | null
  const groups = [
    ...new Set((map.countries ?? []).flatMap((c) => c.group ?? [])),
  ]
  const shaded = (map.countries ?? []).map((c) => {
    const shapes = countries.filter((f) => f.id === c.code)
    const color = GROUPS[c.group ? groups.indexOf(c.group) : 0]!
    const [[x0, y0], [x1, y1]] = path.bounds({
      type: "FeatureCollection",
      features: shapes,
    })
    const anchor = projection(COUNTRIES[c.code]?.at ?? [0, 0])
    const tiny = !(x1 - x0 >= TINY * k || y1 - y0 >= TINY * k)
    return {
      ...c,
      shapes,
      color,
      tiny,
      anchor,
      at: labelAt(shapes, anchor, path, height),
    }
  })

  const dots = (map.points ?? []).flatMap((p) => {
    const at = projection([p.lon, p.lat])
    return at ? [{ ...p, x: at[0], y: at[1] }] : []
  })
  const labels = placeLabels(
    [
      ...dots.flatMap((d) =>
        d.label
          ? [
              {
                text: d.label,
                x: d.x,
                y: d.y,
                half: [DOT * k, DOT * k] as const,
                onTop: false,
                place: true,
              },
            ]
          : []
      ),
      ...shaded.flatMap((c) => {
        const ring = c.tiny ? c.anchor : null
        const at = c.at
        if (!c.label || !(ring || at)) return []
        const [x, y] = ring ?? [at!.x, at!.y]
        // A name sits on its country when it about fits (running a little past its edges is fine);
        // else beside it, or beside its ring.
        const half = ring
          ? ([RING * k, RING * k] as const)
          : ([at!.width / 2, at!.height / 2] as const)
        const onTop =
          !ring &&
          textWidth(c.label, k) < at!.width * 1.4 &&
          TEXT * k < at!.height
        return [{ text: c.label, x, y, half, onTop, place: false }]
      }),
    ],
    dots,
    k,
    height
  )
  const text = {
    fontSize: TEXT * k,
    strokeWidth: 3 * k,
    strokeLinejoin: "round",
    paintOrder: "stroke",
    className: "fill-foreground stroke-background font-medium",
    style: { fontFamily: "inherit" },
  } as const

  return (
    <>
      <svg
        ref={ref}
        viewBox={`0 0 ${WIDTH} ${height}`}
        className={cn("block h-auto w-full", plain ? "max-h-44" : "max-h-112")}
        aria-hidden
      >
        <path
          d={path(land) ?? ""}
          className="fill-foreground/8 dark:fill-foreground/12"
        />
        {shaded.map((c) => (
          <path
            key={c.code}
            d={path({ type: "FeatureCollection", features: c.shapes }) ?? ""}
            className={c.color.fill}
          />
        ))}
        <path
          d={path(borders) ?? ""}
          fill="none"
          strokeWidth={1}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="stroke-background"
        />
        {shaded.map(
          (c) =>
            c.tiny &&
            c.anchor && (
              <circle
                key={c.code}
                cx={c.anchor[0]}
                cy={c.anchor[1]}
                r={RING * k}
                fill="none"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
                className={c.color.stroke}
              />
            )
        )}
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={DOT * k}
            strokeWidth={1.5 * k}
            className="fill-foreground stroke-background"
          />
        ))}
        {labels.map((l, i) => (
          <text
            key={i}
            {...text}
            x={l.x}
            y={l.y}
            textAnchor={l.anchor}
            dominantBaseline="central"
          >
            {l.text}
          </text>
        ))}
      </svg>
      {groups.length > 0 && (
        <ul
          dir={dir}
          className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground"
        >
          {groups.map((g, i) => (
            <li key={g} className="flex items-center gap-1.5">
              <span className={`size-3 rounded-sm ${GROUPS[i]!.swatch}`} />
              {g}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

type Anchor = "start" | "middle" | "end"

/** About the width of a name in medium text: close enough to keep names apart. */
const textWidth = (text: string, k: number) => text.length * TEXT * 0.6 * k

/**
 * Places names so they don't cover each other or a dot. A place's name goes after its dot, else
 * before it, above, or below; a country's on it when it fits, else below, above, or beside it.
 * Places go first, since their dots pin them down. A name that fits nowhere takes its first spot.
 */
function placeLabels(
  labels: {
    text: string
    x: number
    y: number
    /** Half the width and height of what the name labels: a dot, a ring, or a country. */
    half: readonly [number, number]
    /** Whether the name can sit on top of it, as on a country it fits inside. */
    onTop: boolean
    place: boolean
  }[],
  dots: { x: number; y: number }[],
  k: number,
  height: number
): { text: string; x: number; y: number; anchor: Anchor }[] {
  const h = TEXT * 1.2 * k
  const gap = 3 * k
  type Box = [number, number, number, number]
  const taken: Box[] = dots.map(({ x, y }) => [
    x - DOT * k,
    y - DOT * k,
    x + DOT * k,
    y + DOT * k,
  ])
  const overlaps = (a: Box, b: Box) =>
    a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]
  return labels.map(({ text, x, y, half: [hx, hy], onTop, place }) => {
    const w = textWidth(text, k)
    const side: { x: number; y: number; anchor: Anchor }[] = [
      { x: x + hx + gap, y, anchor: "start" },
      { x: x - hx - gap, y, anchor: "end" },
    ]
    const under: { x: number; y: number; anchor: Anchor }[] = [
      { x, y: y + hy + gap + h / 2, anchor: "middle" },
      { x, y: y - hy - gap - h / 2, anchor: "middle" },
    ]
    const spots = [
      ...(onTop ? [{ x, y, anchor: "middle" as const }] : []),
      ...(place ? [...side, ...under] : [...under, ...side]),
    ]
    const boxOf = (s: (typeof spots)[number]): Box => {
      const x0 =
        s.anchor === "start" ? s.x : s.anchor === "end" ? s.x - w : s.x - w / 2
      return [x0, s.y - h / 2, x0 + w, s.y + h / 2]
    }
    const inside = (b: Box) =>
      b[0] >= 0 && b[1] >= 0 && b[2] <= WIDTH && b[3] <= height
    const spot =
      spots.find((s) => {
        const b = boxOf(s)
        return inside(b) && !taken.some((t) => overlaps(b, t))
      }) ??
      spots.find((s) => inside(boxOf(s))) ??
      spots[0]!
    taken.push(boxOf(spot))
    return { text, ...spot }
  })
}

/**
 * Where a country's name goes, and the size of the piece it names: its anchor (the middle of its
 * largest piece) when that's on the map, else the middle of its largest piece that is, as for
 * Russia on a map of Europe.
 */
function labelAt(
  shapes: Feature<Polygon | MultiPolygon>[],
  anchor: [number, number] | null,
  path: GeoPath,
  height: number
): { x: number; y: number; width: number; height: number } | null {
  const pieces = shapes.flatMap((f) =>
    f.geometry.type === "MultiPolygon"
      ? f.geometry.coordinates.map(
          (coordinates) => ({ type: "Polygon", coordinates }) as Polygon
        )
      : [f.geometry]
  )
  const largest = pieces
    .map((p) => ({ p, area: path.area(p) }))
    .sort((a, b) => b.area - a.area)[0]
  if (!largest?.area) return null
  const [[x0, y0], [x1, y1]] = path.bounds(largest.p)
  const size = { width: x1 - x0, height: y1 - y0 }
  const margin = 12
  if (
    anchor &&
    anchor[0] > margin &&
    anchor[0] < WIDTH - margin &&
    anchor[1] > margin &&
    anchor[1] < height - margin
  )
    return { x: anchor[0], y: anchor[1], ...size }
  const [x, y] = path.centroid(largest.p)
  return { x, y, ...size }
}
