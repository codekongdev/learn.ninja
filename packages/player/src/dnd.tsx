"use client"

// The one module allowed to use react-aria-components directly (see CLAUDE.md):
// accessible drag and drop for sort and order, by mouse, touch, keyboard, and screen reader.

import * as React from "react"
import {
  Button as AriaButton,
  GridList,
  GridListItem,
  isTextDropItem,
  useDragAndDrop,
  type DropItem,
  type Key,
} from "react-aria-components"
import { GripVerticalIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

import type { Mark } from "./check"

const MIME = "application/x-learn-item"

export interface DropZoneItem {
  id: string
  /** Plain text for screen readers and drag previews. */
  textValue: string
  content: React.ReactNode
  lang?: string
  mark?: Mark
}

export interface DropZoneProps {
  zoneId: string
  label: string
  items: DropZoneItem[]
  emptyText: string
  /** Move an item (possibly from another zone) to an index in this zone. */
  onMove: (itemId: string, zoneId: string, index: number) => void
  layout?: "stack" | "grid"
  disabled?: boolean
  className?: string
}

async function readIds(items: DropItem[]): Promise<string[]> {
  return Promise.all(items.filter(isTextDropItem).map((i) => i.getText(MIME)))
}

export function DropZone({
  zoneId,
  label,
  items,
  emptyText,
  onMove,
  layout = "stack",
  disabled,
  className,
}: DropZoneProps) {
  const indexOf = (key: Key) => items.findIndex((i) => i.id === key)
  const { dragAndDropHooks } = useDragAndDrop({
    // Always pass the hooks and disable them here: swapping them for undefined changes React Aria's hook order.
    isDisabled: disabled,
    getItems: (keys) =>
      [...keys].map((key) => {
        const item = items.find((i) => i.id === key)
        return {
          [MIME]: String(key),
          "text/plain": item?.textValue ?? String(key),
        }
      }),
    acceptedDragTypes: [MIME],
    getDropOperation: () => "move",
    async onInsert(e) {
      const ids = await readIds(e.items)
      const at =
        indexOf(e.target.key) + (e.target.dropPosition === "after" ? 1 : 0)
      ids.forEach((id, n) => onMove(id, zoneId, at + n))
    },
    async onRootDrop(e) {
      const ids = await readIds(e.items)
      ids.forEach((id, n) => onMove(id, zoneId, items.length + n))
    },
    onReorder(e) {
      const target = indexOf(e.target.key)
      const moving = [...e.keys].map(String)
      // Index among the remaining items, so moving down by one lands in the right place.
      const remaining = items.filter((i) => !moving.includes(i.id))
      const anchor = remaining.findIndex((i) => i.id === e.target.key)
      const at =
        (anchor === -1 ? target : anchor) +
        (e.target.dropPosition === "after" ? 1 : 0)
      moving.forEach((id, n) => onMove(id, zoneId, at + n))
    },
  })

  return (
    <GridList
      aria-label={label}
      items={items}
      layout={layout}
      dragAndDropHooks={dragAndDropHooks}
      renderEmptyState={() => (
        <div className="px-3 py-3 text-sm text-muted-foreground">
          {emptyText}
        </div>
      )}
      className={cn(
        layout === "grid" ? "flex flex-wrap gap-2" : "flex flex-col gap-2",
        "min-h-14 rounded-lg border border-dashed p-2 outline-none",
        "data-drop-target:border-primary data-drop-target:bg-primary/5 data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50",
        className
      )}
    >
      {(item) => (
        <GridListItem
          id={item.id}
          textValue={item.textValue}
          data-status={item.mark}
          className={cn(
            "flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-base shadow-xs outline-none dark:bg-input/30",
            !disabled && "cursor-grab",
            "data-dragging:opacity-50 data-focus-visible:ring-[3px] data-focus-visible:ring-ring/50",
            "data-[status=correct]:border-green-600 data-[status=correct]:bg-green-600/10",
            "data-[status=wrong]:border-yellow-500 data-[status=wrong]:bg-yellow-500/10"
          )}
        >
          {!disabled && (
            <AriaButton
              slot="drag"
              className="rounded text-muted-foreground outline-none data-focus-visible:ring-2 data-focus-visible:ring-ring"
            >
              <GripVerticalIcon className="size-4" />
            </AriaButton>
          )}
          <span lang={item.lang} className="min-w-0 flex-1">
            {item.content}
          </span>
        </GridListItem>
      )}
    </GridList>
  )
}
