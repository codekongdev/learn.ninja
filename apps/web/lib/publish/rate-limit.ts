import { Ratelimit } from "@upstash/ratelimit"

import { redisFromEnv } from "./store"

// Basic abuse protection for anonymous publishing: a limit per IP address.
// Placeholder numbers until real usage shows what's right (open question in the planning doc).

export const PUBLISH_LIMIT = { requests: 20, windowSeconds: 60 * 60 }

export interface RateLimiter {
  /** Whether this key may make another request now. */
  allow(key: string): Promise<boolean>
}

/** In-memory fallback for development: resets when the server restarts. */
export class MemoryRateLimiter implements RateLimiter {
  private hits = new Map<string, number[]>()
  constructor(
    private limit = PUBLISH_LIMIT.requests,
    private windowMs = PUBLISH_LIMIT.windowSeconds * 1000
  ) {}
  async allow(key: string) {
    const now = Date.now()
    const recent = (this.hits.get(key) ?? []).filter(
      (t) => now - t < this.windowMs
    )
    if (recent.length >= this.limit) return false
    this.hits.set(key, [...recent, now])
    return true
  }
}

let limiter: RateLimiter | null = null

export function getRateLimiter(): RateLimiter {
  if (limiter) return limiter
  const redis = redisFromEnv()
  if (redis) {
    const upstash = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        PUBLISH_LIMIT.requests,
        `${PUBLISH_LIMIT.windowSeconds} s`
      ),
      prefix: "ratelimit:publish",
    })
    limiter = { allow: async (key) => (await upstash.limit(key)).success }
  } else limiter = new MemoryRateLimiter()
  return limiter
}
