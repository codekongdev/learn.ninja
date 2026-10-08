import { lessonImage, OG_SIZE } from "@/lib/og"
import { getLesson, LESSON_SLUGS } from "@/lib/lessons"

export const alt = "Lesson preview"
export const size = OG_SIZE
export const contentType = "image/png"

export function generateStaticParams() {
  return LESSON_SLUGS.map((slug) => ({ slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const lesson = getLesson((await params).slug)
  if (!lesson) return new Response("Not found", { status: 404 })
  return lessonImage(lesson)
}
