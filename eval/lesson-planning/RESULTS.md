# Lesson-planning test results

Every lesson here was written by a fresh agent that had only one skill folder and one request: either this branch's skill (`branch/`) or main's (`main/`). Delete this folder before merging.

Scoring is from the choices each agent made and the shape of each lesson file. Gene played several pairs: the branch's lessons held up, and on broad topics they went deeper. The Gestalt path teaches each principle properly, where main's single lesson skims three of them.

## Run 1 (14 October)

| # | Prompt | Should produce | Branch | Main |
| --- | --- | --- | --- | --- |
| 1 | Explain quantum entanglement | Beginner | ✅ Beginner, explain | ✅ Beginner |
| 2 | How Bell tests closed the locality and detection loopholes | Advanced | ✅ Advanced* | ❌ Intermediate |
| 3 | Apple HIG drag-and-drop page | Intermediate, as a path | ✅ Intermediate, 4-lesson path* | ❌ Beginner, one lesson |
| 4 | Teach fractions to my 9-year-old | Beginner, child | ✅ Beginner, child, 5-lesson path | ✅ Beginner |
| 5 | Just explain how photosynthesis works | Explain | ✅ Explain | – No modes |
| 6 | Give me practice on percentage changes | Practice | ✅ Practice | – No modes |
| 7 | Nielsen's 10 usability heuristics | A path | ✅ 6-lesson path | ❌ All 10 in one lesson |
| 8 | Quick refresher: margin vs padding | Short | ✅ Short, but beginner | – Intermediate, 5 min |

\* The skill's level table then contained these two prompts almost word for word, so these results don't count.

Fixed after run 1: "refresher" raises the level; examples that matched the prompts were replaced; child readers default to balanced; practice gets more questions than balanced; the 200-character `alt` limit is documented.

## Run 2 (14 October, held-out prompts)

| # | Prompt | Should produce | Branch | Main |
| --- | --- | --- | --- | --- |
| 1 | How does a blockchain work? | Beginner | ✅ Beginner, explain, 5 questions | ✅ Beginner, 6 questions |
| 2 | Refresher on JavaScript closures | Intermediate | ✅ Intermediate, short, practice | ✅ Intermediate, 8 min |
| 3 | Teach my 10-year-old about the water cycle | Beginner, child, balanced | ✅ All three | ✅ Beginner |
| 4 | Walk me through React reconciliation… | Intermediate+, explain | ✅ Intermediate, explain | ✅ Intermediate |
| 5 | Drill me on fractions, decimals and percentages | Practice | ✅ Practice, 10 questions | – 7 questions |
| 6 | Teach me the Gestalt principles of visual perception | A path | ✅ 6-lesson path | ❌ One lesson, 3 principles |
| 7 | Quick one: stock vs bond | Short | ✅ 4 min | ❌ 5 min (main's minimum) |
| 8 | MDN's HTTP caching guide | Intermediate; path or long | ✅ Intermediate, 4-lesson path | ✅ Intermediate, one lesson |

Branch: 8 of 8. Main matched every level; it can't make short lessons, practice-heavy lessons, or paths. Validation passed first time for 5 of 8 branch lessons and 4 of 8 main ones; most failures on both sides were explanations of 31–35 words (limit 30).

Fixed after run 2: agents aim for about 25-word explanations; the mode guide says what to do when a topic is both a principle and a method; the format reference says `choice` needs `multiple`.

## Play them

The links in the `path.md` files pointed at Gene's local server and won't work for you. Start the dev server on this branch (`npm run dev`), then publish every lesson to it:

```bash
LEARN_API_URL=http://localhost:3000 find eval/lesson-planning -name lesson.json -execdir node "$PWD/skills/learn/scripts/learn.mjs" publish lesson.json --new \;
```

Each publish prints the lesson's local link.
