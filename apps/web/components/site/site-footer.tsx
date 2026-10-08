import Link from "next/link"

import { SITE } from "@/lib/site"

import { ThemeToggle } from "./theme-toggle"
import { Wordmark } from "./wordmark"

const LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/install", label: "Install" },
  { href: "/docs/bricks", label: "Bricks" },
  { href: "/docs/reference/api", label: "API" },
  { href: "/llms.txt", label: "llms.txt" },
]

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-2">
          <Wordmark />
          <p className="text-sm text-muted-foreground">
            Interactive lessons, made by your agent. Free, no account.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-sm outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 pb-10 sm:px-6">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {SITE.name}
        </p>
        <ThemeToggle />
      </div>
    </footer>
  )
}
