import type { MetadataRoute } from "next"

import { SITE } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    // Published lessons are personal and short-lived, so their pages say noindex. They aren't
    // disallowed here: X's crawler obeys robots.txt and would show no card for a shared link.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  }
}
