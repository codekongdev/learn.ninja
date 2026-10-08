import type { MetadataRoute } from "next"

import { LESSON_SLUGS } from "@/lib/lessons"
import { SITE } from "@/lib/site"
import { source } from "@/lib/source"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url },
    ...source.getPages().map((p) => ({ url: SITE.url + p.url })),
    ...LESSON_SLUGS.map((slug) => ({ url: `${SITE.url}/lessons/${slug}` })),
    { url: `${SITE.url}/llms.txt` },
  ]
}
