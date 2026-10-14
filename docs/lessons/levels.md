---
title: Levels
description: Who a lesson is for. The agent picks a level and reads that level's guide on top of the core skill.
---

Every lesson has a `level`: `beginner`, `intermediate`, or `advanced`. It says who the lesson is for and shows on the lesson's first screen. The level changes what the lesson assumes, what its questions ask for, how tempting the wrong options are, and how many hints there are. It doesn't change the shape: that's the lesson's mode (explain, balanced, or practice), within the same limits at every level.

## Pick a level

1. Your words win: name a level, or an audience ("my team of senior engineers", "my kid", "people new to statistics").
2. Then how you ask: terms of art and stated background point up, while a plain "explain X" is beginner however advanced X is.
3. Then what the input assumes: text that explains its own terms reads as beginner or intermediate, text written for people in the field as intermediate or advanced.
4. Topic depth only breaks a tie. If it's still unclear, the lesson is beginner.

The agent tells you which level it chose. Ask for another and it remakes the lesson. Levels are relative to the subject, so each lesson's summary says what it assumes.

## What changes with level

| Level          | For                                 | Assumes                                     | Questions ask you to                                               | Help                     | Example                                                          |
| -------------- | ----------------------------------- | ------------------------------------------- | ------------------------------------------------------------------ | ------------------------ | ---------------------------------------------------------------- |
| `beginner`     | Never done this, or only a little   | Everyday knowledge; every term is explained | Recognise and understand: which is it, what happens next           | Hints on most questions  | [Button hierarchy](/lessons/button-hierarchy)                    |
| `intermediate` | Knows the basics; wants to use them | The field's core terms and standard method  | Apply: which method fits, carry it out on a new case, predict      | Hints on the harder half | [Correlation isn't causation](/lessons/correlation-vs-causation) |
| `advanced`     | Significant prior learning          | Vocabulary, standard models, usual accounts | Analyse and judge: weigh evidence, find the flaw, compare accounts | One or two hints, if any | [Why the Bronze Age collapsed](/lessons/bronze-age-collapse)     |

## What stays the same

The structure and the checker's limits are identical at every level: one hook, 1–4 concept bricks of 80 words or fewer, 1–6 question bricks after each (the mode sets how many), a harder challenge, and 2–4 takeaways, in 3–15 minutes. The level guides live in the skill at `levels/{level}.md`, next to `levels/index.md`, which says how the agent chooses.
