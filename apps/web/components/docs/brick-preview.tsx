import { highlight } from "fumadocs-core/highlight"

import { BrickDemo, type Answer } from "@workspace/player"
import { prepareLesson } from "@workspace/player/prepare"

import { getLesson } from "@/lib/lessons"

import { PreviewTabs } from "./preview-tabs"

/**
 * A playable brick from an example lesson, with its JSON in a second tab, like shadcn's component previews.
 * Used in the docs as <BrickPreview lesson="compound-interest" brick="p1" />. Readers can try the brick but
 * not check it; a demo with `checked` shows its feedback instead.
 */
export async function BrickPreview({
  lesson: slug,
  brick: brickId,
  checked,
}: {
  lesson: string
  brick: string
  checked?: Answer
}) {
  const lesson = getLesson(slug)
  if (!lesson) throw new Error(`No example lesson "${slug}".`)
  const brick = [lesson.hook, ...lesson.bricks, lesson.challenge].find(
    (b) => b.id === brickId
  )
  if (!brick) throw new Error(`No brick "${brickId}" in "${slug}".`)
  const prepared = await prepareLesson(lesson)
  const text = JSON.stringify(brick, null, 2)
  const json = await highlight(text, {
    lang: "json",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })
  return (
    <PreviewTabs
      preview={
        <BrickDemo
          lesson={lesson}
          brickId={brickId}
          prepared={prepared}
          checked={checked}
          actions={Boolean(checked)}
          className="rounded-none bg-transparent shadow-none ring-0"
        />
      }
      code={json}
      codeText={text}
    />
  )
}
