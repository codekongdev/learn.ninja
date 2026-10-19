import { createMcpHandler } from "mcp-handler"
import type { McpServer } from "@modelcontextprotocol/server"
import { z } from "zod"

import {
  checkLesson,
  publishLesson,
  updateLesson,
  type Deps,
  type Reply,
} from "../publish/handlers"
import type { RateLimiter } from "../publish/rate-limit"
import { clientKey } from "../publish/request"
import { StorageNotConfiguredError } from "../publish/store"

// The learn.ninja MCP server at /mcp: the guide and the publish API as tools, for chat apps that
// can't run the skill's CLI. No accounts: an anonymous lesson's claimUrl is how a user keeps it.

export interface McpDeps extends Deps {
  /** The looser limit checks use, as /api/validate does. */
  validateLimiter: RateLimiter
  /** The skill's synced files (steps, guides, levels, schema), by path. */
  guide: () => { files: Record<string, string> }
}

const INSTRUCTIONS =
  "learn.ninja turns anything into one short, interactive lesson with a shareable link. Call `get_guide` with `steps` before writing a lesson, then follow it."

const LEVELS = ["beginner", "intermediate", "advanced"]

/** Which guide files each `get_guide` section returns. */
export const GUIDE_SECTIONS = {
  steps: ["steps.md"],
  planning: ["reference/planning.md"],
  teaching: ["reference/teaching-guide.md"],
  format: ["reference/lesson-format.md"],
  levels: ["levels/index.md", ...LEVELS.map((l) => `levels/${l}.md`)],
  schema: ["schema/lesson.schema.json"],
} as const

type Section = keyof typeof GUIDE_SECTIONS
const SECTIONS = Object.keys(GUIDE_SECTIONS) as [Section, ...Section[]]

const lessonText = z
  .string()
  .describe("The whole lesson file as JSON text, following the lesson spec.")

/** Builds the /mcp request handler. Takes its dependencies so tests can pass an in-memory store. */
export function createLearnMcp(
  deps: McpDeps
): (req: Request) => Promise<Response> {
  return createMcpHandler((server) => registerTools(server, deps), {
    serverInfo: { name: "learn.ninja", version: "1.0.0" },
    instructions: INSTRUCTIONS,
  })
}

function registerTools(server: McpServer, deps: McpDeps) {
  server.registerTool(
    "get_guide",
    {
      title: "Read the lesson guide",
      description:
        "Returns part of the guide for writing a learn.ninja lesson. Start with `steps` (the default): it says when to read each other section.",
      inputSchema: z.object({
        section: z
          .enum(SECTIONS)
          .default("steps")
          .describe(
            "steps: what to do, in order. planning: scope, size, reading age. teaching: how to teach, which brick to use, visuals. format: every field of the lesson file. levels: picking the level, and each level's guide. schema: the formal JSON Schema."
          ),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ section }) => {
      const { files } = deps.guide()
      const picked = GUIDE_SECTIONS[section].map((path) => ({
        path,
        text: files[path] ?? "",
      }))
      return {
        content: [
          {
            type: "text",
            text:
              picked.length === 1
                ? picked[0]!.text
                : picked
                    .map((f) => `<!-- ${f.path} -->\n\n${f.text}`)
                    .join("\n\n"),
          },
        ],
        structuredContent: { section, files: picked },
      }
    }
  )

  server.registerTool(
    "validate_lesson",
    {
      title: "Check a lesson",
      description:
        "Checks a lesson file with the rules publishing uses, without storing anything. Fix every issue it reports and check again until it passes.",
      inputSchema: z.object({ lesson: lessonText }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ lesson }, ctx) =>
      toolResult(
        () =>
          checkLesson(
            { text: lesson, client: clientOf(ctx) },
            { limiter: deps.validateLimiter }
          ),
        ["ok", "spec"]
      )
  )

  server.registerTool(
    "publish_lesson",
    {
      title: "Publish a lesson",
      description:
        "Publishes a lesson and returns its link (`url`), which lasts 7 days. Keep the `id` and `editToken` to change it later with `update_lesson`. `claimUrl` keeps the lesson in a learn.ninja account: give it to the user only when they ask to keep the lesson.",
      inputSchema: z.object({ lesson: lessonText }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    ({ lesson }, ctx) =>
      toolResult(
        () =>
          publishLesson(
            { text: lesson, client: clientOf(ctx), ownerId: null },
            deps
          ),
        ["ok", "id", "url", "editToken", "claimUrl", "expiresAt"]
      )
  )

  server.registerTool(
    "update_lesson",
    {
      title: "Update a published lesson",
      description:
        "Replaces a published lesson with a new version at the same link. Pass the `id` and `editToken` that `publish_lesson` returned.",
      inputSchema: z.object({
        id: z.string().describe("The lesson's id, from `publish_lesson`."),
        editToken: z
          .string()
          .describe("The secret edit token, from `publish_lesson`."),
        lesson: lessonText,
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    ({ id, editToken, lesson }, ctx) =>
      toolResult(
        () =>
          updateLesson(
            { id, editToken, text: lesson, client: clientOf(ctx) },
            deps
          ),
        ["ok", "id", "url", "expiresAt"]
      )
  )
}

/** The caller's IP for rate limits, from the HTTP request the tool call came in on. */
function clientOf(ctx: { http?: { req?: Request } }): string {
  return ctx.http?.req ? clientKey(ctx.http.req) : "local"
}

/**
 * Turns a handler's reply into a tool result. A failure keeps its whole body ({error, message,
 * issues}) so the model sees the checker's issues verbatim. Success keeps only `fields`: the
 * `skill` field nags CLI installs to update, and MCP clients always get the live guide.
 */
async function toolResult(handle: () => Promise<Reply>, fields: string[]) {
  let body: Record<string, unknown>
  try {
    body = (await handle()).body
  } catch (e) {
    if (e instanceof StorageNotConfiguredError) {
      body = { ok: false, error: "storage_not_configured", message: e.message }
    } else {
      console.error("MCP tool failed:", e)
      body = {
        ok: false,
        error: "server_error",
        message: "Something went wrong on the server. Try again in a minute.",
      }
    }
  }
  if (body.ok !== true) {
    const { skill: _skill, ...error } = body
    return {
      content: [
        { type: "text" as const, text: JSON.stringify(error, null, 2) },
      ],
      structuredContent: error,
      isError: true,
    }
  }
  const result = Object.fromEntries(
    fields.filter((f) => f in body).map((f) => [f, body[f]])
  )
  return {
    content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    structuredContent: result,
  }
}
