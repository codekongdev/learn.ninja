import { AgentLogos } from "@/components/site/agent-logos"
import { CopyButton } from "@/components/site/copy-button"
import { AGENT_PROMPT, HERO_CTA_ID } from "@/lib/site"

export function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-16 px-4 py-20 sm:px-6 sm:py-28">
      <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl sm:leading-[1.05]">
          Interactive{" "}
          <span className="rounded-lg bg-muted px-2 ring-1 ring-foreground/10">
            learning
          </span>{" "}
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
