"use client"

import { useSyncExternalStore } from "react"

import type { SetupId } from "@/lib/site"

const DEFAULT_SETUP: SetupId = "cli"

// A store rather than page state: the header's copy button sits outside the page's sections, and
// it has to copy the same prompt as the toggles.
let current = DEFAULT_SETUP as SetupId
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function setSetup(setup: SetupId) {
  current = setup
  listeners.forEach((listener) => listener())
}

/** The CLI or MCP choice, shared by every toggle and copy button on the home page. */
export function useSetup() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => DEFAULT_SETUP
  )
}
