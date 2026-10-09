import { AGENTS } from "@/lib/site"

/** A slowly scrolling row of agent logos, drawn as masks so they take the text color. */
export function AgentLogos() {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-8">
      <p className="text-xs font-medium tracking-widest text-balance text-muted-foreground uppercase">
        Works with any agent that supports skills
      </p>
      <div className="relative w-full overflow-hidden mask-x-from-85% mask-x-to-100%">
        <ul className="sr-only">
          {AGENTS.map((a) => (
            <li key={a.name}>{a.name}</li>
          ))}
        </ul>
        <div
          aria-hidden="true"
          className="flex w-max motion-safe:animate-[marquee_60s_linear_infinite] motion-reduce:mx-auto motion-reduce:flex-wrap motion-reduce:justify-center"
        >
          {[0, 1].map((copy) => (
            <div
              key={copy}
              className="flex shrink-0 items-center gap-12 pe-12 motion-reduce:[&:nth-child(2)]:hidden"
            >
              {AGENTS.map((a) => (
                <span
                  key={a.name}
                  title={a.name}
                  className="block size-7 bg-foreground/70"
                  style={{
                    maskImage: `url(/agents/${a.logo}.svg)`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
