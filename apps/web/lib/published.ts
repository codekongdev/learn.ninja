import { cache } from "react"

import { upgradeLesson, type Lesson } from "@workspace/spec"

import { idFromParam } from "./publish/ids"
import { getLessonStore, type StoredLesson } from "./publish/store"

/**
 * A published lesson from its /l/{slug}-{id} path segment, or null once it has expired.
 * Cached per request, so the page and its metadata share one read.
 */
export const loadPublished = cache(
  async (param: string): Promise<StoredLesson | null> => {
    const id = idFromParam(param)
    const record = id ? await getLessonStore().get(id) : null
    // Lessons published before spec 0.3 are still live for up to 24 hours.
    return record
      ? { ...record, lesson: upgradeLesson(record.lesson) as Lesson }
      : null
  }
)
