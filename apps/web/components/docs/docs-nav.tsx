"use client"

import * as React from "react"
import { AnchorProvider, TOCItem, useActiveAnchor } from "fumadocs-core/toc"
import { MenuIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Sheet, SheetTitle } from "@workspace/ui/components/sheet"
import { cn } from "@workspace/ui/lib/utils"

/** A heading in a docs file, as a sidebar link. */
export type NavHeading = { title: string; id: string }
/** A docs file: a section of the one docs page, with its anchor. */
export type NavPage = {
  id: string
  name: string
  url: string
  headings: NavHeading[]
}
/** A sidebar section: a separator in docs/meta.json and the files after it. */
export type NavSection = { name: string; pages: NavPage[] }

/**
 * The docs sidebar for the one-page docs. Sections collapse to their name; the one being read opens
 * on its own, and a click opens or closes any of them. An open section lists its files as small labels
 * with each file's headings under them (or just the headings when it has one file), marking the
 * heading in view.
 */
export function DocsNav({
  sections,
  onNavigate,
}: {
  sections: NavSection[]
  onNavigate?: () => void
}) {
  const toc = sections.flatMap((section) =>
    section.pages.flatMap((page) => [
      { title: page.name, url: `#${page.id}`, depth: 2 },
      ...page.headings.map((h) => ({
        title: h.title,
        url: `#${h.id}`,
        depth: 3,
      })),
    ])
  )
  return (
    <AnchorProvider toc={toc} single>
      <NavSections sections={sections} onNavigate={onNavigate} />
    </AnchorProvider>
  )
}

function NavSections({
  sections,
  onNavigate,
}: {
  sections: NavSection[]
  onNavigate?: () => void
}) {
  const active = useActiveAnchor()
  const reading = sections.find((section) =>
    section.pages.some(
      (page) => page.id === active || page.headings.some((h) => h.id === active)
    )
  )?.name
  // Sections the reader opened or closed by hand, on top of the one being read.
  const [opened, setOpened] = React.useState<Set<string>>(() => new Set())
  const [closed, setClosed] = React.useState<Set<string>>(() => new Set())
  // Scrolling into another section starts over, so one section is open at a time, like an accordion.
  React.useEffect(() => {
    setOpened(new Set())
    setClosed(new Set())
  }, [reading])
  const isOpen = (name: string) =>
    (name === reading || opened.has(name)) && !closed.has(name)
  const toggle = (name: string) => {
    const open = isOpen(name)
    setOpened((s) => edit(s, name, !open))
    setClosed((s) => edit(s, name, open))
    return !open
  }

  return (
    <nav aria-label="Docs" className="-mt-0.5 flex flex-col gap-1 text-sm">
      {sections.map((section) => {
        const first = section.pages[0]
        if (!first) return null
        const open = isOpen(section.name)
        return (
          <div key={section.name}>
            {/* Opens the section and goes to it; a second click only closes it. */}
            <a
              href={`#${first.id}`}
              aria-expanded={open}
              onClick={(e) => {
                const nowOpen = toggle(section.name)
                if (!nowOpen) e.preventDefault()
                else onNavigate?.()
              }}
              className={cn(
                "block rounded-md px-3 py-1.5 font-medium text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                open && "bg-accent text-foreground"
              )}
            >
              {section.name}
            </a>
            {open ? (
              <div className="ms-3 mt-1 flex flex-col border-s ps-2">
                {section.pages.length === 1 ? (
                  <PageHeadings page={first} onNavigate={onNavigate} />
                ) : (
                  section.pages.map((page) => (
                    <div key={page.id} className="mt-2 first:mt-0">
                      <TOCItem
                        href={`#${page.id}`}
                        onClick={onNavigate}
                        className="block rounded-md px-2 pt-1 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[active=true]:text-foreground"
                      >
                        {page.name}
                      </TOCItem>
                      <PageHeadings page={page} onNavigate={onNavigate} />
                    </div>
                  ))
                )}
              </div>
            ) : null}
          </div>
        )
      })}
    </nav>
  )
}

function edit(set: Set<string>, name: string, add: boolean): Set<string> {
  if (set.has(name) === add) return set
  const next = new Set(set)
  if (add) next.add(name)
  else next.delete(name)
  return next
}

/** A file's headings, marking the one in view. */
function PageHeadings({
  page,
  onNavigate,
}: {
  page: NavPage
  onNavigate?: () => void
}) {
  if (page.headings.length === 0) return null
  return (
    <div className="flex flex-col">
      {page.headings.map((heading) => (
        <TOCItem
          key={heading.id}
          href={`#${heading.id}`}
          onClick={onNavigate}
          className="relative block rounded-md py-1 ps-3 pe-2 font-medium text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[active=true]:text-foreground data-[active=true]:before:absolute data-[active=true]:before:-start-[9px] data-[active=true]:before:top-1 data-[active=true]:before:h-5 data-[active=true]:before:w-px data-[active=true]:before:bg-foreground"
        >
          {heading.title}
        </TOCItem>
      ))}
    </div>
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
