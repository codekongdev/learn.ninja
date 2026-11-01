import { CopyButton } from "@/components/site/copy-button"
import { AGENT_PROMPT } from "@/lib/site"

/** The "Copy prompt" button, for docs pages (`<CopyPrompt />`). */
export function CopyPrompt() {
  return (
    <div className="not-typeset my-6">
      <CopyButton text={AGENT_PROMPT} size="lg">
        Copy prompt
      </CopyButton>
    </div>
  )
}
