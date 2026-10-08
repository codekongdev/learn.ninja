import { ButtonLink } from "@/components/site/button-link"
import { CopyButton } from "@/components/site/copy-button"
import { AGENT_PROMPT } from "@/lib/site"

export function GetStarted() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="flex flex-col items-center gap-6 rounded-xl bg-card px-6 py-16 text-center shadow-xs ring-1 ring-foreground/10">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Get started
        </h2>
        <p className="max-w-md text-base text-pretty text-muted-foreground sm:text-lg">
          Paste the prompt into your agent and finish the sentence with what you
          want to learn.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <CopyButton text={AGENT_PROMPT} size="lg">
            Copy prompt for agent
          </CopyButton>
          <ButtonLink href="/docs/install" variant="outline" size="lg">
            Install guide
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
