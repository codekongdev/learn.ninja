import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import {
  COUNTRIES,
  MAP_REGION_NAMES,
  NOT_ON_MAP,
  type MapVisual,
} from "@workspace/spec"

import WorldMap from "./map"
import data from "./map-data.json"

// The map's shapes and the checker's table of countries are built together by scripts/build-map.ts;
// they have to agree, or a code the checker accepts would shade nothing.

const draw = (map: Omit<MapVisual, "kind">) =>
  renderToStaticMarkup(
    createElement(WorldMap, { map: { kind: "map", ...map }, plain: false })
  )
const labels = (svg: string) =>
  [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1])

describe("map data", () => {
  it("has a shape for every country the checker accepts, and no other codes", () => {
    const ids = new Set(
      data.objects.countries.geometries.flatMap((g) =>
        "id" in g && g.id ? [g.id] : []
      )
    )
    expect([...ids].sort()).toEqual(Object.keys(COUNTRIES).sort())
    for (const code of Object.keys(NOT_ON_MAP))
      expect(ids.has(code)).toBe(false)
  })
})

describe("WorldMap", () => {
  it("draws every region", () => {
    for (const region of MAP_REGION_NAMES) {
      const svg = draw({ region, alt: region, countries: [{ code: "FR" }] })
      expect(svg).toMatch(/viewBox="0 0 480 \d+"/)
    }
  })

  it("shades each country and names it", () => {
    const svg = draw({
      region: "europe",
      alt: "France and Germany.",
      countries: [
        { code: "FR", label: "France" },
        { code: "DE", label: "Germany" },
      ],
    })
    expect(svg.match(/class="fill-chart-2\/70"/g)).toHaveLength(2)
    expect(labels(svg)).toEqual(["France", "Germany"])
  })

  it("puts places first, and rings a country too small to see", () => {
    const svg = draw({
      alt: "Singapore and Sydney.",
      countries: [{ code: "SG", label: "Singapore" }],
      points: [{ lat: -33.87, lon: 151.21, label: "Sydney" }],
    })
    expect(labels(svg)).toEqual(["Sydney", "Singapore"])
    expect(svg).toMatch(/<circle[^>]*fill="none"[^>]*class="stroke-chart-2"/)
  })

  it("colors each group and names it in a legend", () => {
    const svg = draw({
      alt: "Allies and Axis.",
      countries: [
        { code: "US", group: "Allies" },
        { code: "DE", group: "Axis" },
      ],
    })
    expect(svg).toContain('class="fill-chart-2/70"')
    expect(svg).toContain('class="fill-foreground/40"')
    expect(svg).toMatch(/<li[^>]*>.*Allies<\/li><li[^>]*>.*Axis<\/li>/)
  })
})
