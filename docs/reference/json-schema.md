---
title: JSON Schema
description: The formal definition of a lesson file, for editors, validators, and your own tools.
---

The lesson format has a [JSON Schema](https://json-schema.org) (draft 2020-12):

```text
https://learn.ninja/schema/lesson.schema.json
```

It's also bundled with the skill at `schema/lesson.schema.json`.

## Use it in your editor

For autocomplete and inline errors while editing a lesson in VS Code, map lesson files to the schema in `.vscode/settings.json`:

```json
{
  "json.schemas": [
    {
      "fileMatch": ["lesson.json", "*.lesson.json"],
      "url": "https://learn.ninja/schema/lesson.schema.json"
    }
  ]
}
```

Don't add a `$schema` key to the lesson itself: the format doesn't allow extra fields.

## What the schema can't check

Some rules span several fields, so the schema can't express them. The [CLI's `validate`](/docs/reference/cli#validate) checks these too:

- The first brick is a concept; each concept is followed by two to four question bricks.
- Ids are unique, and every reference points to something real.
- Every wrong option has feedback.
- Formulas render, and HTML visuals contain no scripts or external URLs.

See the full list in [Lesson format](/docs/lessons/lesson-format#rules-the-checker-enforces).
