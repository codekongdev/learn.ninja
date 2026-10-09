import type { Metadata } from "next"

import { CopyPage } from "@/components/docs/copy-page"
import { mdxComponents } from "@/components/docs/mdx-components"
import { docsPages, sectionId } from "@/lib/docs-nav"

export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Docs",
  description:
    "How to install the learn.ninja skill, the lesson format, and the API.",
  alternates: {
    canonical: "/docs",
    types: { "text/markdown": "/llms-full.txt" },
  },
}

/** The docs as one page: every file in docs/ is a section, reached from the sidebar by anchor. */
export default function DocsPage() {
  return (
    <div className="py-8 sm:py-10">
      <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-16">
        <div className="flex h-7 items-center justify-between gap-4">
          <h1 className="text-sm font-medium text-muted-foreground">
            learn.ninja docs
          </h1>
          <CopyPage markdownUrl="/llms-full.txt" />
        </div>
        {docsPages().map((page) => {
          const id = sectionId(page)
          const MDX = page.data.body
          return (
            <section
              key={id}
              id={id}
              aria-labelledby={`${id}-title`}
              className="flex scroll-mt-20 flex-col gap-4"
            >
              <header className="flex flex-col gap-2">
                <h2
                  id={`${id}-title`}
                  className="text-2xl font-semibold tracking-tight text-balance"
                >
                  {page.data.title}
                </h2>
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
            </section>
          )
        })}
      </div>
    </div>
  )
}
