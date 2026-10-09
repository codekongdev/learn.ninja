import type { Metadata } from "next"

import { LinkButton } from "@workspace/ui/components/button"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { GitHubLogo, XLogo } from "@/components/site/social-icons"
import { CONTRIBUTORS } from "@/lib/contributors"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contributors",
  description: `A special thanks to all those helping to build ${SITE.name}.`,
  alternates: { canonical: "/contributors" },
}

export default function ContributorsPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Contributors
          </h1>
          <p className="text-base text-pretty text-muted-foreground sm:text-lg">
            A special thanks to all those helping to build {SITE.name}
          </p>
        </div>
        <ul className="flex flex-col divide-y">
          {CONTRIBUTORS.map((c) => (
            <li
              key={c.name}
              className="flex items-center justify-between gap-4 py-3"
            >
              <span className="text-base font-medium">{c.name}</span>
              <span className="flex gap-1">
                {c.github ? (
                  <LinkButton
                    variant="ghost"
                    size="icon-sm"
                    href={`https://github.com/${c.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${c.name} on GitHub`}
                  >
                    <GitHubLogo />
                  </LinkButton>
                ) : null}
                {c.x ? (
                  <LinkButton
                    variant="ghost"
                    size="icon-sm"
                    href={`https://x.com/${c.x}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${c.name} on X`}
                  >
                    <XLogo />
                  </LinkButton>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </main>
      <SiteFooter className="max-w-3xl" />
    </div>
  )
}
