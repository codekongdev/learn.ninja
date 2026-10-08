"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

type ButtonProps = React.ComponentProps<typeof Button>

/** Copies `text` and confirms for a moment. Shows `children` as the label, or an icon only. */
export function CopyButton({
  text,
  children,
  copiedLabel = "Copied",
  ...props
}: Omit<ButtonProps, "children" | "onPress"> & {
  text: string
  children?: React.ReactNode
  copiedLabel?: string
}) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(id)
  }, [copied])
  const Icon = copied ? CheckIcon : CopyIcon
  return (
    <Button
      {...props}
      aria-label={children ? undefined : copied ? copiedLabel : "Copy"}
      onPress={async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
      }}
    >
      {children ? (copied ? copiedLabel : children) : null}
      <Icon data-icon="inline-end" />
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </Button>
  )
}
