# Teaching guide

How to turn the user's input into a lesson that's genuinely good to play. Read this before writing the lesson file.

## 1. Choose one idea

- A lesson teaches **one core idea** in **5–10 minutes**. Set `estimatedMinutes` honestly (5–10).
- Write the `objective` as something the learner can *do* afterwards: "Give each view one clear primary action", not "Learn about buttons".
- If the input covers several ideas, pick the one everything else depends on. Mention the others to the user as follow-up lessons, and you can suggest one in `wrapup.next`.
- Stay faithful to the source. If the input is an article, teach what it says; don't add claims it doesn't support.

## 2. Shape: interleaved, not "read then quiz"

```
hook → loop 1 (concept → 2–4 practice) → loop 2 … (1–3 loops) → challenge → wrap-up
```

- **Hook:** a `choice` or `compare` question asked *before* any teaching. It's a guess and isn't scored. Pick something intriguing whose answer the first concept explains. Its `explanation` should make the learner want to know why.
- **Concept cards:** one idea each, 80 words at most. Give a concrete example or a visual. Add a `term` when there's a key word to remember.
- **Practice:** 2–4 steps right after each concept, 4–8 in total across the lesson. At least 2 practice steps per concept.
- **Challenge:** one harder, applied step that combines the concepts, usually a `scenario`, a realistic `hotspot`, or a `sort`.
- **Wrap-up:** 2–4 takeaways, each one sentence the learner could act on.

## 3. Choose building blocks

Use **at least 3 different types**, and **never more than 2 of the same type in a row**.

| Category | Types | Use it to |
| --- | --- | --- |
| Judge | `choice`, `compare` | Recognize the right answer, or the better of two examples |
| Spot | `hotspot` | Find the problem inside a realistic example (a UI, a document, a line of code) |
| Organize | `sort`, `order`, `match` | Classify, sequence, or pair several things at once |
| Decide | `scenario` | Weigh trade-offs and make a call in context |

Good progression: start with Judge, mix in Spot and Organize during practice, and end on Decide. Pick the type that fits the skill, not for variety's sake:

- **compare:** "which is better" between two concrete examples. Great with HTML visuals (two UIs) or two short texts.
- **choice:** one correct answer (or `multiple: true` for "pick all that apply"). 2–5 options.
- **hotspot:** tap the part of a visual that matters. In HTML, mark tappable elements with `data-hotspot="id"`; in code, list `hotspots` by line number.
- **sort:** 4–8 items into 2–3 groups. Every group should get at least one item.
- **order:** 3–6 items written in the correct order (the player shuffles them). Use `alsoAccept` if another order is genuinely right too.
- **match:** 3–5 pairs, e.g. terms and meanings, words and translations.
- **blank:** fill gaps in a sentence or code from word chips. Each gap's `choices` include the right answer plus 1–2 believable decoys.
- **scenario:** a short situation and 2–4 options, each with a `quality` (`best`, `okay`, `poor`) and an `outcome` that shows the consequence.

## 4. Feedback that teaches

- **Every wrong option gets `feedback`** that explains *why* it's wrong, in a sentence or two. Name the misconception: "That's simple interest. Year 2 also earns interest on year 1's $50."
- **Build wrong options from real mistakes** people make, not from obviously silly answers. A good wrong option is tempting.
- **Every step gets an `explanation`** of why the right answer is right. It's shown after the learner answers.
- **Blanks:** add a `mistakes` entry for each decoy chip, explaining it.
- **Hints** (optional) nudge without giving the answer away: "What is the one thing this page exists to help people do?"
- **Scenario outcomes** describe what happens next, so even a poor choice teaches something.

## 5. Writing style

- Prompts: 40 words at most, one clear task. Questions end with a question mark.
- Plain, friendly, specific language. Short sentences. No filler ("In this lesson we will…").
- Rich text supports `**bold**`, `*italic*`, `` `code` ``, and inline formulas `\( ... \)`. A `$` is always a plain dollar sign.
- Don't reveal the answer in the prompt or the concept card's wording.

