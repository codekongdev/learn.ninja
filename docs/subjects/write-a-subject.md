---
title: Add a subject
description: Add a subject you know how to teach, or improve an existing one.
---

Subjects live in the repository at `skills/learn/subjects/`, one folder per subject. Anyone can propose a new subject or improve one with a pull request.

## What makes a good subject

A subject is worth adding when it has its own way of being taught: shared notation, typical mistakes, or bricks that fit it especially well. Design, code, music theory, or chemistry could each be one. A single topic, like "fractions", belongs inside a broader subject.

Write down what a good teacher of the subject knows and a general guide doesn't:

- **What one lesson should cover** in this subject, with an example of a good objective.
- **How to explain it:** worked examples, diagrams, notation, conventions.
- **Which bricks fit**, and what each is natural for in this subject.
- **The real mistakes learners make**, so wrong options and feedback come from them.
- **What to check for accuracy** before publishing.

Don't repeat the teaching guide or the lesson format. The agent has already read them.

## The file

Each subject is one `guide.md` with a short header:

```markdown
---
name: music-theory
description: Scales, chords, intervals, and rhythm. Use when the lesson teaches how music is built or read.
examples: major-scales
version: 1.0.0
---

# Music theory

Extra guidance for lessons on music theory. It adds to `reference/teaching-guide.md`; where they disagree, the teaching guide wins.

## 1. …
```

- **`name`**: the folder's name, in lowercase with hyphens.
- **`description`**: what the subject covers and when to use it, in one line. The agent picks a subject from this alone, so make it specific.
- **`examples`**: optional. The names of example lessons in the repo's `examples/` folder that show the subject in use (here, `examples/major-scales.json`), separated by commas.
- **`version`**: the subject's own version, as `major.minor.patch`. Start a new subject at `1.0.0`.

Keep the guide under 1,200 words. Every word costs the agent context, and short, specific guidance gets followed.

## Versions

Each subject is versioned on its own, so improvements can be tracked without a release of the whole skill. Next to `guide.md`, a `CHANGELOG.md` lists what changed in each version, newest first:

```markdown
# Music theory: changes

## 1.1.0

- Added the common mistakes with relative minors.

## 1.0.0

- First version.
```

Whenever you change the guide, bump `version` (patch for wording, minor for new advice, major for a change in approach) and add an entry. The build records each guide's version and a content hash in `subjects/versions.json`; a guide that changed without a bump fails the build and the tests. The index the agent reads shows each subject's version.

## Checks

After adding or changing a subject, run `npm run skill:build -w @workspace/cli` to update the subject index, then `npm run check`. The tests check that:

- the header is complete and `name` matches the folder,
- every example lesson exists and passes the checker,
- the guide stays under 1,200 words,
- the version is bumped when the guide changes, and `CHANGELOG.md` has an entry for it,
- the subject is in the index and has a page in these docs (`docs/subjects/{name}.mdx`).

The core files (`SKILL.md`, the teaching guide, and the lesson format) need a review from the learn.ninja maintainers. Subjects are open to everyone.
