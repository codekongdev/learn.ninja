import Link from "next/link"

import { LearnLogo } from "@workspace/player/logo"
import { LinkButton } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { SITE } from "@/lib/site"

import { XLogo } from "./social-icons"

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/docs#install", label: "Install" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs#api", label: "API" },
      { href: "/llms.txt", label: "llms.txt" },
      { href: "/contributors", label: "Contributors" },
    ],
  },
]

const LINK_CLASS =
  "rounded-sm outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"

// The lesson player's footer row (`LessonFooter` in packages/player), which the bottom strip matches.
const SMALL_LINK_CLASS =
  "shrink-0 rounded-md outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"

/**
 * The bottom of every page: one box built like the profile's activity box (`ProfileTabs`), with the
 * name and links on a page-colored card and the legal row in a muted strip under it. The mark sits
 * on the card's top edge, breaking its border. `className` sets its width to match the page
 * (`max-w-*`).
 */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "mx-auto w-full max-w-7xl px-4 pt-20 pb-12 sm:px-6 sm:pt-28",
        className
      )}
    >
      <div className="rounded-xl border bg-muted">
        <div className="relative -m-px flex flex-col gap-10 rounded-xl border bg-background px-4 pt-10 pb-6 sm:flex-row sm:justify-between sm:px-6">
          {/* The page color behind the mark, so the border stops short of it. */}
          <div className="absolute inset-x-0 top-0 mx-auto w-fit -translate-y-1/2 bg-background px-3">
            <LearnLogo className="size-5" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
              <Link
                href="/"
                className={cn(
                  LINK_CLASS,
                  "text-base font-semibold tracking-tight"
                )}
              >
                {SITE.name}
              </Link>
              <span className="text-muted-foreground">by</span>
              {SITE.makers.map((m) => (
                <LinkButton
                  key={m.handle}
                  variant="secondary"
                  size="sm"
                  className="px-1.5"
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <bdi dir="ltr">{m.handle}</bdi>
                </LinkButton>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{SITE.tagline}</p>
          </div>
          <nav className="flex gap-16">
            {COLUMNS.map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <p className="text-xs font-medium text-muted-foreground">
                  {column.title}
                </p>
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {column.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={LINK_CLASS}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-between gap-2 py-2 ps-4 pe-2.5 sm:ps-6 sm:pe-4.5">
          <p className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Link href="/" className={SMALL_LINK_CLASS}>
              © {new Date().getFullYear()} {SITE.name}
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/privacy" className={SMALL_LINK_CLASS}>
              Privacy
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms" className={SMALL_LINK_CLASS}>
              Terms
            </Link>
          </p>
          <LinkButton
            variant="ghost"
            size="icon-sm"
            href={SITE.xUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${SITE.name} on X`}
          >
            <XLogo />
          </LinkButton>
        </div>
      </div>
    </footer>
  )
}
