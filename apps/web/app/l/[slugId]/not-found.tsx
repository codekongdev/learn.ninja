import { ButtonLink } from "@/components/site/button-link"
import { Wordmark } from "@/components/site/wordmark"

/** An expired or unknown lesson link (HTTP 404). */
export default function LessonNotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-6 px-6">
      <Wordmark className="self-start" />
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold tracking-tight">
          This lesson isn&apos;t available
        </h1>
        <p className="text-muted-foreground">
          Lessons expire 24 hours after they&apos;re published. Ask whoever
          shared it to publish it again for a new link.
        </p>
      </div>
      <ButtonLink href="/" variant="outline" size="sm" className="self-start">
        Make your own
      </ButtonLink>
    </main>
  )
}
