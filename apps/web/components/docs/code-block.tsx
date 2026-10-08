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
      {/* Centered on the first line of code: pre text is 0.875em with 1.5 leading and 0.75em padding.
          The block's own background hides code that scrolls underneath. */}
      <div className="absolute end-0 top-[calc(1.3125em-1rem)] rounded-md bg-muted pe-1.5">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={copied ? "Copied" : "Copy code"}
          className="text-muted-foreground hover:bg-foreground/10 dark:hover:bg-foreground/10"
          onPress={async () => {
            await navigator.clipboard.writeText(ref.current?.textContent ?? "")
            setCopied(true)
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </Button>
      </div>
    </div>
  )
}
