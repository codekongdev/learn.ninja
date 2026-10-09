import type { MetadataRoute } from "next"

import { LESSON_SLUGS } from "@/lib/lessons"
import { SITE } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url },
    { url: `${SITE.url}/docs` },
    { url: `${SITE.url}/contributors` },
    ...LESSON_SLUGS.map((slug) => ({ url: `${SITE.url}/lessons/${slug}` })),
    { url: `${SITE.url}/llms.txt` },
  ]
}
