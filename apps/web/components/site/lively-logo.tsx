"use client"

import { useEffect, useRef, type ReactNode } from "react"

import { LearnLogo } from "@workspace/player/logo"

// How far the eyes may move, in the logo's 64-unit viewBox: enough to read as a glance, not so
// far that they touch the headband or the smile.
const MAX_X = 3
const MAX_Y = 2
// The pointer distance (in px) at which the eyes are halfway to their limit.
const REACH = 100

/**
 * The site's logo, with eyes that follow the mouse and blink now and then. The server renders the
 * still logo; the motion starts after mount and moves the eyes directly, so React never re-renders.
 * Reduced motion keeps it still, and touch input only gets the blinks. The lesson player uses the
 * plain `LearnLogo`, whose ninja does the moving. `children` swaps the logo for the player's `Ninja`,
 * for a mark that also needs his moods.
 */
export function LivelyLogo({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const svg = ref.current?.querySelector("svg")
    const eyes = svg?.querySelector<SVGGElement>("[data-eyes], .ninja-eyes")
    if (!svg || !eyes) return
    const lids = Array.from(eyes.querySelectorAll("ellipse"))
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    let stop = () => {}

    function start() {
      let frame = 0
      let blinkTimer = 0
      let pointer: { x: number; y: number } | null = null

      eyes!.style.transition = "transform 150ms ease-out"

      // Screen coordinates on both sides, so right-to-left pages need no flipping.
      const look = () => {
        frame = 0
        let x = 0
        let y = 0
        if (pointer) {
          const box = svg!.getBoundingClientRect()
          const dx = pointer.x - (box.left + box.width / 2)
          const dy = pointer.y - (box.top + box.height / 2)
          const distance = Math.hypot(dx, dy)
          if (distance > 0) {
            const pull = distance / (distance + REACH)
            x = (dx / distance) * pull * MAX_X
            y = (dy / distance) * pull * MAX_Y
          }
        }
        // CSS lengths on an SVG element are viewBox units.
        eyes!.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`
      }
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(look)
      }
      const onMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return
        pointer = { x: event.clientX, y: event.clientY }
        schedule()
      }
      const onLeave = (event: PointerEvent) => {
        if (event.relatedTarget) return
        pointer = null
        schedule()
      }
      const onBlur = () => {
        pointer = null
        schedule()
      }

      const blink = () => {
        // A mood sets his eyelids itself: a blink would flash his eyes open in the middle of a bow.
        if (!document.hidden && !svg!.matches('[class*=" e-"]')) {
          for (const lid of lids) {
            lid.style.transformBox = "fill-box"
            lid.style.transformOrigin = "center"
            // A throttled background tab can leave the last blink unfinished.
            for (const animation of lid.getAnimations()) animation.cancel()
            lid.animate(
              [
                { transform: "scaleY(1)" },
                { transform: "scaleY(0.1)" },
                { transform: "scaleY(1)" },
              ],
              { duration: 180, easing: "ease-in-out" }
            )
          }
        }
        // A few seconds apart, with the odd quick double blink.
        const next = Math.random() < 0.15 ? 260 : 2500 + Math.random() * 4000
        blinkTimer = window.setTimeout(blink, next)
      }
      blinkTimer = window.setTimeout(blink, 1500 + Math.random() * 2500)

      window.addEventListener("pointermove", onMove, { passive: true })
      document.addEventListener("pointerout", onLeave)
      window.addEventListener("blur", onBlur)

      return () => {
        cancelAnimationFrame(frame)
        window.clearTimeout(blinkTimer)
        window.removeEventListener("pointermove", onMove)
        document.removeEventListener("pointerout", onLeave)
        window.removeEventListener("blur", onBlur)
        eyes!.style.transition = ""
        eyes!.style.transform = ""
      }
    }

    const update = () => {
      stop()
      stop = reduced.matches ? () => {} : start()
    }
    update()
    reduced.addEventListener("change", update)
    return () => {
      reduced.removeEventListener("change", update)
      stop()
    }
  }, [])

  return (
    <span ref={ref} className="contents">
      {children ?? <LearnLogo className={className} />}
    </span>
  )
}
