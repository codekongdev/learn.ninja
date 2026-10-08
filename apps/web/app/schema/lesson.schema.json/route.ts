import schema from "../../../../../packages/spec/schema/lesson.schema.json"

// The lesson JSON Schema, for editors and tools. Generated from @workspace/spec.

export const dynamic = "force-static"

export function GET() {
  return Response.json(schema, {
    headers: { "Access-Control-Allow-Origin": "*" },
  })
}
