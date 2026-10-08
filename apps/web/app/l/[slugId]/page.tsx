import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LessonView } from "@/components/lesson-view"
import { loadPublished } from "@/lib/published"

// A published lesson, at /l/{slug}-{id}. Lessons expire 24 hours after they're published.

type Props = {
  params: Promise<{ slugId: string }>
  searchParams: Promise<{ ui?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const record = await loadPublished((await params).slugId)
  return record
    ? {
        title: record.lesson.title,
        description: record.lesson.summary,
        robots: { index: false },
      }
    : { title: "Lesson unavailable" }
}

export default async function PublishedLessonPage({
  params,
  searchParams,
}: Props) {
  const record = await loadPublished((await params).slugId)
  if (!record) notFound()
  const { ui } = await searchParams
  return (
    <div className="h-svh">
      <LessonView
        lesson={record.lesson}
        prepared={record.prepared}
        uiLanguage={ui}
        expiresAt={record.expiresAt}
      />
    </div>
  )
}
