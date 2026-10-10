import type { Voices } from "../../voices"

// The ninja's English lines. The other languages in this folder write these afresh in their own
// idiom, keeping each character's personality rather than the exact words. Every line ends in a
// period, exclamation point, or question mark.

export const en: Voices = {
  default: {
    praise: [
      "There you go.",
      "Nice work!",
      "Exactly.",
      "You got it.",
      "Spot on.",
      "That's the one.",
      "Well spotted.",
      "Right on.",
    ],
    correctWithHint: [
      "Correct, with a hint.",
      "Got there with a hint.",
      "Hint used, answer found.",
      "Nicely worked out.",
    ],
    goodGuess: ["Good guess!", "Nice instinct.", "Good call.", "Sharp guess."],
    hookMiss: [
      "Not quite, and that's fine.",
      "Not this time, and that's fine.",
      "Good try. Let's find out why.",
      "Not quite. You'll see why soon.",
    ],
    nudge: [
      "Give it one more look. I think you can catch it.",
      "Not quite. Take another look.",
      "Almost. Have another go.",
      "One more look should do it.",
    ],
    close: [
      "Close, but not the best.",
      "Nearly. There's a better one.",
      "Good, but not the best.",
      "Close. One option fits better.",
    ],
    answer: [
      "Here's the answer.",
      "Here's how it works.",
      "Let's look at the answer.",
      "This one's tricky. Here it is.",
    ],
  },
  sensei: {
    praise: [
      "Good. That's it.",
      "You saw it.",
      "Well seen.",
      "Just so.",
      "Your eye is getting sharper.",
      "Yes. Quietly done.",
      "That is the way.",
      "Good. Keep that.",
    ],
    correctWithHint: [
      "Correct. The hint showed the path, you walked it.",
      "Asking is also a skill.",
      "Help taken, lesson kept.",
      "Correct. A hint is a hand, not a crutch.",
    ],
    goodGuess: [
      "A good guess.",
      "Your instinct knows things you don't yet.",
      "Trust the feeling, then test it.",
      "Well guessed. Now let's see why.",
    ],
    hookMiss: [
      "Not yet, and that's the point.",
      "A guess shows us where to start.",
      "Not yet. Now we know what to learn.",
      "No matter. The lesson begins here.",
    ],
    nudge: [
      "Not yet. Look once more.",
      "Slow down. It's there.",
      "Breathe, then look again.",
      "The answer hasn't moved.",
    ],
    close: [
      "Close. One fits better.",
      "Good eye. Now find the best one.",
      "Nearly. Look for the sharper one.",
      "Close is a good sign. Look again.",
    ],
    answer: [
      "Here is the answer.",
      "Sit with this one.",
      "Hard ones teach the most. Here it is.",
      "Here is the answer. Read it slowly.",
    ],
  },
  unhinged: {
    praise: [
      "Gah! It's right. It's actually right!",
      "Oh man, oh man, you did it!",
      "I can't believe that worked.",
      "Phew. I thought we were doomed.",
      "It's right. Nobody panic.",
      "My eye stopped twitching. Correct.",
      "You did it and nothing exploded!",
      "Correct. My heart can't take this.",
    ],
    correctWithHint: [
      "The hint saved us both.",
      "Phew, hint and done. I'm shaking.",
      "We needed help and that's okay.",
      "The hint worked. It actually worked!",
    ],
    goodGuess: [
      "Gah! How did you know?",
      "Wait, you just knew?",
      "That guess was too right.",
      "How? Are you watching me?",
    ],
    hookMiss: [
      "Gah! It's fine. It's totally fine.",
      "Wrong, but it's only a guess. Breathe.",
      "Nobody saw that. Moving on.",
      "Don't worry, I'll worry for you.",
    ],
    nudge: [
      "Gah! Not that one. Look again.",
      "Oh no, oh no. One more look?",
      "Okay, deep breath. Look again.",
      "Not it, but you can still fix this.",
    ],
    close: [
      "So close. Why is it always so close?",
      "Nearly. That's almost worse.",
      "There's a better one, I swear.",
      "Close. My nerves can't handle close.",
    ],
    answer: [
      "Okay, okay, don't panic. Here it is.",
      "Here it is. Let's never speak of this.",
      "Quick, before it disappears!",
      "Phew. Okay. Here's how it works.",
    ],
  },
}
