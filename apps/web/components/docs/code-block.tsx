"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

/** A highlighted code block from the docs, with a copy button. */
export function CodeBlock({
  className,
  children,
  ...props
}: React.ComponentProps<"pre">) {
  const ref = React.useRef<HTMLPreElement>(null)
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(id)
  }, [copied])
  return (
    <div className="group/code relative">
      <pre ref={ref} className={cn(className, "pe-12")} {...props}>
        {children}
      </pre>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute end-2 top-2 bg-card/80 backdrop-blur-sm"
        onPress={async () => {
          await navigator.clipboard.writeText(ref.current?.textContent ?? "")
          setCopied(true)
        }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
    </div>
  )
}
