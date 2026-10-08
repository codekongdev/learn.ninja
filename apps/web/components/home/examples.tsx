import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"

import type { Lesson } from "@workspace/spec"
import { Badge } from "@workspace/ui/components/badge"

import { RhythmStrip } from "./brick-icons"
import { Section } from "./section"

/** The example lessons, each opening in the real player. */
export function Examples({
  lessons,
}: {
  lessons: { slug: string; lesson: Lesson }[]
}) {
  return (
    <Section
      wide
      id="examples"
      eyebrow="Examples"
      title="Try a lesson"
      intro="Five lessons made with the skill, from design to finance to Spanish. Each takes a few minutes."
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map(({ slug, lesson }) => (
          <li key={slug}>
            <Link
              href={`/lessons/${slug}`}
              className="group flex h-full flex-col gap-4 rounded-xl bg-card p-6 shadow-xs ring-1 ring-foreground/10 transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold text-balance">{lesson.title}</h3>
                <ArrowUpRightIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:text-foreground motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 rtl:-scale-x-100"
                />
              </div>
              <div className="flex-1">
                <RhythmStrip lesson={lesson} />
              </div>
              <div className="flex flex-wrap gap-2">
                {lesson.topic ? (
                  <Badge variant="outline">{lesson.topic}</Badge>
                ) : null}
                <Badge variant="outline">{lesson.estimatedMinutes} min</Badge>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
