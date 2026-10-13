---
name: math
description: Arithmetic, fractions, percentages, algebra, geometry, probability, statistics, and everyday money math. Use when the learner calculates, simplifies, solves, or reasons with numbers and formulas.
examples: compound-interest
version: 1.0.1
---

# Math

Extra guidance for lessons where the learner works with numbers and formulas. It adds to `reference/teaching-guide.md`; where they disagree, the teaching guide wins.

## 1. One method, not a chapter

- Teach **one method or relationship**: "Find a percentage change", "Add fractions with different denominators", "Solve a one-step equation". Not "Fractions".
- Write the `objective` as a calculation the learner can do afterwards: "Work out the new price after a 15% discount".
- **Hook:** ask for a quick estimate or gut answer that most people get wrong. "A price rises 50%, then falls 50%. Is it back where it started?" The first concept brick explains why.

## 2. Concepts: worked example first

- **Concrete numbers before the general rule.** Work one example with real numbers, then show the formula it follows.
- **One operation per line.** In a worked example, each step does one thing, so the learner can see where each number comes from. Put the key formula in a `math` visual; use `\( … \)` for inline math in text.
- **Name the quantity before the symbol:** "the interest rate, `\( r \)`", not just `\( r \)`.
- **Keep numbers friendly.** Pick numbers that make the idea visible and the arithmetic easy (10%, 200, `\( \tfrac{1}{4} \)`). Learners have no calculator in the player, and a messy sum hides the idea.
- **Show why, briefly.** One sentence on why the method works ("dividing by the original amount turns the change into a share of where you started") beats a rule to memorise.

## 3. Practice that fades the support

After each concept brick, take support away one step at a time:

1. **Finish a worked example:** a `blank` where the learner picks the missing step or term from chips.
2. **Solve a full problem** with the same structure: a `choice` with mistake-based options.
3. **Vary it:** new numbers, a new context, or the problem run backwards ("the discounted price is $68; what was the original?").

How the question bricks fit math:

| Type       | Natural for…                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| `choice`   | The final answer; which formula applies; which statement is true                                                 |
| `blank`    | A missing step, term, or sign in a formula or worked solution (`"numeric": true` for a number gap)               |
| `hotspot`  | Finding the wrong line in a worked solution: one `data-hotspot` element per line in an HTML visual               |
| `sort`     | Classifying: rational or irrational; linear, quadratic, or exponential; which expressions equal `\( 2(x + 3) \)` |
| `order`    | Steps of a procedure where order matters: solving an equation, order of operations                               |
| `match`    | Equivalent forms: fraction ↔ decimal ↔ percent, expression ↔ simplified form                                     |
| `compare`  | Two solution methods, or two charts of the same data: which is right, or clearer                                 |
| `scenario` | Choosing which calculation a real decision needs (loan offers, unit prices)                                      |

## 4. Wrong options from real errors

Every numeric `choice` should have 3–4 options, each produced by a specific, common slip, with feedback that names the slip and shows the right step. Mistakes worth building on:

- **Wrong base for a percentage:** a 25% discount undone by adding 25%; percent change measured from the new value.
- **Percent vs percentage points:** 4% → 5% is 1 point, but a 25% increase.
- **Fractions:** adding numerators and denominators (`\( \tfrac{1}{2} + \tfrac{1}{3} = \tfrac{2}{5} \)`); forgetting to scale the numerator too.
- **Order of operations:** working left to right through `\( 2 + 3 \times 4 \)`.
- **Signs:** subtracting a negative; moving a term across `\( = \)` without changing its sign.
- **Distributing powers:** `\( (a + b)^2 = a^2 + b^2 \)`.
- **Probability:** adding probabilities that should be multiplied, or the reverse.
- **Averages:** mean where the median is meant, or averaging averages of unequal groups.
- **Units and scale:** mixing cm and m; squaring a length but not its unit; one step short.

The right answer shouldn't stand out: it shouldn't be the only round number, always the middle value, or the longest option.

## 5. Accuracy

- **Work every answer yourself, step by step, before writing the options.** Then check each wrong option: is it really wrong, and does it really come from the slip its feedback names?
- **State rounding and units in the prompt** ("to the nearest dollar", "in cm²"), and make sure exactly one option is right after rounding.
- Don't simplify away conditions that matter (`\( x \neq 0 \)`, "assuming the rate stays the same").

## 6. Notation

- Inline math goes in `\( … \)`; a formula on its own line goes in a `math` visual. A `$` is always a plain dollar sign.
- Use `\times` or `\cdot` for multiplication, never `*`, and `\frac{a}{b}` (or `\tfrac` inline) for fractions.
- **Follow the lesson's language conventions:** a decimal comma where it's normal (`de`, `fr`, `es`, `pt-BR`…). Inside TeX, write it as `3{,}5` so it doesn't get extra space.
- **Graphs and diagrams** are inline SVG: label the axes, color with theme classes, and add `direction='ltr'` to the `<svg>` (see the teaching guide's Visuals section).
