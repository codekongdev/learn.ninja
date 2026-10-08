import type { Metadata } from "next"
import Link from "next/link"

import { Card, CardContent } from "@workspace/ui/components/card"

export const metadata: Metadata = {
  title: "Create a lesson · Learn",
  description:
    "Turn anything into a short interactive lesson with your AI agent.",
}

const INSTALL = "npx skills add cmicpace/learn --skill learn -g"

export default function CreatePage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col gap-8 px-4 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Create a lesson</h1>
        <p className="text-muted-foreground">
          Give your AI agent anything (an article, notes, code, or just a topic)
          and it turns it into a short interactive lesson you can share.
        </p>
      </header>
      <ol className="grid grid-cols-[minmax(0,1fr)] gap-3">
        <li>
          <Card>
            <CardContent className="gap-2">
              <h2 className="font-semibold">1. Install the lesson skill</h2>
              <p className="text-muted-foreground">
                Works with Claude Code, Cursor, Codex, and other agents that
                support skills.
              </p>
              <pre className="overflow-x-auto rounded-md border bg-muted px-3 py-2 font-mono text-sm">
                {INSTALL}
              </pre>
            </CardContent>
          </Card>
        </li>
        <li>
          <Card>
            <CardContent className="gap-2">
              <h2 className="font-semibold">2. Ask for a lesson</h2>
              <p className="text-muted-foreground">
                For example: &ldquo;Make a lesson from this article&rdquo; or
                &ldquo;Teach me how map differs from forEach.&rdquo;
              </p>
            </CardContent>
          </Card>
        </li>
        <li>
          <Card>
            <CardContent className="gap-2">
              <h2 className="font-semibold">3. Share the link</h2>
              <p className="text-muted-foreground">
                Your agent publishes the lesson and gives you a link anyone can
                open. Links expire 24 hours after they&apos;re published.
              </p>
            </CardContent>
          </Card>
        </li>
      </ol>
      <p className="text-sm text-muted-foreground">
        <Link href="/docs" className="underline underline-offset-4">
          How lessons work
        </Link>
      </p>
    </main>
  )
}
