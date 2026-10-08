---
title: Write a pack
description: Add a topic pack for a subject you know how to teach, or improve an existing one.
---

Topic packs live in the repository at `skills/learn/topics/`, one folder per subject. Anyone can propose a new pack or improve one with a pull request.

## What makes a good pack

A pack is worth adding when its subject has its own way of being taught: shared notation, typical mistakes, or bricks that fit it especially well. Design, code, music theory, or chemistry could each be one. A single topic, like "fractions", belongs inside a broader pack.

Write down what a good teacher of the subject knows and a general guide doesn't:

- **What one lesson should cover** in this subject, with an example of a good objective.
- **How to explain it:** worked examples, diagrams, notation, conventions.
- **Which bricks fit**, and what each is natural for in this subject.
- **The real mistakes learners make**, so wrong options and feedback come from them.
- **What to check for accuracy** before publishing.

Don't repeat the teaching guide or the lesson format. The agent has already read them.

## The file

Each pack is one `guide.md` with a short header:

```markdown
---
name: music-theory
description: Scales, chords, intervals, and rhythm. Use when the lesson teaches how music is built or read.
examples: major-scales
---

# Music theory

Extra guidance for lessons on music theory. It adds to `reference/teaching-guide.md`; where they disagree, the teaching guide wins.

## 1. …
```

- **`name`**: the folder's name, in lowercase with hyphens.
- **`description`**: what the subject covers and when to use the pack, in one line. The agent picks a pack from this alone, so make it specific.
- **`examples`**: optional. The names of example lessons in the repo's `examples/` folder that show the pack in use (here, `examples/major-scales.json`), separated by commas.

Keep the guide under 1,200 words. Every word costs the agent context, and short, specific guidance gets followed.

## Checks

After adding or changing a pack, run `npm run skill:build -w @workspace/cli` to update the pack index, then `npm run check`. The tests check that:

- the header is complete and `name` matches the folder,
- every example lesson exists and passes the checker,
- the guide stays under 1,200 words,
- the pack is in the index and has a page in these docs (`docs/skills/{name}.mdx`).

The core files (`SKILL.md`, the teaching guide, and the lesson format) need a review from the learn.ninja maintainers. Packs are open to everyone.
