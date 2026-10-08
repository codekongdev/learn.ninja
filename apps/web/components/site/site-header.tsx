import { ButtonLink } from "./button-link"
import { Wordmark } from "./wordmark"

/** The bar at the top of every page. `start` and `end` add page-specific controls (the docs menu, the home page's copy button). */
export function SiteHeader({
  start,
  end,
}: {
  start?: React.ReactNode
  end?: React.ReactNode
}) {
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-4 sm:px-6">
        {start}
        <Wordmark />
        <ButtonLink href="/docs" variant="ghost" size="sm" className="ms-auto">
          Docs
        </ButtonLink>
        {end}
      </div>
    </header>
  )
}
