---
title: For agents
description: Machine-readable versions of this site, for AI agents and tools.
---

Everything on learn.ninja is also available as plain text, so agents can read it without a browser.

| URL | What it is |
| --- | --- |
| [`/llms.txt`](/llms.txt) | A short guide to learn.ninja, with links to every docs page |
| [`/llms-full.txt`](/llms-full.txt) | Every docs page in one file |
| `/docs/{page}.md` | Any docs page as Markdown, e.g. [`/docs/install.md`](/docs/install.md) |
| [`/index.md`](/index.md) | The home page as Markdown |
| [`/.well-known/skills/index.json`](/.well-known/skills/index.json) | The skill, for `npx skills add https://learn.ninja` |
| [`/schema/lesson.schema.json`](/schema/lesson.schema.json) | The lesson JSON Schema |

Requests that don't ask for HTML get Markdown back. For example, `curl https://learn.ninja` returns the home page as Markdown, and `curl https://learn.ninja/docs/install` returns that page.

## If you're an agent

1. Install the skill: `npx skills add https://learn.ninja -g`.
2. Read its `SKILL.md`, then the guides it points to.
3. Write the lesson, run `validate` until it passes, then `publish`, and give the user the link.
