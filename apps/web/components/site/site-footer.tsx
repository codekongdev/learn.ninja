import Link from "next/link"

import { LinkButton } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { SITE } from "@/lib/site"

import { LogoDivider } from "./logo-divider"

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/docs#install", label: "Install" },
      { href: "/docs#subjects", label: "Subjects" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs#api", label: "API" },
      { href: "/llms.txt", label: "llms.txt" },
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
            <LinkButton
              variant="secondary"
              size="sm"
              href={SITE.makerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <bdi dir="ltr">{SITE.maker}</bdi>
            </LinkButton>
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
        <p className="truncate text-sm text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name}
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

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}
