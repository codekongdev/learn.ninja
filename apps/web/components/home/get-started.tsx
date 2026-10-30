"use client"

import Link from "next/link"

import { Separator } from "@workspace/ui/components/separator"

import { CopyButton } from "@/components/site/copy-button"
import { SETUPS } from "@/lib/site"
import { useSetup } from "@/lib/use-setup"

import { SetupPicker } from "./setup-picker"

const GUIDES = {
  cli: { href: "/docs#install", link: "Install guide" },
  mcp: { href: "/docs#mcp", link: "How to connect" },
}

export function GetStarted() {
  const setup = useSetup()
  const guide = GUIDES[setup]

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-20 px-4 sm:gap-28 sm:px-6">
      <Separator />
      <div className="flex flex-col items-start gap-6">
        <SetupPicker />
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Get started
          </h2>
          <p className="max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
            Copy the prompt, paste it into your agent, and finish it with what
            you want to learn.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <CopyButton text={SETUPS[setup].prompt} size="lg">
            Copy prompt for agent
          </CopyButton>
          <Link
            href={guide.href}
            className="text-sm text-muted-foreground underline underline-offset-3 hover:text-foreground"
          >
            {guide.link}
          </Link>
        </div>
      </div>
      <Separator />
    </section>
  )
}
