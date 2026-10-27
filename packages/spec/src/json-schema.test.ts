import { readFileSync } from "node:fs"

import { describe, expect, it } from "vitest"

import { lessonJsonSchema } from "./json-schema"

describe("JSON Schema", () => {
  it("matches the committed schema file (run `npm run schema -w @workspace/spec` after changing the spec)", () => {
    const committed = readFileSync(
      new URL("../schema/lesson.schema.json", import.meta.url),
      "utf8"
    )
    expect(committed).toBe(JSON.stringify(lessonJsonSchema(), null, 2) + "\n")
  })

  it("only allows choice or compare as the hook", () => {
    type Union = { oneOf?: { $ref: string }[]; anyOf?: { $ref: string }[] }
    const schema = lessonJsonSchema() as unknown as {
      properties: { hook: { $ref: string } }
      $defs: Record<string, Union>
    }
    expect(schema.properties.hook.$ref).toBe("#/$defs/HookKata")
    const hook = schema.$defs.HookKata!
    const variants = (hook.oneOf ?? hook.anyOf)!.map((v) => v.$ref)
    expect(variants).toEqual(["#/$defs/ChoiceKata", "#/$defs/CompareKata"])
  })

  it("names its shared definitions so LLMs can read it", () => {
    const defs = Object.keys(lessonJsonSchema().$defs ?? {})
    expect(defs.filter((d) => d.startsWith("__"))).toEqual([])
  })
})
