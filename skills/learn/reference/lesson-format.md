# Lesson format (spec 0.3)

A lesson is one JSON file with four slots: `hook`, `bricks`, `challenge`, `wrapup`. A brick is one screen: either a `concept` brick (theory) or a question brick (`choice`, `compare`, `hotspot`, `sort`, `order`, `match`, `blank`, `scenario`). `schema/lesson.schema.json` is the formal definition; the checker (`scripts/learn.mjs validate`) also enforces the cross-field rules listed at the end.

## Lesson

| Field              | Required | Description                                                                                                                                                         |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `spec`             | yes      | Always `"0.3"`                                                                                                                                                      |
| `title`            | yes      | Up to 60 characters; also used in the link                                                                                                                          |
| `summary`          | yes      | One sentence shown before starting, up to 160 characters                                                                                                            |
| `objective`        | yes      | What the learner can do afterwards                                                                                                                                  |
| `language`         | yes      | Language of all learner-facing text (BCP 47: `en`, `es`, `ar`, `pt-BR`…)                                                                                            |
| `targetLanguage`   | no       | The language being taught, for language lessons                                                                                                                     |
| `level`            | yes      | Who it's for: `beginner`, `intermediate`, or `advanced` (`levels/index.md` says how to choose)                                                                      |
| `estimatedMinutes` | yes      | 3–15, by size: short 3–5, standard 5–10, long 10–15 (`reference/planning.md`)                                                                                       |
| `topic`            | no       | A short label, e.g. "UI design"                                                                                                                                     |
| `source`           | no       | `{ "title": "…", "url": "https://…" }` credit for the material                                                                                                      |
| `hook`             | yes      | One `choice` or `compare` brick; not scored                                                                                                                         |
| `bricks`           | yes      | The lesson in play order: 1–4 `concept` bricks, each followed by 2–4 question bricks that practise it; 3–12 question bricks in total, at most 20 bricks. The first brick is a `concept` |
| `challenge`        | yes      | One question brick of any type except `number`                                                                                                                      |
| `wrapup`           | yes      | `{ "takeaways": [2–4 strings], "next": "suggested next lesson" }` (`next` is optional)                                                                              |

```json
"bricks": [
  { "id": "c1", "type": "concept", … },
  { "id": "p1", "type": "choice", … },
  { "id": "p2", "type": "sort", … },
  { "id": "c2", "type": "concept", … },
  { "id": "p3", "type": "hotspot", … },
  { "id": "p4", "type": "order", … }
]
```

Brick ids are unique across the whole lesson, including the hook and the challenge.

## Concept bricks

`{ "id", "type": "concept", "title" (≤60 chars), "body" (rich text, ≤80 words), "visual"? }`

```json
{
  "id": "c1",
  "type": "concept",
  "title": "Buttons do, links go",
  "body": "Ask whether the action **does** something or **goes** somewhere."
}
```

## Every question brick

`{ "id", "type", "prompt" (rich text, ≤40 words), "visual"?, "hint"?, "explanation" }` plus the fields for its type.

## Visuals

```json
{ "kind": "html", "html": "<div class='flex gap-2'><button class='btn'>Save</button></div>", "alt": "A single filled Save button.", "css": "optional extra CSS", "height": 200 }
{ "kind": "code", "language": "javascript", "code": "const x = 1;\nconsole.log(x);", "highlight": [2], "hotspots": [{ "id": "l2", "line": 2 }] }
{ "kind": "math", "tex": "A = P(1 + r)^n" }
```

`alt` is one sentence saying what the visual shows, for screen readers, at most 200 characters; it's required on a concept's or question's HTML visual, and on an option's HTML visual that has no caption (hotspot visuals are read through their regions, item visuals through their captions). `height` is optional (the player sizes HTML visuals to their content). `hotspots` on code are only for `hotspot` bricks.

## Options

