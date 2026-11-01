import type { Lesson } from "@workspace/spec"

import { FAQ } from "@/lib/faq"
import { SITE } from "@/lib/site"

// Structured data (schema.org JSON-LD) for search engines and answer engines: what learn.ninja
// is, the questions people ask, each docs page, and each lesson as a learning resource.
// Rendered by <JsonLd> (components/site/json-ld.tsx).

export type JsonLd = Record<string, unknown>

const ORGANIZATION_ID = `${SITE.url}/#organization`
const WEBSITE_ID = `${SITE.url}/#website`

const organization: JsonLd = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/icon.svg`,
  sameAs: [SITE.repo, SITE.tiktokUrl, SITE.youtubeUrl, SITE.instagramUrl],
}

const website: JsonLd = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  publisher: { "@id": ORGANIZATION_ID },
}

const graph = (...items: JsonLd[]): JsonLd => ({
  "@context": "https://schema.org",
  "@graph": items,
})

/** The home page: the organization, the site, the product, and the FAQ. */
export function homeJsonLd(): JsonLd {
  return graph(
    organization,
    website,
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE.url}/#app`,
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      softwareHelp: { "@type": "CreativeWork", url: `${SITE.url}/docs` },
      publisher: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE.url}/#faq`,
      mainEntity: FAQ.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a.replace(/`/g, "") },
      })),
    }
  )
}

/** A docs page as an article, with its place under Docs. */
export function docsJsonLd(page: {
  title: string
  description?: string
  url: string
}): JsonLd {
  const url = `${SITE.url}${page.url}`
  const crumbs = [{ name: "Docs", item: `${SITE.url}/docs` }]
  if (page.url !== "/docs") crumbs.push({ name: page.title, item: url })
  return graph(
    {
      "@type": "TechArticle",
      "@id": `${url}#article`,
      headline: page.title,
      description: page.description,
      url,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE_ID },
      author: { "@id": ORGANIZATION_ID },
      publisher: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: c.item,
      })),
    },
    organization
  )
}

/** A lesson page as a learning resource: what it teaches, for whom, how long, and who made it. */
export function lessonJsonLd({
  lesson,
  path,
  author,
  publishedAt,
  updatedAt,
}: {
  lesson: Lesson
  path: string
  /** The maker's handle; the site itself when there's none (the bundled lessons). */
  author?: string | null
  publishedAt?: number
  updatedAt?: number
}): JsonLd {
  const url = `${SITE.url}${path}`
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "@id": `${url}#lesson`,
    name: lesson.title,
    description: lesson.summary,
    url,
    inLanguage: lesson.language,
    learningResourceType: "Interactive lesson",
    educationalLevel: lesson.level,
    interactivityType: "active",
    timeRequired: `PT${lesson.estimatedMinutes}M`,
    teaches: lesson.objective,
    keywords: lesson.tags.join(", "),
    isAccessibleForFree: true,
    ...(lesson.source?.url
      ? { isBasedOn: { "@type": "CreativeWork", name: lesson.source.title, url: lesson.source.url } }
      : lesson.source
        ? { isBasedOn: { "@type": "CreativeWork", name: lesson.source.title } }
        : {}),
    author: author
      ? { "@type": "Person", name: `@${author}`, url: `${SITE.url}/u/${author}` }
      : { "@id": ORGANIZATION_ID },
    publisher: organization,
    ...(publishedAt ? { datePublished: new Date(publishedAt).toISOString() } : {}),
    ...(updatedAt ? { dateModified: new Date(updatedAt).toISOString() } : {}),
  }
}
