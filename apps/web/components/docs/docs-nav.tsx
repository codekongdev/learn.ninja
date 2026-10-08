"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Node, Root } from "fumadocs-core/page-tree"
import { MenuIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Sheet, SheetTitle } from "@workspace/ui/components/sheet"
import { cn } from "@workspace/ui/lib/utils"

import { DocsSearch } from "./docs-search"

/** The docs sidebar: separators become section headings, pages become links. */
export function DocsNav({
  tree,
  onNavigate,
}: {
  tree: Root
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  return (
    <nav aria-label="Docs" className="flex flex-col gap-0.5 text-sm">
      {tree.children.map((node, i) => (
        <NavNode
          key={node.$id ?? i}
          node={node}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  )
}

function NavNode({
  node,
  pathname,
  onNavigate,
}: {
  node: Node
  pathname: string
  onNavigate?: () => void
}) {
  if (node.type === "separator")
    return (
      <p className="px-2 pt-6 pb-1.5 text-xs font-medium text-muted-foreground first:pt-0">
        {node.name}
      </p>
    )
  if (node.type === "folder")
    return (
      <>
        {node.index ? (
          <NavNode
            node={node.index}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ) : null}
        {node.children.map((child, i) => (
          <NavNode
            key={child.$id ?? i}
            node={child}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </>
    )
  const active = pathname === node.url
  return (
    <Link
      href={node.url}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-8 items-center rounded-md px-2 font-medium text-foreground/80 outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
        active && "bg-muted text-foreground"
      )}
    >
      {node.name}
    </Link>
  )
}

/** The sidebar in a sheet, for screens without room for it. */
export function MobileDocsNav({ tree }: { tree: Root }) {
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
          <SheetTitle className="px-2">Docs</SheetTitle>
          <DocsSearch hotkeys={false} onNavigate={() => setOpen(false)} />
          <DocsNav tree={tree} onNavigate={() => setOpen(false)} />
        </div>
      </Sheet>
    </>
  )
}
