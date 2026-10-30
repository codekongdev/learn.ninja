"use client"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"

import { logoMask } from "@/components/site/agent-logos"
import { SETUPS, type SetupId } from "@/lib/site"
import { setSetup, useSetup } from "@/lib/use-setup"

/** The CLI/MCP toggle, and with `agents` who each one is for. Shared by the hero and "Get started". */
export function SetupPicker({ agents = false }: { agents?: boolean }) {
  const setup = useSetup()

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <ToggleGroup
        aria-label="How your agent sets up learn.ninja"
        variant="outline"
        spacing={1}
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[setup]}
        onSelectionChange={(keys) => {
          const [next] = keys
          if (next !== undefined) setSetup(next as SetupId)
        }}
      >
        {Object.values(SETUPS).map((option) => (
          // Selected as other controls are: the toggle's own fill alone vanishes in dark mode.
          <ToggleGroupItem
            key={option.id}
            id={option.id}
            className="data-selected:border-primary"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {agents ? (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          For
          {SETUPS[setup].agents.map((agent) => (
            <span key={agent.name} className="flex items-center gap-0.5">
              <span
                role="img"
                aria-label={agent.name}
                title={agent.name}
                className="block size-4 bg-foreground/70"
                style={logoMask(agent.logo)}
              />
              ,
            </span>
          ))}
          and more.
        </p>
      ) : null}
    </div>
  )
}
