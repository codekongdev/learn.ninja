import { mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { beforeEach, describe, expect, it } from "vitest"

import { run, SKILL_VERSION, type Io } from "./cli"

const lesson = readFileSync(
  new URL("../../../examples/button-hierarchy.json", import.meta.url),
  "utf8"
)

type Call = { method: string; url: string; auth?: string; skill?: string }

function setup(responses: { status: number; body: unknown }[]) {
  const cwd = mkdtempSync(join(tmpdir(), "learn-cli-"))
  writeFileSync(join(cwd, "lesson.json"), lesson)
  const calls: Call[] = []
  const out: string[] = []
  const err: string[] = []
  const io: Io = {
    cwd,
    env: {},
    out: (l) => out.push(l),
    err: (l) => err.push(l),
    schemaPath: "/skill/schema/lesson.schema.json",
    fetch: (async (url: string, init: RequestInit) => {
      const headers = init.headers as Record<string, string>
      calls.push({
        method: init.method!,
        url,
        auth: headers.authorization,
        skill: headers["x-learn-skill-version"],
      })
      const next = responses.shift()!
      return new Response(JSON.stringify(next.body), { status: next.status })
    }) as typeof fetch,
  }
  return { io, cwd, calls, out, err }
}

const created = (id = "abcd1234") => ({
  status: 201,
  body: {
    ok: true,
    id,
    url: `https://learn.test/l/button-hierarchy-${id}`,
    editToken: "tok-" + id,
    expiresAt: new Date(Date.now() + 864e5).toISOString(),
    skill: { latest: SKILL_VERSION, updateAvailable: false },
  },
})

describe("learn validate", () => {
  it("passes a valid lesson", async () => {
    const t = setup([])
    expect(await run(["validate", "lesson.json"], t.io)).toBe(0)
    expect(t.out.join("\n")).toMatch(/is a valid lesson/)
  })
  it("lists every issue for an invalid lesson", async () => {
    const t = setup([])
    const broken = JSON.parse(lesson)
    delete broken.bricks[1].options[1].feedback
    writeFileSync(join(t.cwd, "lesson.json"), JSON.stringify(broken))
    expect(await run(["validate", "lesson.json"], t.io)).toBe(1)
    expect(t.err.join("\n")).toMatch(
      /1 issue to fix:\n- bricks\[1\]\.options\[1\]: Wrong option "b" has no feedback/
    )
  })
})

describe("learn publish", () => {
  let t: ReturnType<typeof setup>
  beforeEach(() => {
    t = setup([
      created(),
      { status: 200, body: { ...created().body, editToken: undefined } },
    ])
  })

  it("publishes, then updates the same link the next time", async () => {
    expect(
      await run(
        ["publish", "lesson.json", "--api", "https://learn.test/"],
        t.io
      )
    ).toBe(0)
    expect(t.calls[0]).toMatchObject({
      method: "POST",
      url: "https://learn.test/api/lessons",
      skill: SKILL_VERSION,
    })
    expect(t.out.join("\n")).toMatch(
      /Published: https:\/\/learn\.test\/l\/button-hierarchy-abcd1234/
    )

    const statePath = join(t.cwd, ".learn/state.json")
    expect(
      JSON.parse(readFileSync(statePath, "utf8")).lessons[
        join(t.cwd, "lesson.json")
      ]
    ).toMatchObject({ id: "abcd1234", editToken: "tok-abcd1234" })
    expect(statSync(statePath).mode & 0o777).toBe(0o600)

    expect(
      await run(["publish", "lesson.json", "--api", "https://learn.test"], t.io)
    ).toBe(0)
    expect(t.calls[1]).toMatchObject({
      method: "PUT",
      url: "https://learn.test/api/lessons/abcd1234",
      auth: "Bearer tok-abcd1234",
    })
    expect(t.out.join("\n")).toMatch(/Updated: /)
  })

  it("publishes a new link when the saved one has expired", async () => {
    t = setup([
      created("first111"),
      { status: 404, body: { ok: false, error: "not_found" } },
      created("second22"),
    ])
    await run(["publish", "lesson.json"], t.io)
    expect(await run(["publish", "lesson.json"], t.io)).toBe(0)
    expect(t.calls.map((c) => c.method)).toEqual(["POST", "PUT", "POST"])
    expect(t.out.join("\n")).toMatch(/button-hierarchy-second22/)
  })

  it("shows the server's issues when it rejects the lesson", async () => {
    t = setup([
      {
        status: 422,
        body: {
          ok: false,
          error: "unsupported_spec",
          message: "This server accepts spec 0.3, not 0.2.",
        },
      },
    ])
    expect(await run(["publish", "lesson.json"], t.io)).toBe(1)
    expect(t.err.join("\n")).toMatch(/accepts spec 0\.3/)
  })

  it("passes on the skill update notice", async () => {
    const reply = created()
    reply.body.skill = {
      latest: "9.9.9",
      updateAvailable: true,
      updateCommand: "npx skills add https://learn.ninja -g",
    } as never
    t = setup([reply])
    await run(["publish", "lesson.json"], t.io)
    expect(t.out.join("\n")).toMatch(
      /newer version of the lesson skill.*npx skills add/
    )
  })

  it("doesn't call the API for an invalid lesson", async () => {
    writeFileSync(join(t.cwd, "lesson.json"), "{}")
    expect(await run(["publish", "lesson.json"], t.io)).toBe(1)
    expect(t.calls).toEqual([])
  })
})
