"use client"

import dynamic from "next/dynamic"

// Loaded in the browser only: the toolbar reads the DOM and localStorage as it mounts.
const Agentation = dynamic(
  () => import("agentation").then((m) => m.Agentation),
  { ssr: false }
)

/**
 * Agentation's annotation toolbar (bottom-right), development only. Click an
 * element, add a note, and the annotation reaches Claude Code through the
 * `agentation-mcp` server on port 4747, or is copied as markdown when that
 * server isn't running.
 */
export function AgentationToolbar() {
  if (process.env.NODE_ENV !== "development") return null
  return <Agentation endpoint="http://localhost:4747" appName="learn.ninja" />
}
