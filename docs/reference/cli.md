---
title: CLI
description: The learn command the skill uses to check and publish lessons.
---

The skill ships with a small command-line tool, `scripts/learn.mjs`, in the skill's folder. Your agent runs it for you. It needs Node.js 18 or newer and nothing else.

```bash
node <skill-folder>/scripts/learn.mjs <command>
```

## Commands

### `validate`

Checks a lesson against the [lesson format](/docs/lessons/lesson-format) and prints every issue, with the path to the field.

```bash
node scripts/learn.mjs validate lesson.json
```

### `publish`

Checks the lesson, then publishes it and prints the link. If this lesson was published before from the same folder, it updates the same link instead.

```bash
node scripts/learn.mjs publish lesson.json
```

The edit token for each published lesson is saved in `.learn/state.json` next to where you run it. Don't delete or share that file.

Add `--new` to publish a separate copy with a new link:

```bash
node scripts/learn.mjs publish lesson.json --new
```

### `schema`

Prints the path to the lesson JSON Schema bundled with the skill.

```bash
node scripts/learn.mjs schema
```

## Options

| Option | Description |
| --- | --- |
| `--json` | Print machine-readable JSON instead of text |
| `--api <url>` | Publish somewhere else. Defaults to `$LEARN_API_URL`, then `https://learn.ninja` |
| `--version` | Print the skill version |
| `--help` | Print the help text |