## 6. Visuals

Visuals make lessons feel real. There are three kinds:

- **`html`**: UI examples, diagrams, simple charts, layouts. It runs in a sandbox with no scripts.
- **`code`**: code with syntax highlighting. Give the `language` (e.g. `javascript`, `python`, `css`).
- **`math`**: a formula on its own line, in TeX: `{ "kind": "math", "tex": "A = P(1 + r)^n" }`.

### The built-in UI kit for HTML visuals

HTML visuals use **Basecoat** (shadcn/ui's design system as plain HTML) plus **Tailwind utility classes** for layout. They match the player's look automatically.

| Component | Markup |
| --- | --- |
| Button | `<button class="btn">Save</button>`; add `data-variant="secondary"`, `"outline"`, `"ghost"`, `"link"`, or `"destructive"`; `data-size="sm"`, `"lg"`, `"xs"` |
| Input | `<input class="input" placeholder="Email">`, with `<label class="label">Email</label>` |
| Textarea | `<textarea class="textarea"></textarea>` |
| Checkbox | `<input type="checkbox" class="input" checked>` |
| Switch | `<input type="checkbox" role="switch" class="input">` |
| Badge | `<span class="badge">New</span>`; `data-variant="secondary"`, `"outline"`, `"destructive"` |
| Alert | `<div class="alert"><h2>Heads up</h2><section>Your trial ends soon.</section></div>`; `data-variant="destructive"` |
| Card | `<div class="card"><header><h2>Title</h2><p>Description</p></header><section>Body</section><footer>…</footer></div>` |
| Table | `<table class="table">…</table>` |
| Keyboard key | `<kbd class="kbd">⌘K</kbd>` |

- **Layout:** Tailwind utilities like `flex gap-2 flex-wrap`, `grid grid-cols-2 gap-4`, `p-4`, `rounded-lg`, `border`, `text-sm`, `font-medium`, `text-muted-foreground`, `bg-muted`.
- **Theme colors:** use the theme's color names (`bg-primary`, `text-primary-foreground`, `bg-muted`, `border-border`, `text-destructive`) rather than fixed colors, so visuals work in light and dark mode.
- **Right-to-left:** use direction-aware spacing (`ms-2`, `me-2`, `ps-4`, `pe-4`, `start-0`, `end-0`), not left/right ones.
- **Keep visuals small and focused:** show just enough to make the point. Each visual must be under 20 KB.
- **Not allowed** (the checker rejects them): `<script>`, event handlers like `onclick`, `<iframe>`, `<form>`, `<object>`, `<embed>`, `javascript:` links, and anything loaded from an external URL (images, fonts, stylesheets). Interactive components (dropdowns, tabs, dialogs) can be shown in a fixed state but can't be operated.
- **No images or photos in v1.** Draw what you need with HTML/CSS or inline SVG.

## 7. Languages

- Write all learner-facing text in the lesson's `language` (a BCP 47 code such as `en`, `es`, `ar`, `pt-BR`).
- **Language-learning lessons:** `language` is the language you're teaching *in* and `targetLanguage` is the one being learned. Mark every phrase in the target language with `lang`: on options, `order` and `sort` items, `sort` group labels, `blank` steps, and `leftLang` / `rightLang` on `match` pairs.
- **Never translate code**, identifiers, or program output, whatever the lesson's language.

## 8. v1 limits

- No `number` steps. Ask numeric questions as `choice` with 3–4 options built from common slips (wrong formula, one step short, wrong unit), each with feedback.
- Every `blank` has `choices` (word chips); there's no free typing yet.
- No images, audio, or free-text answers.

## 9. Before you publish

- Run `validate` and fix every issue. The messages say exactly what to change.
- Read the lesson once as a learner: is the hook intriguing? Does each concept explain the practice that follows? Is every wrong option's feedback specific? Is the challenge harder than the practice?
