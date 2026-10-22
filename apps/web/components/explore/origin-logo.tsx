"use client"

import { Tooltip, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

import { logoMask } from "@/components/site/agent-logos"
import type { Agent } from "@/lib/origin"

/**
 * The muted logo of the agent a lesson was made with, from the home page's set, with its name on
 * hover or focus.
 */
export function OriginLogo({
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
          className="block size-4 bg-muted-foreground"
          style={logoMask(agent.logo)}
        />
      </span>
      <Tooltip>Made with {agent.name}</Tooltip>
    </TooltipTrigger>
  )
}
