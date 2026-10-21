"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { takeViewSent } from "./view-beacon"

/**
 * Reloads Explore's data once when it opens after a lesson page counted a view in this tab. The
 * browser's Back button shows the list as it was when it was left, so without this the lesson just
 * opened would show its old view count. Renders nothing.
 */
export function RefreshAfterView() {
  const router = useRouter()
  React.useEffect(() => {
    if (takeViewSent()) router.refresh()
  }, [router])
  return null
}
