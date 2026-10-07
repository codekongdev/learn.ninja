import { describe, expect, it } from "vitest"

import { SPEC_VERSION } from "./index"

describe("spec", () => {
  it("targets spec v0.2", () => {
    expect(SPEC_VERSION).toBe("0.2")
  })
})
