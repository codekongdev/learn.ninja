import { highlight } from "fumadocs-core/highlight"

import { KataDemo, type Answer } from "@workspace/player"
import { prepareLesson } from "@workspace/player/prepare"

import { getLesson } from "@/lib/lessons"

import { PreviewTabs } from "./preview-tabs"

/**
 * A playable kata from an example lesson, with its JSON in a second tab, like shadcn's component previews.
 * Used in the docs as <KataPreview lesson="compound-interest" kata="p1" />. Readers can try the kata but
 * not check it; a demo with `checked` shows its feedback instead.
 */
export async function KataPreview({
  lesson: slug,
  kata: kataId,
  checked,
}: {
  lesson: string
  kata: string
  checked?: Answer
}) {
  const lesson = getLesson(slug)
  if (!lesson) throw new Error(`No example lesson "${slug}".`)
  const kata = [lesson.hook, ...lesson.katas, lesson.challenge].find(
    (b) => b.id === kataId
  )
  if (!kata) throw new Error(`No kata "${kataId}" in "${slug}".`)
  const prepared = await prepareLesson(lesson)
  const text = JSON.stringify(kata, null, 2)
  const json = await highlight(text, {
    lang: "json",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  })
  return (
    <PreviewTabs
      preview={
        <KataDemo
          visualsCss={process.env.NEXT_PUBLIC_VISUALS_CSS}
          lesson={lesson}
          kataId={kataId}
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
