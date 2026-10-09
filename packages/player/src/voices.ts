// The ninja's feedback lines for each character setting. Off and Normal share the Normal lines;
// Caffeinated is quick and upbeat; Unhinged is a jittery bundle of nerves, sure everything is about
// to go wrong and hugely relieved when it doesn't. On a miss he panics at the situation, never at
// the learner. Each moment has several lines so feedback doesn't repeat (see createLinePicker).
//
// Each language's lines live in ./locales/voices, translated from English (en.ts) for the
// character rather than word for word.

import { shuffle } from "./check"
import { ar } from "./locales/voices/ar"
import { de } from "./locales/voices/de"
import { en } from "./locales/voices/en"
import { es } from "./locales/voices/es"
import { fr } from "./locales/voices/fr"
import { he } from "./locales/voices/he"
import { hi } from "./locales/voices/hi"
import { id } from "./locales/voices/id"
import { it } from "./locales/voices/it"
import { ja } from "./locales/voices/ja"
import { ko } from "./locales/voices/ko"
import { nl } from "./locales/voices/nl"
import { pl } from "./locales/voices/pl"
import { pt } from "./locales/voices/pt"
import { ru } from "./locales/voices/ru"
import { th } from "./locales/voices/th"
import { tr } from "./locales/voices/tr"
import { uk } from "./locales/voices/uk"
import { vi } from "./locales/voices/vi"
import { zh } from "./locales/voices/zh"
import { zhTw } from "./locales/voices/zh-tw"
import { seeded } from "./random"
import { uiLanguageFor, type NinjaLevel, type UiLanguage } from "./strings"

/** A point in a question where the ninja says something. */
export type Moment =
  | "praise"
  | "correctWithHint"
  | "goodGuess"
  | "hookMiss"
  | "nudge"
  | "close"
  | "answer"

export type Voice = Record<Moment, string[]>
export type Character = Exclude<NinjaLevel, "off">
/** One language's lines for every character. */
export type Voices = Record<Character, Voice>

const VOICES: Record<UiLanguage, Voices> = {
  en,
  es,
  pt,
  fr,
  de,
  it,
  nl,
  pl,
  ru,
  uk,
  tr,
  ar,
  he,
  hi,
  id,
  vi,
  th,
  ja,
  ko,
  zh,
  "zh-tw": zhTw,
}

/** The character's lines for a moment, in the player's language (English for one it doesn't have). */
export function voiceLines(
  lang: string,
  level: NinjaLevel,
  moment: Moment
): string[] {
  const voices = VOICES[uiLanguageFor(lang)?.code ?? "en"]
  return voices[level === "off" ? "normal" : level][moment]
}

/**
 * A shuffle bag per set of lines: every line plays once before any repeats, and a new round never
 * starts with the line that ended the last one. Seeded, so a server render and the browser agree.
 * `key` names one piece of feedback; asking again with the same key returns the same line.
 */
export function createLinePicker(seed: string) {
  const bags = new Map<string, { order: number[]; at: number; round: number }>()
  const picked = new Map<string, string>()
  return (key: string, lines: string[]): string => {
    const known = picked.get(key)
    if (known !== undefined) return known
    const line = draw(lines)
    picked.set(key, line)
    return line
  }

  function draw(lines: string[]): string {
    if (lines.length < 2) return lines[0] ?? ""
    const id = lines.join("\n")
    let bag = bags.get(id)
    if (!bag || bag.at >= bag.order.length) {
      const round = bag ? bag.round + 1 : 0
      const order = shuffle(
        lines.map((_, i) => i),
        seeded(`${seed}:${id}:${round}`)
      )
      const last = bag?.order[bag.order.length - 1]
      if (order[0] === last) order.push(order.shift()!)
      bag = { order, at: 0, round }
      bags.set(id, bag)
    }
    return lines[bag.order[bag.at++]!]!
  }
}
