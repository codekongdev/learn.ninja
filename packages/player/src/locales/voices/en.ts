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
      plain: ["Good. That's it.", "Yes."],
      flavor: [
        "You saw it.",
        "Well seen.",
        "Just so.",
        "Your eye is getting sharper.",
        "Yes. Quietly done.",
        "That is the way.",
        "Good. Keep that.",
      ],
    },
    correctWithHint: {
      plain: ["Correct. The hint showed the path, you walked it."],
      flavor: [
        "Asking is also a skill.",
        "Help taken, lesson kept.",
        "A hint is a hand, not a crutch.",
      ],
    },
    goodGuess: {
      plain: ["A good guess."],
      flavor: [
        "Your instinct knows things you don't yet.",
        "Trust the feeling, then test it.",
        "Well guessed. Now let's see why.",
      ],
    },
    hookMiss: {
      plain: ["Not yet, and that's the point."],
      flavor: [
        "A guess shows us where to start.",
        "No matter. The lesson begins here.",
      ],
    },
    nudge: {
      plain: ["Not yet. Look once more."],
      flavor: [
        "Slow down. It's there.",
        "Breathe, then look again.",
        "The answer hasn't moved.",
      ],
    },
    close: {
      plain: ["Close. One fits better."],
      flavor: [
        "Good eye. Now find the best one.",
        "Nearly. Look for the sharper one.",
      ],
    },
    answer: {
      plain: ["Here is the answer."],
      flavor: [
        "Sit with this one.",
        "Hard ones teach the most. Here it is.",
        "Here is the answer. Read it slowly.",
      ],
    },
    streak: {
      plain: ["Three in a row. Steady."],
      flavor: ["You've found your rhythm.", "Calm hands, clear eyes."],
    },
    comeback: {
      plain: ["You looked again, and there it was."],
      flavor: ["That is how it's learned.", "The second look is the lesson."],
    },
    last: {
      plain: ["And that's the lesson. Well walked."],
      flavor: [
        "The last step is still a step.",
        "You finished what you began.",
      ],
    },
    perfect: {
      plain: ["Not one slip. Carry that with you."],
      flavor: [
        "A quiet mind sees clearly.",
        "Nothing to correct. Only to remember.",
      ],
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
