// Builds public/lesson-visuals.css: the stylesheet HTML lesson visuals load inside their sandbox.
// Basecoat (Maia style, to match the shadcn preset) + Tailwind utilities for exactly the classes the
// bundled lessons use + the app's own theme tokens, so visuals and the player look the same.
// This is the concept-phase version of the publish-time CSS step.

import { execFileSync } from "node:child_process"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const web = join(dirname(fileURLToPath(import.meta.url)), "..")
const globals = readFileSync(
  join(web, "../../packages/ui/src/styles/globals.css"),
  "utf8"
)

/** The full text of the first top-level block that starts with `selector {`. */
function block(selector) {
  const start = globals.indexOf(`${selector} {`)
  if (start === -1)
    throw new Error(`Couldn't find "${selector} {" in packages/ui globals.css`)
  let depth = 0
  for (let i = globals.indexOf("{", start); i < globals.length; i++) {
    if (globals[i] === "{") depth++
    if (globals[i] === "}" && --depth === 0) return globals.slice(start, i + 1)
  }
  throw new Error(`Unclosed "${selector}" block`)
}

const outDir = join(web, ".visuals")
mkdirSync(outDir, { recursive: true })
const examples = relative(outDir, join(web, "../../examples")).replaceAll(
  "\\",
  "/"
)

const input = `@import "tailwindcss" source(none);
@import "basecoat-css/maia";
@source "${examples}/**/*.json";

/* Theme tokens copied from packages/ui/src/styles/globals.css (they override Basecoat's defaults) */
${block("@theme inline")}
${block(":root")}
${block(".dark")}

html, body { background: transparent; color: var(--foreground); font-family: Inter, ui-sans-serif, system-ui, sans-serif; }

/* Hotspot regions: the player wires up the taps from outside the sandbox */
[data-hotspot] { cursor: pointer; outline: 2px dashed transparent; outline-offset: 4px; transition: outline-color 0.15s; }
[data-hotspot]:hover { outline-color: var(--ring); }
[data-hotspot]:focus-visible { outline: 2px solid var(--ring); }
[data-hotspot].hs-on { outline: 2.5px solid var(--primary); }
[data-hotspot].hs-good { outline: 2.5px solid #16a34a; }
[data-hotspot].hs-bad { outline: 2.5px solid #dc2626; }
[data-hotspot].hs-locked { cursor: default; }
`

const inputPath = join(outDir, "lesson-visuals.css")
writeFileSync(inputPath, input)
execFileSync(
  "npx",
  [
    "@tailwindcss/cli",
    "-i",
    inputPath,
    "-o",
    join(web, "public/lesson-visuals.css"),
    "--minify",
  ],
  {
    cwd: web,
    stdio: "inherit",
  }
)
