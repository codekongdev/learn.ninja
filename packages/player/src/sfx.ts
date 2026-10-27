"use client"

// The player's sound effects (apps/web/public/sfx, made with ElevenLabs Sound Effects), played on the
// Web Audio API: a decoded clip loops without the gap an <audio> element can leave at the seam, and
// a gain node fades it out instead of cutting. Phones only let audio start on a press, so the
// player calls `unlockSfx` and the shared context resumes on the learner's first one; sounds that
// start later, on a timer, are then allowed. They follow the player's Sound setting (the caller
// checks it).

export const SFX = {
  /** The wind as the intro vanishes ("an extended whoosh of wind sweeping past"). */
  vanish: "/sfx/vanish.mp3",
  /**
   * The streak's lantern lighting ("a paper lantern being lit in a quiet room: a tiny soft puff as
   * the wick catches, a brief gentle crackle of flame and paper, then a warm low glow that swells
   * softly and settles").
   */
  lantern: "/sfx/lantern.mp3",
  /**
   * Its flame burning, a 4 s seamless loop ("a small flame burning steadily inside a paper lantern:
   * a soft, quiet, continuous gentle crackle and a faint warm hum"), quieter than the lighting.
   */
  flame: "/sfx/flame.mp3",
} as const

/** A sound that was started: `stop` fades it out over `fade` ms (or cancels it before it starts). */
export interface Sound {
  stop: (fade?: number) => void
}

let context: AudioContext | null = null
const clips = new Map<string, Promise<ArrayBuffer>>()
const decoded = new Map<string, Promise<AudioBuffer>>()

const supported = () =>
  typeof window !== "undefined" && "AudioContext" in window

/** The shared context, made on first use. Suspended until a press resumes it. */
function getContext(): AudioContext | null {
  if (!supported()) return null
  return (context ??= new AudioContext())
}

/**
 * Lets sounds play: on the next press or key, the context is made or resumed inside the gesture,
 * which is when browsers allow it. Returns a function that stops listening.
 */
export function unlockSfx(): () => void {
  if (!supported()) return () => {}
  const events = ["pointerup", "touchend", "keydown"] as const
  const unlock = () => {
    const ctx = getContext()
    if (!ctx) return
    if (ctx.state !== "running") void ctx.resume().catch(() => {})
  }
  for (const e of events)
    window.addEventListener(e, unlock, { capture: true, passive: true })
  return () => {
    for (const e of events)
      window.removeEventListener(e, unlock, { capture: true })
  }
}

/** Fetches a clip ahead of time, so it's ready to play when its moment comes. */
export function preloadSfx(url: string): void {
  if (!supported()) return
  load(url).catch(() => {})
}

function load(url: string): Promise<ArrayBuffer> {
  let p = clips.get(url)
  if (!p) {
    p = fetch(url).then((r) => {
      if (!r.ok) throw new Error(`${url}: ${r.status}`)
      return r.arrayBuffer()
    })
    p.catch(() => clips.delete(url))
    clips.set(url, p)
  }
  return p
}

function decode(ctx: AudioContext, url: string): Promise<AudioBuffer> {
  let p = decoded.get(url)
  if (!p) {
    // Decoded from a copy: decodeAudioData takes the buffer it's given.
    p = load(url).then((bytes) => ctx.decodeAudioData(bytes.slice(0)))
    p.catch(() => decoded.delete(url))
    decoded.set(url, p)
  }
  return p
}

/**
 * Plays a clip, looping it when `loop` is set, once it has loaded. Quiet when the browser hasn't
 * let audio start yet, or the clip doesn't load. `stop` fades it out, or cancels it if it hasn't
 * started.
 */
export function playSfx(url: string, { loop = false } = {}): Sound {
  const ctx = getContext()
  if (!ctx) return { stop: () => {} }
  let stopped = false
  let source: AudioBufferSourceNode | null = null
  let gain: GainNode | null = null
  decode(ctx, url)
    .then(async (buffer) => {
      if (stopped) return
      // Resumes where a press already allowed it; elsewhere this waits for the next press, by
      // which time the sound may well have been stopped, so it checks again.
      await ctx.resume()
      if (stopped || ctx.state !== "running") return
      gain = ctx.createGain()
      gain.connect(ctx.destination)
      source = ctx.createBufferSource()
      source.buffer = buffer
      source.loop = loop
      source.connect(gain)
      source.start()
    })
    .catch(() => {})
  return {
    stop(fade = 0) {
      stopped = true
      if (!source || !gain) return
      const at = ctx.currentTime
      const end = at + fade / 1000
      gain.gain.setValueAtTime(gain.gain.value, at)
      gain.gain.linearRampToValueAtTime(0, end)
      source.stop(end)
    },
  }
}
