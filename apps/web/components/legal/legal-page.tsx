import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

/** The frame for the Privacy and Terms pages: a title, when it last changed, and the text as prose. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  /** An ISO date (YYYY-MM-DD). */
  updated: string
  children: React.ReactNode
}) {
  const date = new Date(`${updated}T00:00:00Z`).toLocaleDateString("en", {
    dateStyle: "long",
    timeZone: "UTC",
  })
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="text-base text-muted-foreground">
            Last updated <time dateTime={updated}>{date}</time>
          </p>
        </div>
        <div className="typeset typeset-docs">{children}</div>
      </main>
      <SiteFooter className="max-w-3xl" />
    </div>
  )
}
