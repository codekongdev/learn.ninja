# Testing the lesson-planning branch

This branch (`skill/lesson-planning`) changes how the learn skill plans a lesson. It's for local testing only: nothing here is deployed to learn.ninja. Delete this file and `eval/` before merging.

Proposal with diagrams and reasons: https://claude.ai/artifact/QaHSJhToZqMFYcKgpmanyF (ask Gene for access).

## What changed

- **Questions only for a bare topic.** The agent reads the input and decides three things, then reports them in one line after publishing ("Beginner · standard · adult"), with an offer to remake. Only when the request is just a topic ("how a car works") does it ask first: one message, up to two questions, each with a default.
  - **Level:** ranked signals (`skills/learn/levels/index.md`). A plain "explain X" is beginner however advanced X is.
  - **Size:** short, standard, or long (`skills/learn/reference/planning.md`).
  - **Reading age:** adult or child (`reference/planning.md`).
- **Paths.** A topic too big for one lesson becomes a path of 2–6 lessons. The agent writes lesson 1, keeps a `path.md` plan, lists the rest, and makes the next one only when asked.
- **Limits** (`packages/spec`): 1–4 concept bricks (was 1–3), 2–4 questions after each (unchanged), 3–12 in total (was 4–8), at most 20 bricks (was 15), 3–15 minutes (was 5–10).
- Skill version 0.6.0.

## Run it

```bash
git fetch origin
git switch skill/lesson-planning
npm ci
npm run dev
```

Publish to your local server, never to learn.ninja: the live site still checks lessons against main's limits and rejects the bigger ones.

```bash
LEARN_API_URL=http://localhost:3000 node skills/learn/scripts/learn.mjs publish lesson.json --new
```

## Make the agent use this branch's skill

If you installed the skill with `npx skills add https://learn.ninja -g`, your agent has main's version. For testing, start a fresh agent session in an empty folder and tell it to use this checkout's skill:

> Use the skill at `<path to repo>/skills/learn/SKILL.md` (read it and follow it exactly). Publish with `LEARN_API_URL=http://localhost:3000` and `--new`. Request: …

A fresh session matters: an agent that has seen the planning discussion will make better guesses than a real user's agent would.

## Prompts to try

Each prompt checks one decision. Note what the agent reports in its one-line summary and whether it matches.

| # | Prompt | Expect |
| --- | --- | --- |
| 1 | Explain quantum entanglement | Beginner, even though the topic is advanced |
| 2 | How Bell tests closed the locality and detection loopholes | Advanced |
| 3 | Make a lesson from https://developer.apple.com/design/human-interface-guidelines/drag-and-drop | Intermediate, and a path (lesson 1 only) |
| 4 | Teach fractions to my 9-year-old | Beginner, child reading age |
| 5 | Just explain how photosynthesis works | Beginner, standard |
| 6 | Give me practice on percentage changes | Standard |
| 7 | Make a lesson on Nielsen's 10 usability heuristics | A path: lesson 1 plus the list of the rest |
| 8 | Quick refresher: what's the difference between margin and padding? | Short size |

### Second set

The first set's prompts ended up too close to examples in the skill, so these eight are new. Don't copy any of them into the skill's examples.

| # | Prompt | Expect |
| --- | --- | --- |
| 1 | How does a blockchain work? | Beginner |
| 2 | Refresher on JavaScript closures | Intermediate (a refresher) |
| 3 | Teach my 10-year-old about the water cycle | Beginner, child |
| 4 | Walk me through how React's reconciliation decides when to reuse or remount a component, given keys and element types | Intermediate or advanced |
| 5 | Drill me on converting between fractions, decimals and percentages | Standard |
| 6 | Teach me the Gestalt principles of visual perception | A path |
| 7 | Quick one: what's the difference between a stock and a bond? | Short, beginner |
| 8 | Make a lesson from https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching | Intermediate; a path or a long lesson |

### Third set: asking first, and everyday wording

The agent should ask first only for a bare topic. When it asks, answer as shown and check the lesson follows the answer.

| # | Prompt | Expect | If it asks, answer |
| --- | --- | --- | --- |
| 1 | How a car works | Asks first | "For my 12-year-old" → beginner, child |
| 2 | Make a lesson about the French Revolution | Asks first | "For me, I know the basics. Quick one." → intermediate, short |
| 3 | Teach me compound interest | Asks first | "go" → beginner, standard, adult |
| 4 | Explain how a car works | No question; beginner | |
| 5 | Quiz my 10-year-old on how a car works | No question; beginner, child | |
| 6 | Give me some hands-on practice with Git branching | No question | |
| 7 | Make it practical: SQL window functions | No question; intermediate or above | |
| 8 | Check my understanding of supply and demand | No question | |

For each lesson, also check:

- Did `validate` pass on the first or second try?
- Does the lesson match its size's shape (`skills/learn/reference/planning.md`)?
- Does it play well? Anything confusing, too long, or too thin?

To compare with today's behaviour, run the same prompts with main's skill (`git switch main`, restart the dev server).

## Results so far

Two runs of 16 lessons each (8 prompts, this branch's skill vs main's) are in `eval/lesson-planning/`, with the scorecard in `eval/lesson-planning/RESULTS.md` and a command to publish them all to your local server. Delete `eval/` along with this file before merging.
