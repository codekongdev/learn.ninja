"use client"

import Link from "next/link"

import { BrickDemo, type Prepared } from "@workspace/player"
import type { Lesson } from "@workspace/spec"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

export interface BrickTab {
  type: string
  label: string
  blurb: string
  lesson: Lesson
  prepared: Prepared
  brickId: string
}

/** One tab per brick type, each a real brick from an example lesson. */
export function BrickTabs({ tabs }: { tabs: BrickTab[] }) {
  return (
    <Tabs defaultSelectedKey={tabs[0]!.type} className="flex flex-col gap-6">
      <div className="-mx-4 flex overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <TabsList className="mx-auto">
          {tabs.map((t) => (
            <TabsTrigger key={t.type} id={t.type}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabs.map((t) => (
        <TabsContent
          key={t.type}
          id={t.type}
          className="mx-auto flex w-full max-w-3xl flex-col gap-4"
        >
          <p className="text-center text-sm text-muted-foreground">
            {t.blurb}{" "}
            <Link
              href={`/docs/bricks/${t.type}`}
              className="font-medium text-foreground underline underline-offset-4"
            >
              How {t.label.toLowerCase()} bricks work
            </Link>
          </p>
          <BrickDemo
            lesson={t.lesson}
            brickId={t.brickId}
            prepared={t.prepared}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
