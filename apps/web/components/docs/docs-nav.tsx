"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnchorProvider, TOCItem } from "fumadocs-core/toc"
import { MenuIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Sheet, SheetTitle } from "@workspace/ui/components/sheet"
import { cn } from "@workspace/ui/lib/utils"

/** A heading on a page, as a sidebar link. */
export type NavHeading = { title: string; id: string }
export type NavPage = { name: string; url: string; headings: NavHeading[] }
/** A section of the docs: a separator in meta.json and the pages after it. */
export type NavSection = { name: string; pages: NavPage[] }

/**
 * The docs sidebar. Sections collapse to their name until one of their pages is open; the open
 * section lists its pages as small labels with each page's headings under them (or just the
 * headings when it has one page), and the heading in view is marked.
 */
export function DocsNav({
  sections,
  onNavigate,
}: {
  sections: NavSection[]
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  return (
    <nav aria-label="Docs" className="flex flex-col gap-1 text-sm">
      {sections.map((section) => {
        const open = section.pages.some((page) => page.url === pathname)
        const first = section.pages[0]
        if (!first) return null
        return (
          <div key={section.name}>
            <Link
              href={first.url}
              onClick={onNavigate}
              aria-current={open ? "true" : undefined}
              className={cn(
                "block rounded-md px-3 py-1.5 font-medium text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                open && "bg-accent text-foreground"
              )}
            >
              {section.name}
            </Link>
            {open ? (
              <div className="ms-3 mt-1 flex flex-col border-s ps-2">
                {section.pages.length === 1 ? (
                  <PageHeadings
                    page={first}
                    active={first.url === pathname}
                    onNavigate={onNavigate}
                  />
                ) : (
                  section.pages.map((page) => {
                    const active = page.url === pathname
                    return (
                      <div key={page.url} className="mt-2 first:mt-0">
                        <Link
                          href={page.url}
                          onClick={onNavigate}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "block rounded-md px-2 pt-1 pb-1 text-[11px] font-semibold tracking-wide uppercase outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                            active
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {page.name}
                        </Link>
                        <PageHeadings
                          page={page}
                          active={active}
                          onNavigate={onNavigate}
                        />
                      </div>
                    )
                  })
                )}
              </div>
            ) : null}
          </div>
        )
      })}
    </nav>
  )
}

const HEADING_CLASS =
  "relative block rounded-md py-1 ps-3 pe-2 font-medium text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"

/** A page's headings. On the open page they follow the scroll position; elsewhere they're plain links. */
function PageHeadings({
  page,
  active,
  onNavigate,
}: {
  page: NavPage
  active: boolean
  onNavigate?: () => void
}) {
  if (page.headings.length === 0) return null
  if (!active)
    return (
      <div className="flex flex-col">
        {page.headings.map((heading) => (
          <Link
            key={heading.id}
            href={`${page.url}#${heading.id}`}
            onClick={onNavigate}
            className={HEADING_CLASS}
          >
            {heading.title}
          </Link>
        ))}
      </div>
    )
  return (
    <AnchorProvider
      toc={page.headings.map((heading) => ({
        title: heading.title,
        url: `#${heading.id}`,
        depth: 2,
      }))}
      single
    >
      <div className="flex flex-col">
        {page.headings.map((heading) => (
          <TOCItem
            key={heading.id}
            href={`#${heading.id}`}
            onClick={onNavigate}
            className={cn(
              HEADING_CLASS,
              "data-[active=true]:text-foreground data-[active=true]:before:absolute data-[active=true]:before:top-1 data-[active=true]:before:-start-[9px] data-[active=true]:before:h-5 data-[active=true]:before:w-px data-[active=true]:before:bg-foreground"
            )}
          >
            {heading.title}
          </TOCItem>
        ))}
      </div>
    </AnchorProvider>
  )
}

/** The sidebar in a sheet, for screens without room for it. */
export function MobileDocsNav({ sections }: { sections: NavSection[] }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Docs menu"
        className="lg:hidden"
        onPress={() => setOpen(true)}
      >
        <MenuIcon />
      </Button>
      <Sheet side="left" isOpen={open} onOpenChange={setOpen}>
        <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
          <SheetTitle className="px-3">Docs</SheetTitle>
          <DocsNav sections={sections} onNavigate={() => setOpen(false)} />
        </div>
      </Sheet>
    </>
  )
}
