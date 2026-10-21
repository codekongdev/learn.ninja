"use client"

import * as React from "react"

// Set when a beacon goes out, and taken by Explore when it next mounts (RefreshAfterView): coming
// back with the browser's Back button reuses the list as it was, without the view just counted.
let viewSent = false

/** Whether a view was sent since the last call. */
export function takeViewSent() {
  const sent = viewSent
  viewSent = false
  return sent
}

/**
 * Counts a view each time the lesson page opens: a beacon to the view route, sent after the page
 * is up. Renders nothing. It runs in the browser rather than in the page's render so crawlers and
 * link previews, which fetch the page without running it, aren't counted.
 */
export function ViewBeacon({ id }: { id: string }) {
  // Strict mode runs effects twice on one mount and keeps refs across the two, so this stops a
  // single open counting twice; opening the lesson again mounts a fresh beacon and counts again.
  const sent = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (sent.current === id) return
    sent.current = id
    const url = `/api/lessons/${id}/view`
    if (!navigator.sendBeacon?.(url))
      fetch(url, { method: "POST", keepalive: true }).catch(() => {})
    viewSent = true
  }, [id])
  return null
}
