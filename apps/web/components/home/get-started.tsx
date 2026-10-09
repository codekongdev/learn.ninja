import { ButtonLink } from "@/components/site/button-link"
import { CopyButton } from "@/components/site/copy-button"
import { LogoDivider } from "@/components/site/logo-divider"
import { AGENT_PROMPT } from "@/lib/site"

export function GetStarted() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-20 px-4 sm:gap-28 sm:px-6">
      <LogoDivider />
      <div className="flex flex-col items-center gap-6 text-center">
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
