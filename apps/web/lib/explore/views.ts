import { eq, sql } from "drizzle-orm"
import type { Redis } from "@upstash/redis"

import { lesson, type Db } from "@workspace/db"

// View counts. A lesson page records a view each time it opens (the beacon in
// components/explore/view-beacon.tsx), counted after the response is sent.
// With Redis the views pile up in a hash and are added to lesson.views in one write when the Explore
// lists revalidate or the daily cron runs; without it (development, tests) each view is written
// through to Postgres at once. Explore shows lesson.views plus what's pending, so a view shows at once.

export interface ViewCounter {
  /** One more view for `id`. */
  record(id: string): Promise<void>
  /** Takes every view not yet in Postgres, as lesson id → count, and forgets it. */
  drain(): Promise<Record<string, number>>
  /** The views of `ids` not yet in Postgres, without taking them. Ids with none are left out. */
  pending(ids: string[]): Promise<Map<string, number>>
}

// The keys keep the names they had when these were plays, so nothing pending is lost on deploy.
const PENDING = "plays:pending"

export class RedisViewCounter implements ViewCounter {
  constructor(private redis: Redis) {}

  async record(id: string) {
    await this.redis.hincrby(PENDING, id, 1)
  }

  async drain() {
    // Moved aside first, so views recorded while this runs land in the next batch and two drains
    // at once never count the same batch twice: RENAME fails for the second one.
    const batch = `plays:flushing:${Date.now()}:${Math.random().toString(36).slice(2)}`
    try {
      await this.redis.rename(PENDING, batch)
    } catch {
      return {}
    }
    const counts = await this.redis.hgetall<Record<string, number>>(batch)
    await this.redis.del(batch)
    const out: Record<string, number> = {}
    for (const [id, n] of Object.entries(counts ?? {})) out[id] = Number(n)
    return out
  }

  async pending(ids: string[]) {
    // A batch a drain has moved aside but not yet written is in neither place for those few
    // milliseconds, so a count can dip by its views for one request.
    if (!ids.length) return new Map()
    const counts = await this.redis.hmget<Record<string, number | null>>(
      PENDING,
      ...ids
    )
    const out = new Map<string, number>()
    for (const [id, n] of Object.entries(counts ?? {}))
      if (n) out.set(id, Number(n))
    return out
  }
}

/** Without Redis: every view goes straight to lesson.views. */
export class WriteThroughViewCounter implements ViewCounter {
  constructor(private db: Db) {}

  async record(id: string) {
    await this.db
      .update(lesson)
      .set({ views: sql`${lesson.views} + 1` })
      .where(eq(lesson.id, id))
  }

  async drain() {
    return {}
  }

  async pending() {
    return new Map<string, number>()
  }
}

/** Keeps views in memory until drained; for tests of the flush. */
export class MemoryViewCounter implements ViewCounter {
  private counts = new Map<string, number>()

  async record(id: string) {
    this.counts.set(id, (this.counts.get(id) ?? 0) + 1)
  }

  async drain() {
    const out = Object.fromEntries(this.counts)
    this.counts.clear()
    return out
  }

  async pending(ids: string[]) {
    return new Map(
      ids.flatMap((id) => {
        const n = this.counts.get(id)
        return n ? [[id, n] as const] : []
      })
    )
  }
}

/** Adds the drained views to lesson.views. Returns how many views were written. */
export async function flushViews(
  db: Db,
  counter: ViewCounter
): Promise<number> {
  const counts = await counter.drain()
  let total = 0
  for (const [id, n] of Object.entries(counts)) {
    if (!(n > 0)) continue
    await db
      .update(lesson)
      .set({ views: sql`${lesson.views} + ${n}` })
      .where(eq(lesson.id, id))
    total += n
  }
  return total
}