Used by `choice` and `compare`: `{ "id", "text"? (rich text), "visual"?, "feedback"? (required on wrong options), "lang"? }`. Give each option text or a visual. Options with visuals show as cards in two columns; in a `choice`, give either every option a visual or none. Give each option visual an `alt` (screen readers announce it). `text` under a visual is a caption: add one only for what the visual can't show, like a name to refer to it by, never text the visual already shows.

## The question bricks

```json
{ "id": "p1", "type": "choice", "prompt": "…", "options": [ … 2–5 … ], "correct": ["a"], "multiple": false, "explanation": "…" }

{ "id": "p2", "type": "compare", "prompt": "Which … is clearer?", "options": [ … exactly 2 … ], "correct": "b", "explanation": "…" }

{ "id": "p3", "type": "hotspot", "prompt": "Tap the …",
  "visual": { "kind": "html", "html": "<button data-hotspot='save' class='btn'>Save</button><button data-hotspot='more' class='btn'>More</button>" },
  "correct": ["more"], "multiple": false, "explanation": "…" }

{ "id": "p4", "type": "sort", "prompt": "Sort each …",
  "groups": [ { "id": "g1", "label": "Buenos días", "lang": "es" }, { "id": "g2", "label": "Buenas noches", "lang": "es" } ],
  "items": [ { "id": "a", "text": "…", "group": "g1" }, … 4–8 … ], "explanation": "…" }

{ "id": "p5", "type": "order", "prompt": "Put … in order.",
  "items": [ { "id": "a", "text": "First" }, { "id": "b", "text": "Second" }, { "id": "c", "text": "Third" } ],
  "alsoAccept": [ ["b", "a", "c"] ], "explanation": "…" }

{ "id": "p6", "type": "match", "prompt": "Match each …", "leftLang": "es",
  "pairs": [ { "left": "Hola", "right": "Hello" }, … 3–5 … ], "explanation": "…" }

{ "id": "p7", "type": "blank", "prompt": "Complete the sentence.", "format": "text", "lang": "es",
  "template": "—Bien, [[g]]. ¿Y tú?",
  "blanks": [ { "id": "g", "accept": ["gracias"], "choices": ["gracias", "adiós", "hola"],
                "mistakes": [ { "answer": "adiós", "feedback": "Adiós means goodbye." } ] } ],
  "explanation": "…" }

{ "id": "ch", "type": "scenario", "prompt": "What do you do?", "situation": "…",
  "options": [ { "id": "a", "text": "…", "quality": "best", "outcome": "…" },
               { "id": "b", "text": "…", "quality": "okay", "outcome": "…" },
               { "id": "c", "text": "…", "quality": "poor", "outcome": "…" } ],
  "explanation": "…" }
```

- `blank` with `"format": "code"` takes a `language` and is usually `"caseSensitive": true`.
- `blank` options: `numeric` and `tolerance` (for numbers in gaps), `strictAccents` (when accents change meaning, like _si_ and _sí_).
- `number` bricks exist in the spec but aren't allowed in v1.

## Rules the checker enforces

- Hook is `choice` or `compare`; the first brick is a `concept`; 1–4 concept bricks; 2–4 question bricks after each concept brick; 3–12 question bricks in `bricks` in total; at most 20 bricks; the challenge is a question brick.
- Unique ids; every reference points to something real (`correct`, `group`, `alsoAccept`, `[[gap]]` ids, hotspot ids, code hotspot lines).
- Every `choice` has `multiple`, even when it's `false`; every wrong `choice`/`compare` option has `feedback`; every question brick has an `explanation`; a `choice` has at least one wrong option; a `scenario` has a `best` option.
- Prompts ≤40 words; concept bodies ≤80 words.
- No `number` bricks; every `blank` has `choices` that include an accepted answer.
- Formulas in `\( … \)` are balanced and render; language codes are valid BCP 47.
- HTML visuals: no scripts, event handlers, iframes, forms, objects, embeds, `javascript:` links, or external URLs; each under 20 KB; the whole file under 500 KB. A concept's or question's HTML visual has `alt`.
