import type { Metadata } from "next"

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
  if (!record) return <Unavailable />
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

function Unavailable() {
  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-3 px-6">
      <h1 className="text-2xl font-bold tracking-tight">
        This lesson isn&apos;t available
      </h1>
      <p className="text-muted-foreground">
        Lessons expire 24 hours after they&apos;re published. Ask whoever shared
        it to publish it again for a new link.
      </p>
    </main>
  )
}
