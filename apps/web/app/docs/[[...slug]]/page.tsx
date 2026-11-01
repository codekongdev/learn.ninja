import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { mdxComponents } from "@/components/docs/mdx-components"
import { JsonLd } from "@/components/site/json-ld"
import { docsPages, markdownPath } from "@/lib/docs-nav"
import { docsJsonLd } from "@/lib/json-ld"
import { source } from "@/lib/source"

// Each file in docs/ is a page of its own, at /docs/{path}, with its own title, description, and
// canonical URL, so search engines index and cite each one. Below the text, links to the pages
// before and after it in the sidebar's order.

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source.generateParams()
}

type Props = { params: Promise<{ slug?: string[] }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = source.getPage((await params).slug)
  if (!page) return {}
  return {
    title: page.url === "/docs" ? "Docs" : page.data.title,
    description: page.data.description,
    alternates: {
      canonical: page.url,
      types: { "text/markdown": markdownPath(page) },
    },
  }
}

export default async function DocsPage({ params }: Props) {
  const page = source.getPage((await params).slug)
  if (!page) notFound()
  const pages = docsPages()
  const at = pages.findIndex((p) => p.url === page.url)
  const previous = pages[at - 1]
  const next = pages[at + 1]
  const MDX = page.data.body
  return (
    <article className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-4 py-8 sm:py-10">
      <JsonLd
        data={docsJsonLd({
          title: page.data.title,
          description: page.data.description,
          url: page.url,
        })}
      />
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          {page.data.title}
        </h1>
        {page.data.description ? (
          <p className="text-base text-pretty text-muted-foreground">
            {page.data.description}
          </p>
        ) : null}
      </header>
      {/* Headings clear the sticky header when a sidebar link scrolls to them. */}
      <div className="typeset typeset-docs [&_:is(h2,h3,h4)]:scroll-mt-20">
        <MDX components={mdxComponents} />
      </div>
      <nav
        aria-label="Docs pages"
        className="mt-8 flex flex-wrap justify-between gap-4 border-t pt-6 text-sm"
      >
        {previous ? (
          <Link
            href={previous.url}
            rel="prev"
            className="flex items-center gap-1.5 rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ArrowLeftIcon className="size-4 rtl:-scale-x-100" aria-hidden />
            {previous.data.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={next.url}
            rel="next"
            className="flex items-center gap-1.5 rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {next.data.title}
            <ArrowRightIcon className="size-4 rtl:-scale-x-100" aria-hidden />
          </Link>
        ) : null}
      </nav>
    </article>
  )
}
