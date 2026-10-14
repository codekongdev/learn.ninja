import Link from "next/link"

import { LinkButton } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { SITE } from "@/lib/site"

import { LogoDivider } from "./logo-divider"
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

/** The bottom of every page. `className` sets its width to match the page (`max-w-*`). */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 pt-20 pb-12 sm:px-6 sm:pt-28",
        className
      )}
    >
      <LogoDivider />

      <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-sm font-medium">
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
            <div key={column.title} className="flex flex-col gap-4">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                {column.title}
              </p>
              <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
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

      <div className="flex items-center justify-between gap-4">
        <p className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
          <span className="truncate">
            © {new Date().getFullYear()} {SITE.name}
          </span>
          <span aria-hidden="true">·</span>
          <Link href="/privacy" className={LINK_CLASS}>
            Privacy
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/terms" className={LINK_CLASS}>
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
    </footer>
  )
}
