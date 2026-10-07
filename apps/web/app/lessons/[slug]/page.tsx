import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { prepareLesson } from "@workspace/player/prepare"

import { LessonView } from "@/components/lesson-view"
import { getLesson, LESSON_SLUGS } from "@/lib/lessons"

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ ui?: string }>
}

export function generateStaticParams() {
  return LESSON_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lesson = getLesson((await params).slug)
  return lesson
    ? { title: `${lesson.title} · Learn`, description: lesson.summary }
    : {}
}

export default async function LessonPage({ params, searchParams }: Props) {
  const lesson = getLesson((await params).slug)
  if (!lesson) notFound()
  // ?ui=ar shows the player's own text in Arabic, right to left (for testing).
  const { ui } = await searchParams
  const prepared = await prepareLesson(lesson)
  return (
    <div className="h-svh">
      <LessonView lesson={lesson} prepared={prepared} uiLanguage={ui} />
    </div>
  )
}
