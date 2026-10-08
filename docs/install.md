---
title: Install the skill
description: Add the learn.ninja skill to Claude Code, Codex, Cursor, or any agent that supports skills.
---

Run this in a terminal:

```bash
npx skills add https://learn.ninja -g
```

The [`skills`](https://github.com/vercel-labs/skills) command finds the learn.ninja skill, asks which of your agents should get it, and copies it into each one. `-g` installs it for your user, so it works in every project. Leave out `-g` to install it only in the current project.

## Supported agents

Any agent that supports skills, including Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, Windsurf, Cline, Roo Code, Kiro, Goose, Amp, OpenCode, Antigravity, and Junie.

To install it for one agent without being asked, name it:

```bash
npx skills add https://learn.ninja -g -a claude-code -y
```

## Or let your agent do it

Paste this into your agent and finish the sentence with what you want to learn:

```text
Install the learn.ninja skill with `npx skills add https://learn.ninja -g`, then read https://learn.ninja/docs and make me a lesson about
```

## Updating

When the skill changes, publishing tells your agent that a newer version is available, with the command to update. You can also run:

```bash
npx skills update
```

## Requirements

- Node.js 18 or newer, for `npx` and for the skill's checker and publisher.
- Network access, to publish the lesson.
