import type { Metadata } from "next"
import { headers } from "next/headers"

import { labelForTag, normalizeTag, TAG_PATTERN } from "@workspace/spec"

import { ExploreGreeting } from "@/components/explore/explore-greeting"
import { LessonFeed } from "@/components/explore/lesson-feed"
import { RefreshAfterView } from "@/components/explore/refresh-after-view"
import { TagFilter } from "@/components/explore/tag-filter"
import { currentActor } from "@/lib/auth/session"
import {
  cachedLessons,
  EXPLORE_PAGE_SIZE,
  getViewCounter,
} from "@/lib/explore/cache"
import { greetingFor, localHour } from "@/lib/explore/greeting"
import { liveViewCounts } from "@/lib/explore/handlers"
import { completedAt, likedIds } from "@/lib/explore/queries"
import { getDb } from "@/lib/publish/store"
import { SITE } from "@/lib/site"

type SearchParams = Promise<{ tag?: string | string[] }>

/**
 * The tag `?tag=` narrows the list to, as its key: "JS" and "javascript" both read as javascript.
 * Anything that can't be a key is ignored, so a mangled link shows the whole feed.
 */
async function tagFrom(searchParams: SearchParams): Promise<string | null> {
  const raw = (await searchParams).tag
  if (typeof raw !== "string") return null
  const key = normalizeTag(raw)
  return key.length <= 60 && TAG_PATTERN.test(key) ? key : null
}

// A tag's view is Explore filtered, not a page of its own: most tags hold a lesson or two, so it
// stays out of search results and points them at /explore.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const tag = await tagFrom(searchParams)
  return {
    title: tag ? `${labelForTag(tag)} · Explore` : "Explore",
    description: `Lessons people made with ${SITE.name} and chose to share.`,
    alternates: { canonical: "/explore" },
    ...(tag ? { robots: { index: false, follow: true } } : {}),
  }
}

// The lists come from the data cache (lib/explore/cache.ts); only the session, the view counts, and
// what the viewer liked and finished are read per request. The frame around the list is the (feed) layout's;
// loading.tsx beside this file stands in for the list until it arrives.
export const dynamic = "force-dynamic"

// Newest first, for now: Trending and Top are still in lib/explore/queries.ts for when the feed
// is big enough to need them.
export default async function ExplorePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const tag = await tagFrom(searchParams)
  const [actor, lessons, h] = await Promise.all([
    currentActor(),
    cachedLessons("new", undefined, tag ? { tag } : {}),
    headers(),
  ])
  // Vercel names the visitor's time zone from their IP, so the greeting fits their hour.
  const greeting = greetingFor(
    localHour(new Date(), h.get("x-vercel-ip-timezone"))
  )
  const ids = lessons.map((l) => l.id)
  const db = await getDb()
  const [views, liked, completed] = await Promise.all([
    liveViewCounts(ids, { db, views: await getViewCounter() }),
    actor ? likedIds(db, actor.userId, ids) : new Set<string>(),
    actor ? completedAt(db, actor.userId, ids) : new Map<string, number>(),
  ])
  return (
    <>
      {/* The list is the page: a greeting over it, and a name only for assistive tech. */}
      <h1 className="sr-only">Explore</h1>
      <ExploreGreeting greeting={greeting}>
        {tag ? (
          <TagFilter
            // As the lessons wrote it ("Claude Code"), else spelled out from the key.
            label={
              lessons
                .flatMap((l) => l.tags)
                .find((label) => normalizeTag(label) === tag) ??
              labelForTag(tag)
            }
            count={lessons.length}
            more={lessons.length === EXPLORE_PAGE_SIZE}
            className="ms-auto"
          />
        ) : null}
      </ExploreGreeting>
      <RefreshAfterView />
      {lessons.length ? (
        <LessonFeed
          lessons={lessons.map((l) => ({
            ...l,
            views: views.get(l.id) ?? l.views,
          }))}
          viewer={{
            signedIn: actor !== null,
            liked,
            completed,
            userId: actor?.userId,
          }}
        />
      ) : tag ? (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No lessons with this tag right now.
        </p>
      ) : (
        <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nothing here yet. Be the first: ask your agent for a lesson and say
          keep it.
        </p>
      )}
    </>
  )
}
