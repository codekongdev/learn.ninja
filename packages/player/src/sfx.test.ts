import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import { SFX } from "./sfx"

describe("sound effects", () => {
  it("has every clip in the web app", () => {
    const publicDir = fileURLToPath(
      new URL("../../../apps/web/public", import.meta.url)
    )
    for (const [name, url] of Object.entries(SFX))
      expect(existsSync(publicDir + url), `${url} for ${name}`).toBe(true)
  })
})
