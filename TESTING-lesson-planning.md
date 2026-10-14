# Testing the lesson-planning branch

This branch (`skill/lesson-planning`) changes how the learn skill plans a lesson. It's for local testing only: nothing here is deployed to learn.ninja. Delete this file before merging.

Proposal with diagrams and reasons: https://claude.ai/artifact/QaHSJhToZqMFYcKgpmanyF (ask Gene for access).

## What changed

- **No questions to the user.** The agent reads the input and decides four things, then reports them in one line after publishing ("Beginner · standard · balanced · adult"), with an offer to remake.
  - **Level:** ranked signals (`skills/learn/levels/index.md`). A plain "explain X" is beginner however advanced X is.
  - **Size:** short, standard, or long (`skills/learn/reference/planning.md`).
  - **Mode:** explain, balanced, or practice (`skills/learn/modes/`). It sets how many concept bricks there are and how many questions follow each.
  - **Reading age:** adult or child (`reference/planning.md`).
- **Paths.** A topic too big for one lesson becomes a path of 2–6 lessons. The agent writes lesson 1, keeps a `path.md` plan, lists the rest, and makes the next one only when asked.
- **Limits** (`packages/spec`): 1–4 concept bricks (was 1–3), 1–6 questions after each (was 2–4), 3–12 in total (was 4–8), at most 20 bricks (was 15), 3–15 minutes (was 5–10).
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
| 5 | Just explain how photosynthesis works | Explain mode |
| 6 | Give me practice on percentage changes | Practice mode |
| 7 | Make a lesson on Nielsen's 10 usability heuristics | A path: lesson 1 plus the list of the rest |
| 8 | Quick refresher: what's the difference between margin and padding? | Short size |

For each lesson, also check:

- Did `validate` pass on the first or second try?
- Does the lesson match its mode's shape (`skills/learn/modes/index.md`)?
- Does it play well? Anything confusing, too long, or too thin?

To compare with today's behaviour, run the same prompts with main's skill (`git switch main`, restart the dev server).
