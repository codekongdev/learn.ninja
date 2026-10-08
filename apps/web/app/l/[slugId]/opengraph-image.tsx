import { expiredImage, lessonImage, OG_SIZE } from "@/lib/og"
import { loadPublished } from "@/lib/published"

// The preview image for a shared lesson link. Read fresh on each request: the lesson can be updated
// or expire while its link is live.
export const dynamic = "force-dynamic"

export const alt = "Lesson preview"
export const size = OG_SIZE
export const contentType = "image/png"

export default async function Image({
  params,
}: {
  params: Promise<{ slugId: string }>
}) {
  const record = await loadPublished((await params).slugId)
  return record ? lessonImage(record.lesson) : expiredImage()
}
