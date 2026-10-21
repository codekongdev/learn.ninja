import { describe, expect, it } from "vitest"

import { greetingFor, localHour } from "./greeting"

describe("localHour", () => {
  const noonUtc = new Date("2026-10-21T12:00:00Z")

  it("reads the hour in the visitor's zone", () => {
    expect(localHour(noonUtc, "Asia/Tokyo")).toBe(21)
    expect(localHour(noonUtc, "America/New_York")).toBe(8)
    expect(localHour(new Date("2026-10-21T15:30:00Z"), "Asia/Tokyo")).toBe(0)
  })

  it("falls back to the server's hour without a known zone", () => {
    expect(localHour(noonUtc, null)).toBe(noonUtc.getHours())
    expect(localHour(noonUtc, "Not/AZone")).toBe(noonUtc.getHours())
  })
})

describe("greetingFor", () => {
  it("picks the part of the day", () => {
    expect(greetingFor(5).word).toBe("Ohayō")
    expect(greetingFor(11).word).toBe("Ohayō")
    expect(greetingFor(12).word).toBe("Konnichiwa")
    expect(greetingFor(18).word).toBe("Konbanwa")
  })

  it("keeps saying konbanwa late at night, with its own line", () => {
    expect(greetingFor(23).word).toBe("Konbanwa")
    expect(greetingFor(4).word).toBe("Konbanwa")
    expect(greetingFor(4).line).not.toBe(greetingFor(18).line)
  })
})
