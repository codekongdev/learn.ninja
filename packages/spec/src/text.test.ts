import { describe, expect, it } from "vitest"

import { textBlocks } from "./text"

describe("textBlocks", () => {
  it("makes each line a paragraph", () => {
    expect(textBlocks("One.\nTwo.\n\nThree.")).toEqual([
      { kind: "paragraph", text: "One." },
      { kind: "paragraph", text: "Two." },
      { kind: "paragraph", text: "Three." },
    ])
  })

  it("groups bullet lines into a list, across blank lines", () => {
    expect(
      textBlocks("Openings:\n- **Italian**\n\n* Sicilian\nThat's all.")
    ).toEqual([
      { kind: "paragraph", text: "Openings:" },
      {
        kind: "list",
        ordered: false,
        start: 1,
        items: ["**Italian**", "Sicilian"],
      },
      { kind: "paragraph", text: "That's all." },
    ])
  })

  it("numbers a list that counts up, from where it starts", () => {
    expect(textBlocks("3. Third\n4. Fourth")).toEqual([
      { kind: "list", ordered: true, start: 3, items: ["Third", "Fourth"] },
    ])
  })

  it("keeps lone marker lines and broken counts as text", () => {
    expect(textBlocks("1. e4 e5 2. Nf3")).toEqual([
      { kind: "paragraph", text: "1. e4 e5 2. Nf3" },
    ])
    expect(textBlocks("1. One\n3. Three")).toEqual([
      { kind: "paragraph", text: "1. One" },
      { kind: "paragraph", text: "3. Three" },
    ])
  })

  it("doesn't take italic or a minus sign for a bullet", () => {
    expect(textBlocks("*Italic* start\n-5 degrees")).toEqual([
      { kind: "paragraph", text: "*Italic* start" },
      { kind: "paragraph", text: "-5 degrees" },
    ])
  })
})
