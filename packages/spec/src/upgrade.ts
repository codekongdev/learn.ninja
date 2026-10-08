// Older lesson files, brought up to the current spec. Published lessons and older skills can
// still hand us spec 0.2, so the server upgrades them before validating or playing them.

interface LessonV02 {
  spec: "0.2"
  loops: { concept: Record<string, unknown>; practice: unknown[] }[]
  [key: string]: unknown
}

/** True for data that claims an older spec this module can upgrade. */
export function canUpgrade(data: unknown): boolean {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { spec?: unknown }).spec === "0.2"
  )
}

/**
 * Turns a spec 0.2 lesson into spec 0.3: each loop's concept becomes a concept brick, followed
 * by its practice bricks. Anything else comes back unchanged, for validateLesson to judge.
 */
export function upgradeLesson(data: unknown): unknown {
  if (!canUpgrade(data)) return data
  const { loops, ...rest } = data as LessonV02
  if (!Array.isArray(loops)) return { ...rest, spec: "0.3" }
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(rest)) {
    if (key === "challenge")
      out.bricks = loops.flatMap((loop) => [
        conceptBrick(loop?.concept),
        ...(Array.isArray(loop?.practice) ? loop.practice : []),
      ])
    out[key] = key === "spec" ? "0.3" : value
  }
  return out
}

function conceptBrick(concept: Record<string, unknown> | undefined) {
  const { id, ...rest } = concept ?? {}
  return { id, type: "concept", ...rest }
}
