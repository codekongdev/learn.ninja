"use client"

import { flushSync } from "react-dom"

// Motion shared by the katas that move items around (sort and order): items slide to their new
// place with a view transition, headings bounce, and wrong items shake after checking. All of it
// stays still for people who ask for reduced motion.

export const calm = () =>
  typeof window === "undefined" ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

type ViewTransition = { finished: Promise<void>; ready: Promise<void> }
type WithViewTransitions = Document & {
  startViewTransition?: (update: () => void) => ViewTransition
}

/** Name every `[data-vt]` element for the transition only while it runs, so nothing else changes. */
function tag(root: HTMLElement, on: boolean) {
  for (const el of root.querySelectorAll<HTMLElement>("[data-vt]")) {
    el.style.setProperty("view-transition-name", on ? el.dataset.vt! : "")
    el.style.setProperty("view-transition-class", on ? "learn-item" : "")
  }
}

/**
 * Run a move as a view transition, so items slide to their new place where the browser can.
 * `after` runs once the new state is on screen, which is the moment to move focus.
 */
export function fly(
  root: HTMLElement | null,
  update: () => void,
  after?: () => void
): Promise<void> {
  const run = () => {
    flushSync(update)
    after?.()
  }
  const doc = document as WithViewTransitions
  if (!root || !doc.startViewTransition || calm()) {
    run()
    return Promise.resolve()
  }
  tag(root, true)
  const transition = doc.startViewTransition(() => {
    run()
    tag(root, true)
  })
  // A transition cut short (another move, or the tab hidden) rejects `ready`; the move itself still lands.
  transition.ready.catch(() => {})
  return transition.finished.finally(() => tag(root, false))
}

/** A small bounce, as an item lands. */
export function pulse(el: HTMLElement | null | undefined) {
  if (!el || calm()) return
  el.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.02)" },
      { transform: "scale(1)" },
    ],
    { duration: 280, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
  )
}

/** After checking, items marked wrong give a small shake. */
export function shake(root: HTMLElement | null) {
  if (calm()) return
  for (const el of root?.querySelectorAll<HTMLElement>(
    '[data-status="wrong"]'
  ) ?? [])
    el.animate(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(4px)" },
        { transform: "translateX(-3px)" },
        { transform: "translateX(2px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 420, easing: "ease-out" }
    )
}

/** A tick under the finger on phones; desktops have nothing to buzz. */
export function buzz() {
  if (matchMedia("(pointer: coarse)").matches) navigator.vibrate?.(10)
}
