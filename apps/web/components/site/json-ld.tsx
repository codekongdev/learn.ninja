import type { JsonLd as Data } from "@/lib/json-ld"

/**
 * Structured data for the page, as search engines read it (see lib/json-ld.ts). A plain script tag,
 * not next/script: nothing runs. "<" is escaped so lesson text can't close the tag.
 */
export function JsonLd({ data }: { data: Data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
