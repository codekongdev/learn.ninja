import { ButtonLink } from "@/components/site/button-link"
import { Wordmark } from "@/components/site/wordmark"

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center gap-6 px-6">
      <Wordmark className="self-start" />
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">
          There&apos;s nothing at this address.
        </p>
      </div>
      <ButtonLink href="/" variant="outline" size="sm" className="self-start">
        Go home
      </ButtonLink>
    </main>
  )
}
