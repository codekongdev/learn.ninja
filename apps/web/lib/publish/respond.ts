import type { Reply } from "./handlers"
import { StorageNotConfiguredError } from "./store"

/** Turns a handler's reply into a response, and unexpected failures into JSON errors the skill can show. */
export async function respond(handle: () => Promise<Reply>): Promise<Response> {
  try {
    const reply = await handle()
    return Response.json(reply.body, { status: reply.status })
  } catch (e) {
    if (e instanceof StorageNotConfiguredError) {
      return Response.json(
        { ok: false, error: "storage_not_configured", message: e.message },
        { status: 503 }
      )
    }
    console.error("Publish API failed:", e)
    return Response.json(
      {
        ok: false,
        error: "server_error",
        message: "Something went wrong on the server. Try again in a minute.",
      },
      { status: 500 }
    )
  }
}
