"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

/** Copies the page as Markdown, for pasting into an agent. */
export function CopyPage({ markdownUrl }: { markdownUrl: string }) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(id)
  }, [copied])
  return (
    <Button
      variant="outline"
      size="sm"
      onPress={async () => {
        const text = await fetch(markdownUrl).then((r) => r.text())
        await navigator.clipboard.writeText(text)
        setCopied(true)
      }}
    >
      {copied ? (
        <CheckIcon data-icon="inline-start" />
      ) : (
        <CopyIcon data-icon="inline-start" />
      )}
      {copied ? "Copied" : "Copy page"}
    </Button>
  )
}
