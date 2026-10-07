import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Docs · Learn",
  description: "How Learn lessons work.",
}

export default function DocsPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col gap-8 px-4 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">How Learn works</h1>
        <p className="text-muted-foreground">
          Each lesson is one short, interactive session made by your own AI
          agent and shared as a link.
        </p>
      </header>
      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">What&apos;s in a lesson</h2>
        <p className="text-muted-foreground">
          5 to 10 minutes: a warm-up question, one to three short concepts each
          followed by practice, a final challenge, and a wrap-up with the key
          takeaways. Practice mixes multiple choice, comparing, sorting,
          ordering, matching, filling gaps, tapping the right spot, and
          scenarios. Theory, in the top corner, brings back the concepts
          you&apos;ve seen so far.
        </p>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Links and privacy</h2>
        <p className="text-muted-foreground">
          There are no accounts. A lesson is kept for 24 hours after it&apos;s
          published, then its link stops working. Progress isn&apos;t saved, so
          reloading starts the lesson again.
        </p>
      </section>
      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-muted-foreground">
          Text size, theme, and language are at the bottom of every lesson.
          They&apos;re saved in your browser only.
        </p>
      </section>
      <p className="text-sm text-muted-foreground">
        <Link href="/create" className="underline underline-offset-4">
          Create a lesson
        </Link>
      </p>
    </main>
  )
}
