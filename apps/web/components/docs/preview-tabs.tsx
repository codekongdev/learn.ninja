"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

import { CopyButton } from "@/components/site/copy-button"

/** "Preview" and "JSON" tabs over a live brick. */
export function PreviewTabs({
  preview,
  code,
  codeText,
}: {
  preview: React.ReactNode
  code: React.ReactNode
  codeText: string
}) {
  return (
    <Tabs className="not-typeset my-6 flex flex-col gap-2">
      <TabsList variant="line">
        <TabsTrigger id="preview">Preview</TabsTrigger>
        <TabsTrigger id="json">JSON</TabsTrigger>
      </TabsList>
      <TabsContent id="preview" className="overflow-hidden rounded-2xl border">
        {preview}
      </TabsContent>
      <TabsContent
        id="json"
        className="relative overflow-hidden rounded-2xl border"
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
