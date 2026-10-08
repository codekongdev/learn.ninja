import { cn } from "@workspace/ui/lib/utils"

/** A home page section: a centered heading and intro, then its content. */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  wide = false,
}: {
  id?: string
  eyebrow?: string
  title: React.ReactNode
  intro?: React.ReactNode
  children?: React.ReactNode
  className?: string
  /** The body (not the heading) spreads past the page's column: demos, tiles, grids. */
  wide?: boolean
}) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto flex w-full scroll-mt-20 flex-col gap-10 px-4 py-20 sm:px-6 sm:py-28",
        wide ? "max-w-6xl" : "max-w-3xl",
        className
      )}
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {intro ? (
          <p className="text-base text-pretty text-muted-foreground sm:text-lg">
            {intro}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
      {children}
    </p>
  )
}

/** "Tell your agent" with example prompts, as in a chat. */
export function AgentPrompts({ prompts }: { prompts: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <Eyebrow>Tell your agent</Eyebrow>
      <ul className="flex flex-col gap-2">
        {prompts.map((p) => (
          <li
            key={p}
            className="w-fit rounded-lg border bg-card px-3 py-2 text-sm font-medium shadow-xs"
          >
            “{p}”
          </li>
        ))}
      </ul>
    </div>
  )
}
