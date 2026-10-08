import { CheckIcon, LockIcon } from "lucide-react"

import { LearnLogo, LessonPlayer, type Prepared } from "@workspace/player"
import type { Lesson } from "@workspace/spec"

import { Section } from "./section"

const LINK = "learn.ninja/l/how-compound-interest-works-k3x9a2mq"

/** A chat asking for a lesson, and the lesson it made, playable. */
export function Demo({
  lesson,
  prepared,
}: {
  lesson: Lesson
  prepared: Prepared
}) {
  return (
    <Section
      wide
      eyebrow="How it works"
      title="Ask for a lesson. Get a link."
      intro="Your agent picks the one idea worth teaching, writes the lesson, checks it, and publishes it. Try the question below."
    >
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Chat />
        <div className="flex min-w-0 flex-col overflow-hidden rounded-xl bg-muted/50 ring-1 ring-foreground/10">
          <div className="flex items-center gap-2 border-b px-3 py-2">
            {/* macOS's traffic lights, as an illustration: the one place fixed colours are right. */}
            <div aria-hidden="true" className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="mx-auto flex min-w-0 items-center gap-1.5 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground shadow-xs ring-1 ring-foreground/5">
              <LockIcon aria-hidden="true" className="size-3 shrink-0" />
              <span className="truncate">{LINK}</span>
            </div>
          </div>
          {/* The real player's window, opened on a question: no header or footer, no scrolling, no text
              selection. Shortcuts stay inside it; the page has other demos. */}
          <div className="h-[560px] min-h-0 p-3 select-none sm:p-4 [&_main]:overflow-hidden">
            <LessonPlayer
              lesson={lesson}
              prepared={prepared}
              uiLanguage={lesson.language}
              startAt="p5"
              scopeKeys
              chrome={false}
            />
          </div>
        </div>
      </div>
    </Section>
  )
}

function Chat() {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-card p-4 shadow-xs ring-1 ring-foreground/10 sm:p-6">
      <div className="ms-auto max-w-[85%] rounded-xl rounded-ee-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
        Make me a lesson from this article on compound interest
      </div>
      <div className="flex flex-col gap-3 text-sm">
        <ul className="flex flex-col gap-1.5 text-muted-foreground">
          {[
            "Picked the core idea: interest on interest",
            "Wrote 2 concepts and 6 questions",
            "Checked the lesson",
          ].map((step) => (
            <li key={step} className="flex items-center gap-2">
              <CheckIcon
                aria-hidden="true"
                className="size-4 shrink-0 text-green-600 dark:text-green-500"
              />
              {step}
            </li>
          ))}
        </ul>
        <p>Your lesson is live:</p>
        <div className="flex items-center gap-3 rounded-lg border bg-background p-3 shadow-xs dark:bg-input/30">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-muted">
            <LearnLogo className="size-5" />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="font-medium">How compound interest works</span>
            <span className="truncate text-xs text-muted-foreground">
              {LINK}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
