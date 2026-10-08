"use client"

import { AnchorProvider, TOCItem, type TOCItemType } from "fumadocs-core/toc"

import { cn } from "@workspace/ui/lib/utils"

/** "On this page", highlighting the section in view. */
export function DocsToc({ toc }: { toc: TOCItemType[] }) {
  if (toc.length === 0) return null
  return (
    <AnchorProvider toc={toc} single>
      <div className="flex flex-col gap-2 text-sm">
        <p className="font-medium">On this page</p>
        <ul className="flex flex-col gap-1.5">
          {toc.map((item) => (
            <li key={item.url}>
              <TOCItem
                href={item.url}
                className={cn(
                  "block rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-[active=true]:font-medium data-[active=true]:text-foreground",
                  item.depth > 2 && "ps-3"
                )}
              >
                {item.title}
              </TOCItem>
            </li>
          ))}
        </ul>
      </div>
    </AnchorProvider>
  )
}
