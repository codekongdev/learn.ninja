import {
  ArrowRightIcon,
  CodeIcon,
  FileTextIcon,
  LanguagesIcon,
  LightbulbIcon,
  MessageSquareIcon,
  NotebookPenIcon,
  PencilIcon,
  ShapesIcon,
} from "lucide-react"

import { XIcon } from "lucide-react"

import type { Prepared } from "@workspace/player"
import type { Lesson } from "@workspace/spec"
import { Badge } from "@workspace/ui/components/badge"
import { Kbd } from "@workspace/ui/components/kbd"

import { AgentPrompts, Eyebrow } from "./section"

const POINTS = [
  { icon: LightbulbIcon, title: "Every answer explained" },
  { icon: ShapesIcon, title: "Visuals, formulas, code" },
  { icon: LanguagesIcon, title: "Any language" },
  { icon: PencilIcon, title: "Edit by asking" },
]

/** Four selling points under the brick tiles: an icon and a few words each. */
export function Points() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-xl bg-border ring-1 ring-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
      {POINTS.map(({ icon: Icon, title }) => (
        <li
          key={title}
          className="flex items-center gap-3 bg-card px-5 py-4 text-sm font-medium"
        >
          <Icon aria-hidden="true" className="size-5 text-muted-foreground" />
          {title}
        </li>
      ))}
    </ul>
  )
}

/** "Every wrong answer teaches": the moment after a miss, zoomed in. The copy comes from a real lesson. */
export function WrongAnswers({
  lesson,
}: {
  lesson: Lesson
  prepared?: Prepared
}) {
  const brick = lesson.bricks.find((b) => b.id === "p1")
  const option =
    brick?.type === "choice"
      ? brick.options.find((o) => o.id === "b" && o.feedback)
      : undefined
  return (
    <section className="mx-auto grid w-full max-w-5xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Every wrong answer teaches
          </h2>
          <p className="text-base text-pretty text-muted-foreground sm:text-lg">
            Your agent builds wrong options from real, common mistakes, and
            writes what each one gets wrong. You learn from the miss, then try
            again.
          </p>
        </div>
        <AgentPrompts
          prompts={[
            "Make it harder",
            "Add a question about secondary buttons",
            "Make it shorter",
          ]}
        />
      </div>
      <div
        aria-hidden="true"
        className="relative mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl bg-muted/40 p-6 sm:p-10"
      >
        <div
          data-status="wrong"
          className="flex min-h-14 items-center gap-3 rounded-lg border border-yellow-500 bg-yellow-500/10 px-5 py-4 text-base font-medium shadow-xs"
        >
          {option?.text}
          <Kbd className="ms-auto shrink-0 bg-yellow-500 text-yellow-950">
            <XIcon />
          </Kbd>
        </div>
        <div className="w-fit max-w-sm rounded-xl border border-yellow-500 bg-yellow-100 px-5 py-4 text-base font-semibold text-yellow-900 shadow-xs dark:border-yellow-600 dark:bg-yellow-950 dark:text-yellow-100">
          {option?.feedback}
        </div>
      </div>
    </section>
  )
}

const INPUTS = [
  { icon: FileTextIcon, label: "An article" },
  { icon: NotebookPenIcon, label: "Your notes" },
  { icon: MessageSquareIcon, label: "A meeting transcript" },
  { icon: CodeIcon, label: "Some code" },
  { icon: LightbulbIcon, label: "Just a topic" },
]

/** "From anything you're reading": inputs on one side, a lesson's intro on the other. */
export function FromAnything({ lesson }: { lesson: Lesson }) {
  return (
    <section className="mx-auto grid w-full max-w-5xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col gap-6 lg:order-2">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            From anything you’re reading
          </h2>
          <p className="text-base text-pretty text-muted-foreground sm:text-lg">
            Hand your agent whatever you’re working through. It finds the one
            idea worth learning, and suggests the rest as follow-up lessons.
          </p>
        </div>
        <AgentPrompts
          prompts={[
            "Make a lesson from this article",
            "Quiz me on this meeting transcript",
            "Teach my team how this code works",
          ]}
        />
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row lg:order-1">
        <ul className="flex w-full flex-col gap-2 sm:w-auto">
          {INPUTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 rounded-md border bg-background px-3 py-2 text-sm font-medium shadow-xs dark:bg-input/30"
            >
              <Icon
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              {label}
            </li>
          ))}
        </ul>
        <ArrowRightIcon
          aria-hidden="true"
          className="size-5 shrink-0 text-muted-foreground max-sm:rotate-90 rtl:-scale-x-100"
        />
        <div className="flex w-full flex-1 flex-col gap-4 rounded-xl bg-card p-6 shadow-xs ring-1 ring-foreground/10">
          <Eyebrow>Lesson</Eyebrow>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-balance">
              {lesson.title}
            </h3>
            <p className="text-sm text-muted-foreground">{lesson.summary}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {lesson.topic ? (
              <Badge variant="outline">{lesson.topic}</Badge>
            ) : null}
            <Badge variant="outline">{lesson.estimatedMinutes} min</Badge>
            <Badge variant="outline" className="capitalize">
              {lesson.level}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}
