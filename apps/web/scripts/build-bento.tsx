// Draws the home page bento's lesson visuals (lib/bento-visuals.ts) with the player's own
// renderers and writes them to components/home/bento-visuals.generated.json, so the home page
// shows the real thing without shipping the map data, the chess pieces, or the chemistry library.
// Run it after changing the visuals: `npm run bento -w web` (a test fails while the file is stale).

import { writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { drawVisual } from "@workspace/player/draw"

import { BENTO_VISUALS } from "../lib/bento-visuals"

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../components/home/bento-visuals.generated.json"
)
const drawn = Object.fromEntries(
  Object.entries(BENTO_VISUALS).map(([name, visual]) => [
    name,
    drawVisual(visual),
  ])
)
writeFileSync(out, JSON.stringify(drawn, null, 2) + "\n")
console.log(
  `Wrote ${Object.keys(drawn).length} visuals to components/home/bento-visuals.generated.json`
)
