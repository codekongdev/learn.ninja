import { describe, expect, it } from "vitest"

import { drawVisual } from "@workspace/player/draw"

import drawn from "../components/home/bento-visuals.generated.json"
import { BENTO_VISUALS, trim } from "./bento-visuals"

describe("the bento's visuals", () => {
  // Drawing the map and the board takes a few seconds while the rest of the suite runs beside it.
  it(
    "are drawn from the current definitions (else run `npm run bento -w web`)",
    { timeout: 30_000 },
    () => {
      for (const [name, visual] of Object.entries(BENTO_VISUALS))
        expect(drawn[name as keyof typeof drawn], name).toBe(
          trim(drawVisual(visual))
        )
    }
  )
})
