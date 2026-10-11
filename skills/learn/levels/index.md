# Levels

A lesson's `level` says who it's for. It changes what the lesson assumes, how hard the questions are, and how much help they give. It never changes the shape: every level has the same hook, 1–3 concept bricks with 2–4 question bricks each, one challenge, and 2–4 takeaways, within the same limits.

Pick the level, then read only that level's file:

1. **The user's words win:** a named level, or an audience ("my team of senior engineers", "my kid", "people new to statistics").
2. Otherwise **go by what the input assumes.** Text that explains its own terms is `beginner` or `intermediate`; text written for people already in the field is `advanced`.
3. **If unclear, `beginner`.**

Tell the user which level you chose, and that you can remake the lesson at another.

Levels are relative to the subject, so each file says what to assume. Lessons drift to the middle: beginner lessons pick up jargon, advanced lessons re-teach the basics. Each file ends with a check for that.

| Level          | For                                             | Guide                    | Example                                  |
| -------------- | ----------------------------------------------- | ------------------------ | ---------------------------------------- |
| `beginner`     | Never done this, or only a little               | `levels/beginner.md`     | `examples/button-hierarchy.json`         |
| `intermediate` | Knows the basics; wants to use them             | `levels/intermediate.md` | `examples/correlation-vs-causation.json` |
| `advanced`     | Significant prior learning; analyses and judges | `levels/advanced.md`     | `examples/bronze-age-collapse.json`      |
