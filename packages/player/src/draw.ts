import "server-only"

import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import type {
  ChartVisual,
  ChessVisual,
  MapVisual,
  MoleculeVisual,
} from "@workspace/spec"

import { renderChart } from "./chart"
import ChessBoard from "./chess"
import WorldMap from "./map"
import { renderMolecule } from "./molecule"

// Server-only: draws one visual as a still, the SVG the player would show for it, for a picture
// of a visual outside a lesson (the home page's bento of subjects). Charts and molecules are
// drawn the way prepareLesson draws them; a board and a map are the player's own components
// rendered once, with no tap targets.

export type DrawableVisual =
  | ChartVisual
  | ChessVisual
  | MapVisual
  | MoleculeVisual

/** The visual's SVG markup, in theme tokens, so one drawing serves light and dark. */
export function drawVisual(visual: DrawableVisual): string {
  switch (visual.kind) {
    case "chart":
      return renderChart(visual, false)
    case "molecule":
      return renderMolecule(visual)
    case "chess":
      return renderToStaticMarkup(
        createElement(ChessBoard, { board: visual, plain: true })
      )
    case "map":
      return renderToStaticMarkup(
        createElement(WorldMap, { map: visual, plain: true })
      )
  }
}
