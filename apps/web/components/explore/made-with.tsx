import { cn } from "@workspace/ui/lib/utils"

import { logoMask } from "@/components/site/agent-logos"
import type { Agent } from "@/lib/origin"

/**
 * The agent a lesson was made with, in the byline after its author: the muted logo from the home
 * page's set and the agent's name, which is cut short before the author's handle is.
 */
export function MadeWith({
  agent,
  className,
}: {
  agent: Agent
  className?: string
}) {
  return (
    <span className={cn("flex min-w-0 items-center gap-1", className)}>
      <span
        aria-hidden="true"
        className="block size-3.5 shrink-0 bg-muted-foreground"
        style={logoMask(agent.logo)}
      />
      <span className="min-w-0 truncate">
        <span className="sr-only">Made with </span>
        {agent.name}
      </span>
    </span>
  )
}
