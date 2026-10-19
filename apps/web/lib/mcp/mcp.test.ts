import { readFileSync } from "node:fs"

import { beforeAll, beforeEach, describe, expect, it } from "vitest"

import { connectPglite, type Db } from "@workspace/db"

import { MemoryRateLimiter } from "../publish/rate-limit"
import { PostgresLessonStore } from "../publish/store"
import { skillBundle } from "../skill-files"
import { createLearnMcp, GUIDE_SECTIONS, type McpDeps } from "./server"

const example = (file: string) =>
  readFileSync(new URL(`../../../../examples/${file}`, import.meta.url), "utf8")
const buttons = example("button-hierarchy.json")

let db: Db
beforeAll(async () => {
  db = await connectPglite()
}, 30_000)

let deps: McpDeps
let mcp: (req: Request) => Promise<Response>
beforeEach(() => {
  deps = {
    store: new PostgresLessonStore(db),
    limiter: new MemoryRateLimiter(),
    validateLimiter: new MemoryRateLimiter(120),
    origin: "https://learn.test",
    guide: skillBundle,
  }
  mcp = createLearnMcp(deps)
})

interface ToolResult {
  content: { type: string; text: string }[]
  structuredContent: Record<string, unknown>
  isError?: boolean
}

let nextId = 1
/** Sends one JSON-RPC request the way a client does, and reads the result out of the SSE reply. */
async function rpc(method: string, params: object, client = "1.2.3.4") {
  const res = await mcp(
    new Request("https://learn.test/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
        "x-forwarded-for": client,
      },
      body: JSON.stringify({ jsonrpc: "2.0", id: nextId++, method, params }),
    })
  )
  expect(res.status).toBe(200)
  const text = await res.text()
  const data = text
    .split("\n")
    .filter((l) => l.startsWith("data: "))
    .map((l) => JSON.parse(l.slice(6)))
    .find((m) => "result" in m || "error" in m)
  if (data.error) throw new Error(JSON.stringify(data.error))
  return data.result
}

const call = (
  name: string,
  args: Record<string, unknown>,
  client?: string
): Promise<ToolResult> => rpc("tools/call", { name, arguments: args }, client)

describe("tools", () => {
  it("lists the four tools, each with a title and annotations", async () => {
    const { tools } = await rpc("tools/list", {})
    expect(tools.map((t: { name: string }) => t.name).sort()).toEqual([
      "get_guide",
      "publish_lesson",
      "update_lesson",
      "validate_lesson",
    ])
    for (const tool of tools) {
      expect(tool.title).toEqual(expect.any(String))
      expect(tool.annotations).toHaveProperty("readOnlyHint")
    }
  })
})

describe("get_guide", () => {
  const files = skillBundle().files

  it("returns steps.md by default", async () => {
    const result = await call("get_guide", {})
    expect(result.isError).toBeFalsy()
    expect(result.content[0]!.text).toBe(files["steps.md"])
    expect(result.content[0]!.text).toContain("get_guide")
  })

  it("returns every level file for levels", async () => {
    const result = await call("get_guide", { section: "levels" })
    const paths = (result.structuredContent.files as { path: string }[]).map(
      (f) => f.path
    )
    expect(paths).toEqual([...GUIDE_SECTIONS.levels])
    for (const path of paths) {
      expect(files[path]).toBeTruthy()
      expect(result.content[0]!.text).toContain(files[path]!)
    }
  })

  it("returns the schema as JSON", async () => {
    const result = await call("get_guide", { section: "schema" })
    expect(JSON.parse(result.content[0]!.text)).toHaveProperty("$schema")
  })

  it("has a file for every section", () => {
    for (const paths of Object.values(GUIDE_SECTIONS)) {
      for (const path of paths) expect(files[path]).toBeTruthy()
    }
  })
})

describe("validate_lesson", () => {
  it("passes a valid lesson", async () => {
    const result = await call("validate_lesson", { lesson: buttons })
    expect(result.isError).toBeFalsy()
    expect(result.structuredContent).toEqual({
      ok: true,
      spec: JSON.parse(buttons).spec,
    })
  })

  it("returns the checker's issues for a broken lesson", async () => {
    const broken = JSON.parse(buttons)
    delete broken.bricks[1].options[1].feedback
    const result = await call("validate_lesson", {
      lesson: JSON.stringify(broken),
    })
    expect(result.isError).toBe(true)
    expect(result.structuredContent).toMatchObject({
      ok: false,
      error: "invalid_lesson",
      issues: expect.arrayContaining([
        expect.objectContaining({ path: expect.anything() }),
      ]),
    })
    expect(result.structuredContent).not.toHaveProperty("skill")
    expect(JSON.parse(result.content[0]!.text)).toEqual(
      result.structuredContent
    )
  })
})

describe("publish_lesson and update_lesson", () => {
  it("publishes, then updates with the edit token", async () => {
    const published = await call("publish_lesson", { lesson: buttons })
    expect(published.isError).toBeFalsy()
    const body = published.structuredContent
    expect(body).toEqual({
      ok: true,
      id: expect.any(String),
      url: expect.stringMatching(
        /^https:\/\/learn\.test\/l\/button-hierarchy-/
      ),
      editToken: expect.any(String),
      claimUrl: expect.stringMatching(/^https:\/\/learn\.test\/keep\//),
      expiresAt: expect.any(String),
    })
    expect((await deps.store.get(body.id as string))?.ownerId).toBeNull()

    const changed = { ...JSON.parse(buttons), title: "Buttons, ranked" }
    const updated = await call("update_lesson", {
      id: body.id,
      editToken: body.editToken,
      lesson: JSON.stringify(changed),
    })
    expect(updated.isError).toBeFalsy()
    expect(updated.structuredContent).toMatchObject({
      ok: true,
      id: body.id,
      url: `https://learn.test/l/buttons-ranked-${body.id}`,
    })
    expect((await deps.store.get(body.id as string))?.lesson.title).toBe(
      "Buttons, ranked"
    )
  })

  it("refuses an update with the wrong token", async () => {
    const published = await call("publish_lesson", { lesson: buttons })
    const result = await call("update_lesson", {
      id: published.structuredContent.id,
      editToken: "not-the-token",
      lesson: buttons,
    })
    expect(result.isError).toBe(true)
    expect(result.structuredContent).toMatchObject({ error: "unauthorized" })
  })

  it("rate-limits publishing per client", async () => {
    for (let i = 0; i < 20; i++) {
      const ok = await call("publish_lesson", { lesson: buttons }, "5.6.7.8")
      expect(ok.isError).toBeFalsy()
    }
    const limited = await call("publish_lesson", { lesson: buttons }, "5.6.7.8")
    expect(limited.isError).toBe(true)
    expect(limited.structuredContent).toMatchObject({ error: "rate_limited" })
    // Another client still gets through: the limit is per IP, not per server.
    const other = await call("publish_lesson", { lesson: buttons }, "9.9.9.9")
    expect(other.isError).toBeFalsy()
  }, 30_000)
})
