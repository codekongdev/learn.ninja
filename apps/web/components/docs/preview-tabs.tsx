"use client"

import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import { CopyButton } from "@/components/site/copy-button"

/** "Preview" and "JSON" tabs over a live brick, with a link to the whole lesson. */
export function PreviewTabs({
  preview,
  code,
  codeText,
  source,
}: {
  preview: React.ReactNode
  code: React.ReactNode
  codeText: string
  source: string
}) {
  return (
    <Tabs className="not-typeset my-6 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <TabsList variant="line">
          <TabsTrigger id="preview">Preview</TabsTrigger>
          <TabsTrigger id="json">JSON</TabsTrigger>
        </TabsList>
        <Link
          href={source}
          className="flex items-center gap-1 rounded-sm text-sm font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Play the whole lesson
          <ArrowUpRightIcon
            aria-hidden="true"
            className="size-4 rtl:-scale-x-100"
          />
        </Link>
      </div>
      <TabsContent
        id="preview"
        className="overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10"
      >
        {preview}
      </TabsContent>
      <TabsContent
        id="json"
        className="relative overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10"
      >
        <CopyButton
          text={codeText}
          variant="ghost"
          size="icon-sm"
          className="absolute end-2 top-2 z-10"
        />
        <div className="max-h-[32rem] overflow-auto p-4 font-mono text-sm [&_pre]:bg-transparent!">
          {code}
        </div>
      </TabsContent>
    </Tabs>
  )
}
