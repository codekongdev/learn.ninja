import { prepareLesson } from "@workspace/player/prepare"

import { BrickTabs, type BrickTab } from "@/components/home/brick-tabs"
import { Demo } from "@/components/home/demo"
import { Examples } from "@/components/home/examples"
import { Faq } from "@/components/home/faq"
import { FromAnything, Points, WrongAnswers } from "@/components/home/features"
import { GetStarted } from "@/components/home/get-started"
import { Hero } from "@/components/home/hero"
import { Section } from "@/components/home/section"
import { HeaderCopyPrompt } from "@/components/site/header-copy-prompt"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { getLesson, LESSON_SLUGS } from "@/lib/lessons"

/** Brick tabs: each a real brick from an example lesson. */
const TABS: (Omit<BrickTab, "lesson" | "prepared"> & { slug: string })[] = [
  {
    type: "choice",
    label: "Choice",
    slug: "map-vs-foreach",
    brickId: "p2",
    blurb: "Pick one answer, or all that apply.",
  },
  {
    type: "compare",
    label: "Compare",
    slug: "compound-interest",
    brickId: "p4",
    blurb: "Two options side by side: pick the better one.",
  },
  {
    type: "hotspot",
    label: "Hotspot",
    slug: "button-hierarchy",
    brickId: "p2",
    blurb: "Tap the right spot in a design, a document, or code.",
  },
  {
    type: "sort",
    label: "Sort",
    slug: "writing-a-prd",
    brickId: "p3",
    blurb: "Drag each item into its group.",
  },
  {
    type: "order",
    label: "Order",
    slug: "button-hierarchy",
    brickId: "p4",
    blurb: "Put the steps or items in order.",
  },
  {
    type: "match",
    label: "Match",
    slug: "spanish-greetings",
    brickId: "p1",
    blurb: "Link each item to its partner.",
  },
  {
    type: "blank",
    label: "Blank",
    slug: "map-vs-foreach",
    brickId: "p1",
    blurb: "Fill the gaps with word chips.",
  },
  {
    type: "scenario",
    label: "Scenario",
    slug: "writing-a-prd",
    brickId: "ch",
    blurb: "A realistic situation: choose what you'd do.",
  },
]

export default async function HomePage() {
  const lessons = await Promise.all(
    LESSON_SLUGS.map(async (slug) => {
      const lesson = getLesson(slug)!
      return { slug, lesson, prepared: await prepareLesson(lesson) }
    })
  )
  const bySlug = (slug: string) => lessons.find((l) => l.slug === slug)!
  const compound = bySlug("compound-interest")
  const buttons = bySlug("button-hierarchy")
  const tabs: BrickTab[] = TABS.map(({ slug, ...tab }) => ({
    ...tab,
    lesson: bySlug(slug).lesson,
    prepared: bySlug(slug).prepared,
  }))

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader action={<HeaderCopyPrompt afterHero />} />
      <main className="flex-1">
        <Hero />
        <Demo lesson={compound.lesson} prepared={compound.prepared} />
        <Section
          id="bricks"
          eyebrow="Bricks"
          title="A lesson, not a summary"
          intro="Lessons are made of bricks, one per screen. Your agent picks each kind to fit what's being taught. Try them."
        >
          <BrickTabs tabs={tabs} />
          <Points />
        </Section>
        <WrongAnswers lesson={buttons.lesson} prepared={buttons.prepared} />
        <FromAnything lesson={bySlug("writing-a-prd").lesson} />
        <Examples lessons={lessons} />
        <Faq />
        <GetStarted />
      </main>
      <SiteFooter />
    </div>
  )
}
