"use client"

import { Tooltip, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

import { logoMask } from "@/components/site/agent-logos"
import type { Agent } from "@/lib/origin"

/**
 * The agent a lesson was made with, in the byline right after its author: the muted logo from the
 * home page's set, with "Made with" and the agent's name on hover or focus.
 */
export function MadeWith({
  agent,
  className,
}: {
  agent: Agent
  className?: string
}) {
  return (
    <TooltipTrigger delay={300}>
      <span
        role="img"
        aria-label={`Made with ${agent.name}`}
        tabIndex={0}
        className={cn(
          "flex shrink-0 rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
      >
        <span
          aria-hidden="true"
          className="block size-3.5 bg-muted-foreground"
          style={logoMask(agent.logo)}
        />
      </span>
      <Tooltip>Made with {agent.name}</Tooltip>
    </TooltipTrigger>
  )
}
