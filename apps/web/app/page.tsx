import type { Metadata } from "next"

import { Faq } from "@/components/home/faq"
import { GetStarted } from "@/components/home/get-started"
import { Hero } from "@/components/home/hero"
import { SetupBar } from "@/components/home/setup-bar"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    types: { "text/markdown": "/index.md", "text/plain": "/llms.txt" },
  },
}

export default function HomePage() {
  return (
    // The padding keeps the footer clear of the fixed bar.
    <div className="flex min-h-svh flex-col pb-[calc(3rem+1px+env(safe-area-inset-bottom))]">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Faq />
        <GetStarted />
      </main>
      <SiteFooter className="max-w-3xl" />
      <SetupBar />
    </div>
  )
}
