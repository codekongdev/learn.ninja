# Going public

Decided on 2026-11-02: the whole repo goes public under Apache-2.0, in place. `learn-ninja/learn.ninja` stays the repo, nothing is split, and the work is about 5 days plus the decisions. Paid features come later in a private package or an `ee/` folder, as PostHog and Cal.com do, so nothing has to be prepared for them now.

On 2026-11-03 Colin's partner agreed to open-sourcing, and Uxcel Inc confirmed it owns the brand trademarks (the learn.ninja name and logo).

Moved from the "Open-sourcing learn.ninja" doc (Plan, Audit and To-do tabs) on 2026-11-03. This file is in `plans/`, which is deleted before the flip, so anything still open then moves to issues.

## 1. Decide (this week)

- [x] Go ahead: both partners agree to open-source the repo
- [x] Owner: Uxcel Inc holds the copyright and the trademarks, and grants the license. NOTICE, TRADEMARK.md and each `package.json` name Uxcel Inc; the deploy stays on the Uxcel Vercel team
- [x] License: Apache-2.0 for the code; CC-BY-4.0 for `examples/` and `docs/`, which are content, not code
- [x] History: keep the 345 commits if the secret scan is clean, so blame and credit stay; otherwise start from one clean commit
- [x] The ninja (decided 2026-11-03, the PostHog model): his art, lines and clips ship with the player under Apache-2.0, so contributors can improve him and forks run as they are. TRADEMARK.md names the ninja character as brand alongside the name and logo: forks may keep him in the player, but may not use him as their own mascot or in marketing without permission, and may not pass off derivative ninjas as ours. Read ElevenLabs' terms on redistributing generated clips before the flip
- [x] Sign-off: none. Apache-2.0 §5 already licenses every contribution; no DCO, no CLA
- [x] Review promise: Colin and Yan answer pull requests within a week

## 2. Clean (1 day)

- [x] `CLAUDE.md`: remove the Mac mini section (done in #176)
- [x] `CLAUDE.md`: move the planning-doc link to a git-ignored `CLAUDE.local.md`
- [ ] `plans/`: delete it, moving anything still useful to a private doc. Left for now, just before the flip; `brand/claude-directory.md` (the connector-directory submission, with the reviewers' test account) moved here so it goes with it
- [x] Search the repo for internal names: Tailscale hostnames, emails, Slack, Neon and Vercel details, and the reviewer sign-in wording in `.env.example`
- [x] Same search over `skills/learn`, `docs/` and `.claude/skills`. The vendored shadcn skill is MIT (shadcn/ui), so it stays
- [x] Run Gitleaks and TruffleHog over the full history (2026-11-03: TruffleHog none; Gitleaks 15 generic-api-key hits, all test fixtures or edit-token hashes of local e2e lessons, so history stays)

## 3. Fix (1–2 days)

- [x] One skill version: `apps/web` imports `SKILL_VERSION` from `@workspace/cli` instead of pinning its own
- [x] `CODEOWNERS`: `skills/learn/topics/` doesn't exist (it's `levels/`); add `packages/spec`, the visual sandbox (`packages/player/src/visuals*`) and the CSP in `next.config.ts`
- [x] `packages/typescript-config/package.json` says `"license": "PROPRIETARY"`; set every package to Apache-2.0
- [x] README: what learn.ninja is, how to run it with no database (PGlite is already the default), the commands, where to contribute
- [x] `.env.example`: say at the top that nothing in it is needed to run locally

## 4. Add (1 day)

- [x] LICENSE (Apache-2.0) and NOTICE, plus LICENSE-CONTENT (CC-BY-4.0 for `examples/` and `docs/`)
- [x] TRADEMARK.md, in the style of PostHog's brand guidelines: the name, the logo, `brand/` and the ninja character are Uxcel Inc's brand, outside the license; forks may say "built with learn.ninja" but may not suggest endorsement, use the logo as their own branding, or use the ninja as their mascot or in marketing without permission
- [x] CONTRIBUTING.md: the areas table below; what needs a proposal first (format changes, new kata types, agent round trips); the visual sandbox test changes only through a proposal; agent-written code is welcome if disclosed and understood
- [x] SECURITY.md pointing at private vulnerability reporting
- [x] CODE_OF_CONDUCT.md (Contributor Covenant)
- [x] Issue forms: bug, idea, translation
- [x] A GitHub link on the site, in the footer and in `site.ts`

## 5. Settings (half a day)

- [ ] Branch protection on `main`: pull request, green CI, CODEOWNERS review
- [ ] Secret scanning with push protection, private vulnerability reporting, Dependabot security updates (all free on public repos)
- [ ] Social preview (`brand/github-social-preview.png`), description, topics
- [ ] Temporary interaction limits (collaborators only) for the first weeks, if wanted. Check the setting exists before relying on it; the fallback is a bot that closes unsolicited pull requests, as tldraw does
- [ ] Confirm the Vercel project keeps deploying. Public repos also get free Actions minutes, which ends the CI budget problem

## 6. Flip

- [ ] Make the repo public
- [ ] Open 5–10 starter issues labelled `good first issue`: translations, sounds, a visual, guide examples
- [ ] Announce: a GitHub link on learn.ninja and one post

## First month, not blocking

- [ ] `learn validate --local`, so a checker change runs without the service (today `validate`, `sync` and `publish` all call the hosted API)
- [ ] Play any lesson JSON locally: a Storybook story already plays a lesson, so add a file picker or a `?file=` route
- [ ] Document the API (`/api/skill`, `/api/validate`, `/api/lessons`) and the MCP tools in the docs
- [ ] When teams starts, choose its home: a private package or an `ee/` folder with its own license

## Where we want help

The review path depends on how much of the lesson experience a change touches. This table goes into CONTRIBUTING.md.

| Area | Examples | Touches | Review path |
| --- | --- | --- | --- |
| Languages | Translate the player's interface, fix right-to-left issues | `player/src/locales` | Pull request |
| Sounds and motion | Better sound effects, transitions, celebration moments | `player` | Pull request |
| Summary screen | A richer end-of-lesson summary, sharing, what to learn next | `player` | Pull request |
| Visuals | New or better maps, charts, diagrams, chess, molecules | `player`, sometimes `spec` | Pull request; a proposal if the format changes |
| Teaching guide | How the agent writes better lessons, more examples | `skills/learn`, `examples/` | Pull request |
| Agent round trips | Lessons that send results back to the agent, editing from the agent, a local preview | `cli`, `skills/learn` | Proposal first |
| Voices | New ninja lines, voices for other languages | `player/src/voices.ts` | Proposal first: clips are generated with our voice key |
| New kata types | A new kind of question or screen | `spec`, `player`, `cli`, guide | Proposal first |

## Why Apache-2.0

Apache-2.0 means contributors can't later assert patents on what they contributed, and company legal teams accept it without review. MIT is as permissive but has no patent grant. AGPL-3.0 puts adopters off (Google's internal rules bar using AGPL code), and FSL or a custom source-available license would work against spreading the lesson format. What others can't copy is the hosted service's data, the brand and the ninja's name.
