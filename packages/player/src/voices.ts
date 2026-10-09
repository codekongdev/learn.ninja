// The ninja's feedback lines for each character setting. Off and Normal share the Normal lines;
// Caffeinated is quick and upbeat; Unhinged is a jittery bundle of nerves, sure everything is about
// to go wrong and hugely relieved when it doesn't. On a miss he panics at the situation, never at
// the learner. Each moment has several lines so feedback doesn't repeat (see nextLine).
//
// Only English has the characters so far. Other languages use their own single lines from
// ./locales until their voices are translated here.

import { shuffle } from "./check"
import { seeded } from "./random"
import {
  uiLanguageFor,
  type NinjaLevel,
  type Strings,
  type UiLanguage,
} from "./strings"

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
type Character = Exclude<NinjaLevel, "off">

const en: Record<Character, Voice> = {
  normal: {
    praise: [
      "There you go",
      "Nice work",
      "Exactly",
      "You got it",
      "Spot on",
      "That's the one",
      "Well spotted",
      "Right on",
    ],
    correctWithHint: [
      "Correct, with a hint",
      "Got there with a hint",
      "Hint used, answer found",
      "Nicely worked out",
    ],
    goodGuess: ["Good guess!", "Nice instinct", "Good call", "Sharp guess"],
    hookMiss: [
      "Not quite, and that's fine",
      "Not this time, and that's fine",
      "Good try. Let's find out why",
      "Not quite. You'll see why soon",
    ],
    nudge: [
      "Give it one more look. I think you can catch it.",
      "Not quite. Take another look.",
      "Almost. Have another go.",
      "One more look should do it.",
    ],
    close: [
      "Close, but not the best",
      "Nearly. There's a better one",
      "Good, but not the best",
      "Close. One option fits better",
    ],
    answer: [
      "Here's the answer",
      "Here's how it works",
      "Let's look at the answer",
      "This one's tricky. Here it is",
    ],
  },
  caffeinated: {
    praise: [
      "Yes, yes, yes!",
      "Boom, nailed it",
      "Fast and right",
      "Zing, correct",
      "Oh, that's it",
      "Bang on, next",
      "Ooh, crisp",
      "You're on fire",
    ],
    correctWithHint: [
      "Got it, and the hint counts too",
      "Hint, then boom",
      "Hint-assisted and still right",
      "The hint did its job, so did you",
    ],
    goodGuess: [
      "Whoa, good guess!",
      "Called it",
      "Instinct on point",
      "Lucky or genius?",
    ],
    hookMiss: [
      "Nope, totally fine, keep going",
      "Missed it, no biggie",
      "Wrong guess, fun guess",
      "Ha, not it. Moving on",
    ],
    nudge: [
      "Ooh, so close. Quick, one more look",
      "Not it. Again, again",
      "Almost. Give it another zap",
      "Whoops. Another look?",
    ],
    close: [
      "Close, but not the best one",
      "Ooh, nearly. There's a better one",
      "So close, one beats it",
      "Good pick, not the best pick",
    ],
    answer: [
      "Okay okay, here it is",
      "Alright, answer time",
      "No stress, here it is",
      "Okay, here's how it goes",
    ],
  },
  unhinged: {
    praise: [
      "Gah! It's right. It's actually right",
      "Oh man, oh man, you did it",
      "I can't believe that worked",
      "Phew. I thought we were doomed",
      "It's right. Nobody panic",
      "My eye stopped twitching. Correct",
      "You did it and nothing exploded",
      "Correct. My heart can't take this",
    ],
    correctWithHint: [
      "The hint saved us both",
      "Phew, hint and done. I'm shaking",
      "We needed help and that's okay",
      "The hint worked. It actually worked",
    ],
    goodGuess: [
      "Gah! How did you know?",
      "Wait, you just knew?",
      "That guess was too right",
      "How? Are you watching me?",
    ],
    hookMiss: [
      "Gah! It's fine. It's totally fine",
      "Wrong, but it's only a guess. Breathe",
      "Nobody saw that. Moving on",
      "Don't worry, I'll worry for you",
    ],
    nudge: [
      "Gah! Not that one. Look again",
      "Oh no, oh no. One more look?",
      "Okay, deep breath. Look again",
      "Not it, but you can still fix this",
    ],
    close: [
      "So close. Why is it always so close?",
      "Nearly. That's almost worse",
      "There's a better one, I swear",
      "Close. My nerves can't handle close",
    ],
    answer: [
      "Okay, okay, don't panic. Here it is",
      "Here it is. Let's never speak of this",
      "Quick, before it disappears",
      "Phew. Okay. Here's how it works",
    ],
  },
}

const VOICES: Partial<Record<UiLanguage, Record<Character, Voice>>> = { en }

/** The lines for a moment: the character's in its language, else the language's own single line. */
export function voiceLines(
  lang: string,
  level: NinjaLevel,
  moment: Moment,
  t: Strings
): string[] {
  const voices = VOICES[uiLanguageFor(lang)?.code ?? "en"]
  if (voices) return voices[level === "off" ? "normal" : level][moment]
  return moment === "praise" ? t.praise : [t[moment]]
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
