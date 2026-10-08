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

import { BrickDemo, type Prepared } from "@workspace/player"
import type { Lesson } from "@workspace/spec"
import { Badge } from "@workspace/ui/components/badge"

import { AgentPrompts, Eyebrow } from "./section"

const POINTS = [
  {
    icon: LightbulbIcon,
    title: "Feedback on every answer",
    body: "Each wrong option explains the mistake behind it. Miss twice and you see the answer and why.",
  },
  {
    icon: ShapesIcon,
    title: "Visuals, formulas, and code",
    body: "Diagrams drawn in HTML, real formulas, and highlighted code, right in the lesson.",
  },
  {
    icon: LanguagesIcon,
    title: "Any language",
    body: "Lessons in the learner's language, including right-to-left languages like Arabic.",
  },
  {
    icon: PencilIcon,
    title: "Edit by asking",
    body: "“Make it harder.” Your agent changes the lesson and the link stays the same.",
  },
]

/** Four short selling points under the brick tabs. */
export function Points() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-xl bg-border ring-1 ring-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
      {POINTS.map(({ icon: Icon, title, body }) => (
        <li key={title} className="flex flex-col gap-2 bg-card p-6">
          <Icon aria-hidden="true" className="size-5 text-muted-foreground" />
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{body}</p>
        </li>
      ))}
    </ul>
  )
}

/** "Every wrong answer teaches": a brick already checked with a wrong pick. */
export function WrongAnswers({
  lesson,
  prepared,
}: {
  lesson: Lesson
  prepared: Prepared
}) {
  return (
    <section className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-16">
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
      <BrickDemo
        lesson={lesson}
        brickId="p1"
        prepared={prepared}
        checked={{ kind: "select", ids: ["b"] }}
      />
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
    <section className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2 lg:gap-16">
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
