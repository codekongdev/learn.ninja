import type { Voices } from "../../voices"

// The ninja's English lines: plain ones said most of the time, flavor ones rationed (see CADENCE in
// voices.ts). The other languages in this folder write theirs afresh in their own idiom, keeping
// each character's personality rather than the exact words. Every line ends in punctuation.

export const en: Voices = {
  default: {
    praise: {
      plain: ["Correct.", "That's right."],
      flavor: [
        "Nice work!",
        "Spot on.",
        "Well spotted.",
        "You got it.",
        "Exactly.",
        "There you go.",
        "That's the one.",
        "Right on.",
      ],
    },
    correctWithHint: {
      plain: ["Correct, with a hint."],
      flavor: [
        "The hint did its job.",
        "Nicely worked out.",
        "Got there with a hint.",
      ],
    },
    goodGuess: {
      plain: ["Good guess!"],
      flavor: ["Nice instinct.", "Good call.", "Sharp guess."],
    },
    hookMiss: {
      plain: ["Not quite, and that's fine."],
      flavor: [
        "Good try. Let's find out why.",
        "Not quite. You'll see why soon.",
      ],
    },
    nudge: {
      plain: ["Not quite. Take another look."],
      flavor: [
        "Almost. Have another go.",
        "One more look should do it.",
        "Give it one more look. I think you can catch it.",
      ],
    },
    close: {
      plain: ["Close, but not the best."],
      flavor: ["Nearly. One option fits better.", "Good, but not the best."],
    },
    answer: {
      plain: ["Here's the answer."],
      flavor: [
        "Here's how it works.",
        "This one's tricky. Here it is.",
        "Let's look at the answer.",
      ],
    },
    streak: {
      plain: ["Three in a row."],
      flavor: ["On a roll.", "That's a streak."],
    },
    comeback: {
      plain: ["There it is."],
      flavor: ["Got it this time.", "Good recovery."],
    },
    last: {
      plain: ["Last one, and it's right."],
      flavor: ["That's the lesson.", "Finished strong."],
    },
    perfect: {
      plain: ["Every answer right."],
      flavor: ["Clean run.", "Nothing to fix."],
    },
  },
  sensei: {
    praise: {
      plain: ["Good.", "Yes."],
      flavor: [
        "Good. Again like that.",
        "You saw it.",
        "Clean.",
        "That's the way.",
        "Well seen.",
        "Keep that.",
        "No wasted motion.",
      ],
    },
    correctWithHint: {
      plain: ["Good. The hint helped."],
      flavor: [
        "Asking is also practice.",
        "You took the hint and finished it.",
        "Help first, then your own hands.",
      ],
    },
    goodGuess: {
      plain: ["A good guess."],
      flavor: [
        "Instinct first. Now the reason.",
        "Guessed well. Let's see why.",
        "Your hands knew before your head.",
      ],
    },
    hookMiss: {
      plain: ["Not yet. We begin here."],
      flavor: ["A guess shows the starting line.", "No matter. Watch."],
    },
    nudge: {
      plain: ["Not yet. Again."],
      flavor: ["Slower.", "Look once more.", "Again. It's there."],
    },
    close: {
      plain: ["Close. One is better."],
      flavor: [
        "Nearly. Find the sharper one.",
        "Good eye. Not the best one yet.",
      ],
    },
    answer: {
      plain: ["Here is the answer."],
      flavor: [
        "Watch, then see it for yourself.",
        "Read it slowly.",
        "The hard ones teach the most. Here.",
      ],
    },
    streak: {
      plain: ["Three in a row. Steady."],
      flavor: ["Good rhythm.", "Calm hands."],
    },
    comeback: {
      plain: ["You looked again. There it is."],
      flavor: ["That is practice.", "The second look is the lesson."],
    },
    last: {
      plain: ["That's the lesson. Well done."],
      flavor: ["You finished what you began.", "The last step counts too."],
    },
    perfect: {
      plain: ["Not one slip. Keep it."],
      flavor: ["Nothing to correct.", "Quiet mind, clear eyes."],
    },
  },
  unhinged: {
    praise: {
      plain: ["Correct. Breathe.", "It's right. Nobody panic."],
      flavor: [
        "Gah! It's right. It's actually right!",
        "Oh man, oh man, you did it!",
        "I can't believe that worked.",
        "Phew. I thought we were doomed.",
        "My eye stopped twitching. Correct.",
        "You did it and nothing exploded!",
        "Correct. My heart can't take this.",
      ],
    },
    correctWithHint: {
      plain: ["Hint. Correct. Breathe."],
      flavor: [
        "The hint saved us both.",
        "Phew, hint and done. I'm shaking.",
        "The hint worked. It actually worked!",
      ],
    },
    goodGuess: {
      plain: ["Wait, you just knew?"],
      flavor: [
        "Gah! How did you know?",
        "That guess was too right.",
        "How? Are you watching me?",
      ],
    },
    hookMiss: {
      plain: ["It's fine. It's totally fine."],
      flavor: [
        "Wrong, but it's only a guess. Breathe.",
        "Nobody saw that. Moving on.",
        "Don't worry, I'll worry for you.",
      ],
    },
    nudge: {
      plain: ["Not that one. Look again."],
      flavor: [
        "Oh no, oh no. One more look?",
        "Okay, deep breath. Look again.",
        "Not it, but you can still fix this.",
      ],
    },
    close: {
      plain: ["So close. Why is it always so close?"],
      flavor: [
        "Nearly. That's almost worse.",
        "There's a better one, I swear.",
        "Close. My nerves can't handle close.",
      ],
    },
    answer: {
      plain: ["Okay, don't panic. Here it is."],
      flavor: [
        "Here it is. Let's never speak of this.",
        "Quick, before it disappears!",
        "Phew. Okay. Here's how it works.",
      ],
    },
    streak: {
      plain: ["Three in a row? Who ARE you?"],
      flavor: [
        "Stop, stop, I can't handle a streak!",
        "Three! I need to sit down.",
      ],
    },
    comeback: {
      plain: ["You came back. From THAT."],
      flavor: [
        "Fixed. Never doubting you again. Until next time.",
        "Phew. I thought that one had us.",
      ],
    },
    last: {
      plain: ["It's over. We made it."],
      flavor: ["I need to lie down.", "Last one. My knees gave out."],
    },
    perfect: {
      plain: ["Perfect. PERFECT. I need to sit down."],
      flavor: ["Nothing exploded. Not once.", "Every one? I'm going to faint."],
    },
  },
}
