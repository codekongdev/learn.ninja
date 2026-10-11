---
name: learn
description: Turn anything the user gives you (a topic, an article, notes, docs, a transcript, code) into one short, interactive lesson and publish it as a shareable link. Use when the user asks to make, generate, create, or publish a lesson, quiz, tutorial, or interactive explainer, or to teach someone a concept.
---

# Learn: make one interactive lesson and publish it

You write one lesson as a JSON file that follows the lesson spec (v0.3), check it, and publish it. The learner opens the link and plays it: short bricks, instant feedback, Duolingo/Brilliant style. Links expire after 24 hours.

## Steps

1. **Pick one core idea.** Read what the user gave you. A lesson teaches one idea in 5–10 minutes. If the input covers several ideas, pick the central one, and tell the user the rest would make good follow-up lessons.
2. **Read the guides before writing.** Read `reference/teaching-guide.md` (how to teach well, which brick to use when, visuals) and `reference/lesson-format.md` (every field). Then read `levels/index.md`, pick the lesson's level (the user's words win; otherwise what the input assumes; if unclear, `beginner`), and read that level's file: it says what to assume, how hard to make the questions, and how much to help. Then read `subjects/index.md`: if a subject fits (math, languages…), read its guide too. Level and subject guides add to this file and the teaching guide; where one disagrees, this file and the teaching guide win. Look at one or two files in `examples/` closest to the topic, including the one your level file names.
3. **Write the lesson file**, e.g. `lesson.json` in the current folder, following the format exactly. `schema/lesson.schema.json` is the formal JSON Schema.
4. **Check it** and fix every issue it reports, then check again until it passes:
   ```bash
   node <skill-folder>/scripts/learn.mjs validate lesson.json
   ```
5. **Publish it:**
   ```bash
   node <skill-folder>/scripts/learn.mjs publish lesson.json
   ```
   `<skill-folder>` is the folder this SKILL.md is in. Publishing needs Node 18 or newer and network access.
6. **Tell the user** the link, that it expires in 24 hours, which level you chose and that you can remake it at another, and offer changes. To change the lesson, edit the same file and run `publish` again: it updates the same link (the edit token is saved in `.learn/state.json`; don't delete or share that file). Use `publish lesson.json --new` only if the user wants a separate copy with a new link.

If `publish` prints that a newer version of the skill is available, tell the user the update command it shows.

## Rules that matter most

- **Accuracy over flourish.** Teach only what's true and supported by the user's input or well-established knowledge. Don't invent statistics, quotes, studies, or examples presented as real.
- **One idea, interleaved.** Hook (a guess before any teaching) → `bricks`: 1–3 short `concept` bricks, each followed right away by 2–4 question bricks that practise it → one harder challenge → 2–4 takeaways.
- **Level changes content, not shape.** Every level keeps the same structure and limits. The level file sets what the learner already knows, what the questions demand, how tempting the wrong options are, and how many hints there are.
- **Bricks fit the content.** Pick each question brick's type by asking how a good teacher would test that point, not to fill a quota. Repeating a type is fine; a forced `order` or `match` isn't.
- **Teach before you test.** Every term, fact, or method a question or the challenge needs appears first in a concept brick: its body, visual, or term. Feedback, hints, and explanations explain the answer but never introduce anything new, because a learner who answers right may never see them.
- **Every wrong option teaches.** Each wrong option needs `feedback` that explains the misconception, and every question brick needs an `explanation`. Build wrong options from real, common mistakes.
- **v1 limits:** no `number` bricks (ask numeric questions as `choice` with mistake-based options), every `blank` uses word chips (`choices`), no images or photos, no typed answers.
- **Visuals are plain HTML with the built-in UI kit** (Basecoat classes and Tailwind utilities). No scripts, event handlers, iframes, forms, or external URLs; the checker rejects them.
- **Language:** write all learner-facing text in the lesson's `language`. Never translate code.

## Files

- `reference/teaching-guide.md`: how to design the lesson, choose bricks, write feedback, and build visuals
- `reference/lesson-format.md`: every field of the lesson file, with short examples
- `levels/index.md`: how to pick the lesson's level; `levels/{level}.md` is each level's guide
- `subjects/index.md`: the subjects, with when to use each; `subjects/{name}/guide.md` is each subject's guide
- `schema/lesson.schema.json`: the formal JSON Schema (the checker also enforces cross-field rules it can't express)
- `examples/*.json`: seven complete, valid lessons, one at each level (UI design, product management, finance, Spanish, JavaScript, data, history)
- `scripts/learn.mjs`: the checker and publisher (`validate`, `publish`, `schema`; add `--json` for machine-readable output)
