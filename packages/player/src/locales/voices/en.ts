import type { Voices } from "../../voices"

// The ninja's English lines. The other languages in this folder translate these, keeping each
// character's personality rather than the exact words.

export const en: Voices = {
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
