import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { prepareLesson } from "@workspace/player/prepare"

import { LessonView } from "@/components/lesson-view"
import { getLesson, LESSON_SLUGS } from "@/lib/lessons"

// Prerendered at build time. Nothing here reads the request, so the Tailwind compile in
// prepareLesson() runs once per lesson, not per visit.
type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return LESSON_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lesson = getLesson((await params).slug)
  return lesson ? { title: lesson.title, description: lesson.summary } : {}
}

export default async function LessonPage({ params }: Props) {
  const lesson = getLesson((await params).slug)
  if (!lesson) notFound()
  const prepared = await prepareLesson(lesson)
  return (
    <div className="h-svh">
      <LessonView lesson={lesson} prepared={prepared} />
    </div>
  )
}
