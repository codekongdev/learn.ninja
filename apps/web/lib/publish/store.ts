import { mkdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

import { Redis } from "@upstash/redis"

import type { Prepared } from "@workspace/player"
import type { Lesson } from "@workspace/spec"

// Where published lessons live. The app only talks to LessonStore, so the backend can be swapped:
// Upstash Redis on Vercel, a local folder in development, or anything else a self-hoster prefers.

export const LESSON_TTL_SECONDS = 24 * 60 * 60

export interface StoredLesson {
  id: string
  slug: string
  spec: string
  lesson: Lesson
  /** Formulas, code, and visuals CSS, prepared once at publish time. */
  prepared: Prepared
  editTokenHash: string
  createdAt: number
  expiresAt: number
  updatedAt?: number
}

export interface LessonStore {
  /** Saves a new lesson that expires after ttlSeconds. */
  create(record: StoredLesson, ttlSeconds: number): Promise<void>
  /** A lesson that hasn't expired, or null. */
  get(id: string): Promise<StoredLesson | null>
  /** Replaces a lesson without changing when it expires. */
  update(record: StoredLesson): Promise<void>
}

// ---------- Upstash Redis (Vercel) ----------

export class UpstashLessonStore implements LessonStore {
  constructor(private redis: Redis) {}
  private key = (id: string) => `lesson:${id}`
  async create(record: StoredLesson, ttlSeconds: number) {
    await this.redis.set(this.key(record.id), record, { ex: ttlSeconds })
  }
  async get(id: string) {
    const record = await this.redis.get<StoredLesson>(this.key(id))
    return record && record.expiresAt > Date.now() ? record : null
  }
  async update(record: StoredLesson) {
    await this.redis.set(this.key(record.id), record, { keepTtl: true })
  }
}

// ---------- local folder (development, self-hosting) ----------

export class FileLessonStore implements LessonStore {
  constructor(private dir: string) {}
  private file = (id: string) => join(this.dir, `${id}.json`)
  async create(record: StoredLesson) {
    await mkdir(this.dir, { recursive: true })
    await writeFile(this.file(record.id), JSON.stringify(record))
  }
  async get(id: string) {
    try {
      const record = JSON.parse(
        await readFile(this.file(id), "utf8")
      ) as StoredLesson
      return record.expiresAt > Date.now() ? record : null
    } catch {
      return null
    }
  }
  async update(record: StoredLesson) {
    await this.create(record)
  }
}

// ---------- choosing one ----------

/** Upstash credentials, under the names Upstash or the Vercel Marketplace integration set. */
export function redisFromEnv(env = process.env): Redis | null {
  const url = env.UPSTASH_REDIS_REST_URL ?? env.KV_REST_API_URL
  const token = env.UPSTASH_REDIS_REST_TOKEN ?? env.KV_REST_API_TOKEN
  return url && token ? new Redis({ url, token }) : null
}

let store: LessonStore | null = null

export class StorageNotConfiguredError extends Error {
  constructor() {
    super(
      "Lesson storage isn't configured. Add Upstash Redis (UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN)."
    )
  }
}

export function getLessonStore(): LessonStore {
  if (store) return store
  const redis = redisFromEnv()
  if (redis) store = new UpstashLessonStore(redis)
  else if (
    process.env.NODE_ENV !== "production" ||
    process.env.LEARN_FILE_STORE
  ) {
    store = new FileLessonStore(
      process.env.LEARN_FILE_STORE ?? join(process.cwd(), ".data/lessons")
    )
  } else throw new StorageNotConfiguredError()
  return store
}
