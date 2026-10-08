"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDocsSearch } from "fumadocs-core/search/client"
import { FileTextIcon, HashIcon, SearchIcon, TextIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { Dialog, DialogTitle } from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Kbd } from "@workspace/ui/components/kbd"
import { cn } from "@workspace/ui/lib/utils"

/**
 * The search box at the top of the docs sidebar, and the search dialog it opens.
 * `hotkeys` also opens it on ⌘K or /; turn it off for a second copy (the mobile menu).
 */
export function DocsSearch({
  hotkeys = true,
  onNavigate,
}: {
  hotkeys?: boolean
  /** Called after picking a result, e.g. to close the mobile menu. */
  onNavigate?: () => void
}) {
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    if (!hotkeys) return
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement &&
        (e.target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName))
      if (
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") ||
        (e.key === "/" && !typing)
      ) {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [hotkeys])
  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-between gap-2 px-2.5 font-normal text-muted-foreground"
        onPress={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <SearchIcon />
          Search docs…
        </span>
        <Kbd className="pointer-coarse:hidden">⌘K</Kbd>
      </Button>
      <Dialog
        isOpen={open}
        onOpenChange={setOpen}
        showCloseButton={false}
        className="top-24 translate-y-0 gap-0 p-0 sm:max-w-lg"
      >
        {open ? (
          <SearchPanel
            onClose={() => {
              setOpen(false)
              onNavigate?.()
            }}
          />
        ) : null}
      </Dialog>
    </>
  )
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const { search, setSearch, query } = useDocsSearch({
    type: "fetch",
    api: "/api/search",
  })
  const results = Array.isArray(query.data) ? query.data.slice(0, 12) : []
  const [selected, setSelected] = React.useState(0)
  React.useEffect(() => setSelected(0), [search])
  const go = (url: string) => {
    onClose()
    router.push(url)
  }
  return (
    <>
      <DialogTitle className="sr-only">Search docs</DialogTitle>
      <div className="flex items-center gap-2 border-b px-3">
        <SearchIcon
          aria-hidden="true"
          className="size-4 text-muted-foreground"
        />
        <Input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setSelected((s) => Math.min(s + 1, results.length - 1))
            } else if (e.key === "ArrowUp") {
              e.preventDefault()
              setSelected((s) => Math.max(s - 1, 0))
            } else if (e.key === "Enter" && results[selected]) {
              e.preventDefault()
              go(results[selected].url)
            }
          }}
          placeholder="Search docs…"
          aria-label="Search docs"
          className="h-12 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
      </div>
      <div className="max-h-[min(24rem,60svh)] overflow-y-auto p-2">
        {search && query.isLoading && results.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">
            Searching…
          </p>
        ) : search && results.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">
            No results for “{search}”
          </p>
        ) : !search ? (
          <p className="p-4 text-center text-sm text-muted-foreground">
            Search pages, headings, and text.
          </p>
        ) : (
          <ul
            role="listbox"
            aria-label="Results"
            className="flex flex-col gap-0.5"
          >
            {results.map((r, i) => {
              const Icon =
                r.type === "page"
                  ? FileTextIcon
                  : r.type === "heading"
                    ? HashIcon
                    : TextIcon
              return (
                <li key={r.id} role="option" aria-selected={i === selected}>
                  <Link
                    href={r.url}
                    onClick={onClose}
                    onMouseEnter={() => setSelected(i)}
                    className={cn(
                      "flex items-start gap-2.5 rounded-md px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                      i === selected && "bg-muted",
                      r.type !== "page" && "ps-8"
                    )}
                  >
                    <Icon
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    />
                    <span
                      className={cn(
                        "line-clamp-2 [&_mark]:bg-transparent [&_mark]:font-semibold [&_mark]:text-foreground",
                        r.type === "page"
                          ? "font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      {stripMarks(r.content)}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}

/** Results are Markdown with matches in <mark>; show matches bold and drop the Markdown syntax. */
function stripMarks(text: string): React.ReactNode {
  return text
    .replace(/\*\*|__|`/g, "")
    .split(/<mark>(.*?)<\/mark>/g)
    .map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))
}
