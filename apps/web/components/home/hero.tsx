import { AgentLogos } from "@/components/site/agent-logos"
import { CopyButton } from "@/components/site/copy-button"
import { AGENT_PROMPT, HERO_CTA_ID } from "@/lib/site"

import { RotatingWord } from "./rotating-word"

const TOPICS = ["design", "coding", "data", "math", "science", "history"]

export function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-24 px-4 py-20 sm:px-6 sm:py-28">
      <div className="flex w-full flex-col items-start gap-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.05]">
          Vibe learn <span className="sr-only">anything</span>
          <span aria-hidden="true">
            <RotatingWord words={TOPICS} />
          </span>
          <br />
          with your agent
        </h1>
        <p className="max-w-xl text-base text-pretty text-muted-foreground sm:text-lg">
          Give your agent an article, notes, docs, a transcript, or code. It
          writes one short lesson you play in the browser, and gives you a link
          to share. Free, no account.
        </p>
        <CopyButton id={HERO_CTA_ID} text={AGENT_PROMPT} size="lg">
          Copy prompt for agent
        </CopyButton>
      </div>
      <AgentLogos />
    </section>
  )
}
