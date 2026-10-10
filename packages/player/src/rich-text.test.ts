import { describe, expect, it } from "vitest"

import { plainText } from "./rich-text"

describe("plainText", () => {
  it("drops code, bold, and italic markers", () => {
    expect(plainText("`names` is still the original array.")).toBe(
      "names is still the original array."
    )
    expect(plainText("Use **map** to *get* a result")).toBe(
      "Use map to get a result"
    )
  })

  it("keeps a formula's source and plain text as is", () => {
    expect(plainText("Grows by \\( x^2 \\) for $5")).toBe("Grows by x^2 for $5")
    expect(plainText("Nice work")).toBe("Nice work")
  })
})
