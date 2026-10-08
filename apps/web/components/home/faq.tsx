import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"

import { FAQ } from "@/lib/faq"

import { Section } from "./section"

export function Faq() {
  return (
    <Section id="faq" title="Questions">
      <Accordion className="mx-auto max-w-2xl">
        {FAQ.map(({ q, a }) => (
          <AccordionItem key={q} id={q}>
            <AccordionTrigger className="text-base">{q}</AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">
              <p>{renderCode(a)}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  )
}

/** Shows `backticked` text as code. */
function renderCode(text: string) {
  return text.split(/`([^`]+)`/).map((part, i) =>
    i % 2 ? (
      <code
        key={i}
        className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm"
      >
        {part}
      </code>
    ) : (
      part
    )
  )
}
