// Renders the site's share card (lib/og.tsx) into the files that get uploaded by hand: GitHub's
// social preview, the X profile banner, and a square for posts. Writes to brand/ at the repo root.
// Run it after changing the card: `npm run share -w web`.

import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { siteImage } from "../lib/og"

const out = join(dirname(fileURLToPath(import.meta.url)), "../../../brand")

const FILES = [
  { name: "github-social-preview.png", width: 1280, height: 640 },
  { name: "x-banner.png", width: 1500, height: 500 },
  { name: "square.png", width: 1080, height: 1080 },
]

mkdirSync(out, { recursive: true })
for (const { name, width, height } of FILES) {
  const response = await siteImage({ width, height })
  const png = Buffer.from(await response.arrayBuffer())
  writeFileSync(join(out, name), png)
  console.log(`Wrote brand/${name} (${width}×${height}, ${png.length} bytes)`)
}
