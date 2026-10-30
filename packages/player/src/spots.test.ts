// @vitest-environment happy-dom
import { describe, expect, it } from "vitest"

import { markSpots } from "./spots"

function picture() {
  const doc = document.implementation.createHTMLDocument()
  doc.body.innerHTML = `<main><h2 id="title">Files</h2><ul><li data-hotspot="readme"><span id="inner">README.md</span></li><li data-hotspot="index">index.js</li><li data-hotspot="package">package.json</li></ul></main>`
  return doc
}
const part = (doc: Document, id: string) =>
  doc.querySelector<HTMLElement>(`[data-hotspot=${id}]`)!
const dimmed = (doc: Document) =>
  [...doc.querySelectorAll<HTMLElement>("[data-spot-dim]")].map(
    (el) => el.dataset.hotspot ?? el.id
  )

describe("markSpots", () => {
  it("leaves the picture clean with nothing in use", () => {
    const doc = picture()
    markSpots(doc, { lit: new Map(), hint: false })
    expect(doc.querySelector("[data-spot],[data-spot-hint]")).toBeNull()
    expect(dimmed(doc)).toEqual([])
  })

  it("hints every part without dimming any", () => {
    const doc = picture()
    markSpots(doc, { lit: new Map(), hint: true })
    expect(doc.querySelectorAll("[data-spot-hint]")).toHaveLength(3)
    expect(dimmed(doc)).toEqual([])
  })

  it("dims all but the part in use, keeping its own contents", () => {
    const doc = picture()
    markSpots(doc, { lit: new Map([["readme", "on"]]), hint: true })
    expect(part(doc, "readme").getAttribute("data-spot")).toBe("on")
    expect(dimmed(doc).sort()).toEqual(["index", "package", "title"])
    expect(doc.querySelector("[data-spot-hint]")).toBeNull()
  })

  it("keeps every part in use, each in its own state", () => {
    const doc = picture()
    markSpots(doc, {
      lit: new Map([
        ["readme", "wrong"],
        ["package", "correct"],
      ]),
      hint: false,
    })
    expect(part(doc, "readme").getAttribute("data-spot")).toBe("wrong")
    expect(part(doc, "package").getAttribute("data-spot")).toBe("correct")
    expect(dimmed(doc).sort()).toEqual(["index", "title"])
  })

  it("clears the last marks", () => {
    const doc = picture()
    markSpots(doc, { lit: new Map([["readme", "on"]]), hint: false })
    markSpots(doc, { lit: new Map(), hint: false })
    expect(doc.querySelector("[data-spot]")).toBeNull()
    expect(dimmed(doc)).toEqual([])
  })
})
