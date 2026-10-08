import { notFound } from "next/navigation"

import {
  contentTypeFor,
  readSkillFile,
  SKILL_ROUTE_NAME,
  skillFiles,
  skillIndex,
} from "@/lib/skill-files"

// /.well-known/skills/index.json, and each file at /.well-known/skills/learn/{file}.
// Built at build time from skills/learn/, so the served skill always matches the repo.

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return [
    { path: ["index.json"] },
    ...skillFiles().map((f) => ({ path: [SKILL_ROUTE_NAME, ...f.split("/")] })),
  ]
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const parts = (await params).path
  if (parts.length === 1 && parts[0] === "index.json")
    return Response.json(skillIndex())
  const [name, ...rest] = parts
  const file = rest.join("/")
  if (name !== SKILL_ROUTE_NAME || !skillFiles().includes(file)) notFound()
  return new Response(new Uint8Array(readSkillFile(file)), {
    headers: { "Content-Type": contentTypeFor(file) },
  })
}
