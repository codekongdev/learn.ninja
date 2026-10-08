import { DocsNav, MobileDocsNav } from "@/components/docs/docs-nav"
import { DocsSearch } from "@/components/docs/docs-search"
import { HeaderCopyPrompt } from "@/components/site/header-copy-prompt"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { source } from "@/lib/source"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tree = source.getPageTree()
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader
        start={<MobileDocsNav tree={tree} />}
        action={<HeaderCopyPrompt />}
      />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-10 px-4 sm:px-6">
        {/* Stays mounted on small screens too, so ⌘K and / open search everywhere. */}
        <aside className="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-56 shrink-0 flex-col gap-6 overflow-y-auto py-8 pe-2 [scrollbar-width:none] lg:flex [&::-webkit-scrollbar]:hidden">
          <DocsSearch />
          <DocsNav tree={tree} />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
      <SiteFooter />
    </div>
  )
}
