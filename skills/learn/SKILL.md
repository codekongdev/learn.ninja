---
name: learn
description: Turn anything the user gives you (a topic, an article, notes, docs, a transcript, code) into one short, interactive lesson and publish it as a shareable link. Use when the user asks to make, generate, create, or publish a lesson, quiz, tutorial, or interactive explainer, or to teach someone a concept.
---

# Learn: make one interactive lesson and publish it

The steps and guides for this skill live on learn.ninja and change often. Get the current ones first, then follow them.

1. In the folder where the lesson will be written, run:
   ```bash
   node <skill-folder>/scripts/learn.mjs sync
   ```
   `<skill-folder>` is the folder this SKILL.md is in. Needs Node 18 or newer and network access.
2. Read `.learn/skill/steps.md` and follow it. It has every step, the guides to read, and the commands that check and publish the lesson.
3. If `sync` can't reach learn.ninja, follow the `steps.md` it names instead: the copy from your last sync, or the one in this folder that came with the install.
4. If `sync` says this copy of the skill is too old, stop and give the user the update command it prints.
