import { expiredImage, lessonImage } from "@/lib/og"
import { loadPublished } from "@/lib/published"

// The preview image for a shared lesson link, named in the page's metadata with the lesson's title as
// its alt text. A route rather than opengraph-image.tsx: on this dynamic segment Next passes
// generateImageMetadata no params, so the alt couldn't come from the lesson. Read fresh on each
// request: the lesson can be updated or expire while its link is live.
export const dynamic = "force-dynamic"

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slugId: string }> }
) {
  const record = await loadPublished((await params).slugId)
  return record ? lessonImage(record.lesson) : expiredImage()
}
