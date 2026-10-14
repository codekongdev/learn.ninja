# Levels

A lesson's `level` says who it's for. It changes what the lesson assumes, how hard the questions are, and how much help they give. It doesn't change the shape: that's the mode's job (`modes/index.md`), within the same limits at every level.

## Pick the level

Go down this list and stop at the first signal you find:

1. **An audience the user names.** A named level, or who it's for: "for my kid" or "for people new to statistics" is `beginner`; "for my team of senior engineers" is `advanced`.
2. **How the request is worded.** Terms of art, a named method, or stated background ("I already use flexbox; teach me grid areas") point up. A plain "explain X", "how does X work", or "what is X" points to `beginner`, however advanced X is: people who ask that way are usually new to it. "Explain like I'm 5" and "in simple terms" are `beginner` too.
3. **What the source assumes**, when the user gives you a document. Text that explains its own terms is `beginner` or `intermediate`; text written for people already in the field, like a platform's design guidelines for a specific interaction, is `intermediate` or `advanced`.
4. **How deep the topic is**, only to break a tie: a topic that needs several other ideas first leans up.
5. **If still unclear, `beginner`.**

| Request | Level |
| --- | --- |
| "Explain simple equations" | `beginner` |
| "Explain quantum entanglement" | `beginner`: an advanced topic asked in plain words |
| "How Bell tests closed the locality and detection loopholes" | `advanced`: terms of art |
| "Solve quadratics by completing the square" | `intermediate`: a named method that assumes algebra |
| A link to a design-guidelines page on drag and drop | `intermediate`: the page assumes the reader designs interfaces |
| "Fractions for my 9-year-old" | `beginner`, child reading age (`reference/planning.md`) |

Tell the user which level you chose, and that you can remake the lesson at another.

Levels are relative to the subject, so each file says what to assume. Lessons drift to the middle: beginner lessons pick up jargon, advanced lessons re-teach the basics. Each file ends with a check for that.

| Level          | For                                             | Guide                    | Example                                  |
| -------------- | ----------------------------------------------- | ------------------------ | ---------------------------------------- |
| `beginner`     | Never done this, or only a little               | `levels/beginner.md`     | `examples/button-hierarchy.json`         |
| `intermediate` | Knows the basics; wants to use them             | `levels/intermediate.md` | `examples/correlation-vs-causation.json` |
| `advanced`     | Significant prior learning; analyses and judges | `levels/advanced.md`     | `examples/bronze-age-collapse.json`      |
