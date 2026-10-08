"use client"

import Link from "next/link"

import { BrickDemo, type Prepared } from "@workspace/player"
import type { Brick, Lesson } from "@workspace/spec"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import { BrickIcon } from "./brick-icons"

export interface BrickTab {
  type: Brick["type"]
  label: string
  blurb: string
  lesson: Lesson
  prepared: Prepared
  brickId: string
}

/** One tile per brick type; the chosen one plays below as a real brick from an example lesson. */
export function BrickTabs({ tabs }: { tabs: BrickTab[] }) {
  return (
    <Tabs defaultSelectedKey={tabs[0]!.type} className="flex flex-col gap-8">
      <TabsList
        variant="line"
        aria-label="Brick types"
        // The tabs base sets a 32px height for horizontal lists; the tiles need their own.
        className="grid h-auto w-full grid-cols-4 gap-2 p-0 group-data-horizontal/tabs:h-auto sm:gap-3 lg:grid-cols-8"
      >
        {tabs.map((t) => (
          <TabsTrigger
            key={t.type}
            id={t.type}
            className="flex h-auto flex-col gap-2 rounded-xl border border-transparent bg-card px-2 py-4 text-xs font-medium text-muted-foreground shadow-xs ring-1 ring-foreground/10 after:hidden hover:bg-muted/50 hover:text-foreground sm:text-sm dark:text-muted-foreground data-selected:border-primary data-selected:bg-muted data-selected:text-foreground data-selected:ring-primary dark:data-selected:border-primary dark:data-selected:bg-muted dark:data-selected:text-foreground"
          >
            <BrickIcon type={t.type} className="size-7" />
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent
          key={t.type}
          id={t.type}
          className="mx-auto flex w-full max-w-3xl flex-col gap-4"
        >
          <BrickDemo
            lesson={t.lesson}
            brickId={t.brickId}
            prepared={t.prepared}
          />
          <p className="text-center text-sm text-muted-foreground">
            {t.blurb}{" "}
            <Link
              href={`/docs/bricks/${t.type}`}
              className="font-medium text-foreground underline underline-offset-4"
            >
              How {t.label.toLowerCase()} bricks work
            </Link>
          </p>
        </TabsContent>
      ))}
    </Tabs>
  )
}
