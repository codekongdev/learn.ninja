import { lessonImage, OG_SIZE } from "@/lib/og"
import { getLesson } from "@/lib/lessons"

// One image, described by the lesson's own title. Next derives this route's static params from it and
// the page's generateStaticParams, so it can't export its own.
export function generateImageMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const lesson = getLesson(params.slug)
  return [
    {
      id: "card",
      alt: lesson?.title ?? "",
      size: OG_SIZE,
      contentType: "image/png",
    },
  ]
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
