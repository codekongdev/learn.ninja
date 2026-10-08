---
title: Overview
description: How the learn.ninja skill is built. A core every lesson uses, plus topic packs with extra guidance for particular subjects.
---

The learn.ninja skill tells your agent how to turn what you give it into a good lesson. It has two layers.

## The core

Every lesson uses the core, whatever the subject:

- **`SKILL.md`**: the steps. Pick one idea, write the lesson, check it, publish it.
- **The teaching guide**: how to shape a lesson, choose bricks, write feedback that teaches, and build visuals.
- **The [lesson format](/docs/lessons/lesson-format)** and the checker. The checker rejects anything that breaks the format or could run code, whatever a guide says.

## Topic packs

A topic pack adds advice for one subject: how good teachers explain it, which bricks fit it, and the mistakes learners really make. The agent reads the pack index, picks the pack that fits (two at most), and reads its guide on top of the core. If no pack fits, it uses the core alone.

| Pack                                | For lessons on…                                           |
| ----------------------------------- | --------------------------------------------------------- |
| [Math](/docs/skills/math)           | Arithmetic, percentages, algebra, probability, money math |
| [Languages](/docs/skills/languages) | Vocabulary, phrases, and grammar in a foreign language    |

Packs only add. Where a pack and the core disagree, the core wins, and every lesson still has to pass the checker.

Packs come with the skill, so `npx skills add https://learn.ninja -g` installs all of them. Run it again to get new and updated packs.

Teach a subject well? [Write a pack](/docs/skills/write-a-pack).
