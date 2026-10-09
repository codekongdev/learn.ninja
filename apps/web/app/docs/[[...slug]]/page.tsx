import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { findNeighbour } from "fumadocs-core/page-tree"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { CopyPage } from "@/components/docs/copy-page"
import { mdxComponents } from "@/components/docs/mdx-components"
import { ButtonLink } from "@/components/site/button-link"
import { DOCS_EDIT_BASE } from "@/lib/site"
import { source } from "@/lib/source"

/** "Edit on GitHub" only helps once the repo is public; until then it 404s for most people. */
const SHOW_EDIT_LINK = false

export const dynamic = "force-static"
export const dynamicParams = false

type Props = { params: Promise<{ slug?: string[] }> }

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = source.getPage((await params).slug)
  if (!page) notFound()
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: page.url,
      types: { "text/markdown": markdownUrl(page.url) },
    },
  }
}

export default async function DocsPage({ params }: Props) {
  const page = source.getPage((await params).slug)
  if (!page) notFound()
  const MDX = page.data.body
  const { previous, next } = findNeighbour(source.getPageTree(), page.url)
  return (
    <div className="py-8 sm:py-10">
      <article className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-8">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-balance">
              {page.data.title}
            </h1>
            <CopyPage markdownUrl={markdownUrl(page.url)} />
          </div>
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
        <footer className="flex flex-col gap-6 border-t pt-6">
          {SHOW_EDIT_LINK ? (
            <a
              href={DOCS_EDIT_BASE + page.path}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Edit this page on GitHub
            </a>
          ) : null}
          <nav
            aria-label="Previous and next"
            className="flex justify-between gap-2"
          >
            {previous ? (
              <ButtonLink href={previous.url} variant="outline" size="sm">
                <ArrowLeftIcon
                  data-icon="inline-start"
                  className="rtl:-scale-x-100"
                />
                {previous.name}
              </ButtonLink>
            ) : (
              <span />
            )}
            {next ? (
              <ButtonLink href={next.url} variant="outline" size="sm">
                {next.name}
                <ArrowRightIcon
                  data-icon="inline-end"
                  className="rtl:-scale-x-100"
                />
              </ButtonLink>
            ) : null}
          </nav>
        </footer>
      </article>
    </div>
  )
}

/** /docs → /docs.md, /docs/install → /docs/install.md */
function markdownUrl(url: string) {
  return `${url}.md`
}
