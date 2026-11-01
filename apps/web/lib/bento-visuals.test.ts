import { describe, expect, it } from "vitest"

import { drawVisual } from "@workspace/player/draw"

import drawn from "../components/home/bento-visuals.generated.json"
import { BENTO_VISUALS } from "./bento-visuals"

describe("the bento's visuals", () => {
  it("are drawn from the current definitions (else run `npm run bento -w web`)", () => {
    for (const [name, visual] of Object.entries(BENTO_VISUALS))
      expect(drawn[name as keyof typeof drawn], name).toBe(drawVisual(visual))
  })
})
