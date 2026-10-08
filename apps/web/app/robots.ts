import type { MetadataRoute } from "next"

import { SITE } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    // Published lessons are personal and short-lived; keep them out of search results.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/l/", "/api/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  }
}
