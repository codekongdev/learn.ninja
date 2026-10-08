// Builds app/favicon.ico from app/icon.svg, for browsers without SVG favicons. The renderer doesn't
// match prefers-color-scheme, so the .ico gets the SVG's fallback: the mark on a white disc. Run it
// after changing icon.svg.

import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const app = join(dirname(fileURLToPath(import.meta.url)), "../app")
const svg = readFileSync(join(app, "icon.svg"))
const sizes = [16, 32, 48, 256]

// Render well above 256px, then scale down, so the small sizes stay crisp.
const pngs = await Promise.all(
  sizes.map((size) =>
    sharp(svg, { density: 1200 }).resize(size, size).png().toBuffer()
  )
)

// An .ico is a 6-byte header, a 16-byte directory entry per image, then the images (PNGs are allowed).
const header = Buffer.alloc(6)
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(sizes.length, 4)

let offset = header.length + 16 * sizes.length
const entries = sizes.map((size, i) => {
  const entry = Buffer.alloc(16)
  entry[0] = entry[1] = size % 256 // 0 means 256
  entry.writeUInt16LE(1, 4) // color planes
  entry.writeUInt16LE(32, 6) // bits per pixel
  entry.writeUInt32LE(pngs[i].length, 8)
  entry.writeUInt32LE(offset, 12)
  offset += pngs[i].length
  return entry
})

writeFileSync(
  join(app, "favicon.ico"),
  Buffer.concat([header, ...entries, ...pngs])
)
console.log(`Wrote app/favicon.ico (${sizes.join(", ")}px, ${offset} bytes)`)
