---
title: Subjects
description: Extra teaching advice for particular fields. The agent reads the subject that fits on top of the core skill.
---

The skill has a **core** every lesson uses: `SKILL.md`, the teaching guide, the [lesson format](/docs/lessons/lesson-format), the [level guides](/docs/lessons/levels), and the checker. A **subject** adds advice for one field: how good teachers explain it, which bricks fit it, and the mistakes learners really make. The agent reads the subject that fits (two at most) on top of the core. Where they disagree, the core wins, and every lesson still has to pass the checker.

| Subject   | Use it for                                                                                              | Guide                         |
| --------- | ------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Math      | Arithmetic, fractions, percentages, algebra, geometry, probability, statistics, and everyday money math | `subjects/math/guide.md`      |
| Languages | Learning a foreign language: vocabulary, phrases, grammar, and when to use each                         | `subjects/languages/guide.md` |

Subjects come with the skill, so the install command gets all of them. Run it again for new and updated subjects.

## Add a subject

Subjects live in the repository at `skills/learn/subjects/{name}/guide.md`, one folder per subject. A guide is under 1,200 words of what a good teacher of the subject knows and a general guide doesn't: what one lesson should cover, how to explain it, which bricks fit, the real mistakes learners make, and what to check for accuracy. Its header has a `name`, a one-line `description` the agent picks it by, optional `examples`, and a `version`, with a `CHANGELOG.md` next to it. Propose one with a pull request.
