# Lesson format (spec 0.2)

A lesson is one JSON file. Its structure has fixed slots, so the shape can't be broken: `hook`, `loops`, `challenge`, `wrapup`. `schema/lesson.schema.json` is the formal definition; the checker (`scripts/learn.mjs validate`) also enforces the cross-field rules listed at the end.

## Lesson

| Field | Required | Description |
| --- | --- | --- |
| `spec` | yes | Always `"0.2"` |
| `title` | yes | Up to 60 characters; also used in the link |
| `summary` | yes | One sentence shown before starting, up to 160 characters |
| `objective` | yes | What the learner can do afterwards |
| `language` | yes | Language of all learner-facing text (BCP 47: `en`, `es`, `ar`, `pt-BR`…) |
| `targetLanguage` | no | The language being taught, for language lessons |
| `level` | yes | `beginner`, `intermediate`, or `advanced` |
| `estimatedMinutes` | yes | 5–10 |
| `topic` | no | A short label, e.g. "UI design" |
| `source` | no | `{ "title": "…", "url": "https://…" }` credit for the material |
| `hook` | yes | One `choice` or `compare` step; not scored |
| `loops` | yes | 1–3 of `{ "concept": Concept, "practice": [2–4 steps] }`; 4–8 practice steps in total |
| `challenge` | yes | One step of any type except `number` |
| `wrapup` | yes | `{ "takeaways": [2–4 strings], "next": "suggested next lesson" }` (`next` is optional) |

## Concept

`{ "id", "title" (≤60 chars), "body" (rich text, ≤80 words), "visual"?, "term"?: { "word", "definition" } }`

## Every step

`{ "id", "type", "prompt" (rich text, ≤40 words), "visual"?, "hint"?, "explanation" }` plus the fields for its type. Ids are unique across the whole lesson.

## Visuals

```json
{ "kind": "html", "html": "<div class='flex gap-2'><button class='btn'>Save</button></div>", "css": "optional extra CSS", "height": 200 }
{ "kind": "code", "language": "javascript", "code": "const x = 1;\nconsole.log(x);", "highlight": [2], "hotspots": [{ "id": "l2", "line": 2 }] }
{ "kind": "math", "tex": "A = P(1 + r)^n" }
```

`height` is optional (the player sizes HTML visuals to their content). `hotspots` on code are only for `hotspot` steps.

## Options

Used by `choice` and `compare`: `{ "id", "text"? (rich text), "visual"?, "feedback"? (required on wrong options), "lang"? }`. Give each option text or a visual.

## The building blocks

```json
{ "id": "p1", "type": "choice", "prompt": "…", "options": [ … 2–5 … ], "correct": ["a"], "multiple": false, "explanation": "…" }

{ "id": "p2", "type": "compare", "prompt": "Which … is clearer?", "options": [ … exactly 2 … ], "correct": "b", "explanation": "…" }

{ "id": "p3", "type": "hotspot", "prompt": "Tap the …",
  "visual": { "kind": "html", "html": "<button data-hotspot='save' class='btn'>Save</button><button data-hotspot='more' class='btn'>More</button>" },
  "correct": ["more"], "multiple": false, "explanation": "…" }

{ "id": "p4", "type": "sort", "prompt": "Sort each …",
  "groups": [ { "id": "g1", "label": "Goal" }, { "id": "g2", "label": "Non-goal", "lang": "en" } ],
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
- `blank` options: `numeric` and `tolerance` (for numbers in gaps), `strictAccents` (when accents change meaning, like *si* and *sí*).
- `number` steps exist in the spec but aren't allowed in v1.

## Rules the checker enforces

- Hook is `choice` or `compare`; 1–3 loops; 2–4 practice per loop; 4–8 practice in total.
- Unique ids; every reference points to something real (`correct`, `group`, `alsoAccept`, `[[gap]]` ids, hotspot ids, code hotspot lines).
- Every wrong `choice`/`compare` option has `feedback`; every step has an `explanation`; a `choice` has at least one wrong option; a `scenario` has a `best` option.
- Prompts ≤40 words; concept bodies ≤80 words.
- No `number` steps; every `blank` has `choices` that include an accepted answer.
- Formulas in `\( … \)` are balanced and render; language codes are valid BCP 47.
- HTML visuals: no scripts, event handlers, iframes, forms, objects, embeds, `javascript:` links, or external URLs; each under 20 KB; the whole file under 500 KB.
