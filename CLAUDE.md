@AGENTS.md

# learn.ninja

An LLM turns any input into one short, interactive lesson (Duolingo/Brilliant-style), and this app plays it from a shared link. The product is **learn.ninja**, always lowercase (also at the start of a sentence), live at https://learn.ninja; it's free and needs no account. Built mainly by one person with Claude Code; open-source-ready (license not chosen yet, so don't add one).

Planning doc (decisions, lesson spec, tech stack, test lessons): https://claude.ai/code/artifact/d4d46b87-0964-4396-bb26-70d0e1b1eb49

## Current state

Last checked 2026-10-19 at `a2c2bcf`. Update this section (and the date and commit) whenever a change makes any of it untrue: see "Keeping this file current" at the end.

- **Live and working:** home page, docs, the seven test lessons, publishing and updating lessons (24-hour links, expired page for dead links), link previews for lessons and expired links, the skill with `sync`/`validate`/`publish`, and per-lesson progress that resumes on reload.
- **Spec:** v0.4 (added chart visuals: scatter, bar, and line, drawn at publish time with Observable Plot into plain SVG, `packages/player/src/chart.ts`, using linkedom because jsdom crashed on Vercel). Lessons in 0.2 and 0.3 are upgraded on the server.
- **Skill:** version 0.9.0 (`SKILL_VERSION`, `LATEST_SKILL_VERSION`, `MIN_SKILL_VERSION` all 0.9.0). Agents plan by level, size, and reading age (`reference/planning.md`, `levels/`). The skill no longer ships example lessons ([#11](https://github.com/learn-ninja/learn.ninja/pull/11): agents did as well without them).
- **Checks:** `npm run check` passes (15 turbo tasks), with 3 known lint warnings (`'Buffer' is not defined` in `apps/web/scripts/build-favicon.mjs`). CI (`.github/workflows/ci.yml`) runs lint, typecheck, test, and build on every push to `main` and every PR, then the Playwright smoke tests in `apps/web/e2e/`.
- **Open questions:** the publish and validate rate limits (`apps/web/lib/publish/rate-limit.ts`: 20 publishes and 120 checks per IP per hour) are guesses until real usage shows what's right; no license chosen yet.

## Layout

- `apps/web`: Next.js 16 app: the home page (`/`), the docs (`/docs`, rendered from `docs/`), bundled test lessons at `/lessons/{slug}`, published lessons at `/l/{slug}-{id}`, `/contributors`, `/privacy`, `/terms`, the publish API (`POST /api/lessons`, `PUT /api/lessons/{id}`) in `lib/publish/` (with per-IP rate limits in `rate-limit.ts`), `POST /api/validate` (checks a lesson with the current rules, stores nothing), `/api/skill` and `/api/skill/version` (for `sync`), the agent-facing files (below), and Playwright smoke tests in `e2e/` (`npm run e2e -w web`). In development it also shows the Agentation toolbar (`components/agentation-toolbar.tsx`)
- `docs/`: the docs pages as Markdown/MDX, outside `apps/` so anyone can contribute. Fumadocs (`fumadocs-core` + `fumadocs-mdx`, headless: our own shadcn UI, like ui.shadcn.com) reads them through `apps/web/source.config.ts`. Each folder's `meta.json` orders the sidebar (`"..."` picks up new files); the docs render as one page at `/docs`, each file a section reached by anchor, so `##` headings must be unique across files; the sidebar's sections are the separators in `docs/meta.json`, with each file's headings under them (`apps/web/lib/docs-nav.ts`); `<BrickPreview lesson="…" brick="…" />` embeds a playable brick from `examples/`
- `apps/storybook`: Storybook 10 (Vite) for the player and UI components; stories live next to components as `*.stories.tsx`
- `packages/ui`: shadcn/ui components on React Aria (`--base aria`), shared Tailwind styles and theme
- `packages/spec`: the lesson spec v0.4 (`SPEC_VERSION` in `src/schema.ts`): Zod schema, exported JSON Schema, validation rules, and the 0.2/0.3 → 0.4 upgrade (single source of truth)
- `packages/player`: React components for every lesson screen and brick, plus `prepareLesson()` (`src/prepare.ts`), chart drawing (`src/chart.ts`, server-only), and saved progress (`src/progress.ts`)
- `packages/cli`: the `learn` command (sync, validate, publish, schema) the skill runs; bundled into `skills/learn/scripts/learn.mjs`
- `packages/eslint-config`, `packages/typescript-config`: shared configs
- `skills/learn/`: the installable skill (`npx skills add https://learn.ninja -g`, served by `apps/web` at `/.well-known/skills/`): a short SKILL.md that runs `sync`, then `steps.md`, `reference/` (the planning guide, teaching guide, and format reference, the last also shown in the docs through `<include>`), `levels/` (`index.md` picks beginner, intermediate, or advanced), and generated copies of the schema and bundled CLI. It ships no example lessons. Everything but SKILL.md and the CLI is also served as one bundle at `/api/skill`, which `sync` downloads into a project's `.learn/skill/`, so guide changes reach every install on deploy
- `examples/`: the seven test lessons as JSON (five beginner, one intermediate, one advanced), used as fixtures, in Storybook, in docs demos, and in the e2e tests
- `brand/`: share images rendered by `npm run share -w web`
- `.claude/`: project skills (`learn-ui-guidelines`, `shadcn`), allowed check commands in `settings.json`, and launch configs for web (3000) and Storybook (6006, plus a second on 6007) in `launch.json`
- `spikes/`: throwaway test builds, git-ignored; never import from here

## Commands

- `npm run dev`: start the web app (webpack)
- `npm run check`: lint, type-check, and tests across all packages; run after every change
- `npm run build`: production build
- `npm run storybook`: Storybook at http://localhost:6006 (theme and language switches in the toolbar)
- `npm run skill:build -w @workspace/cli`: rebuild `skills/learn` (bundled CLI and schema) after changing the spec or CLI; a test fails if it's stale
- `npm run schema -w @workspace/spec`: re-export `packages/spec/schema/lesson.schema.json` after changing the spec (a test fails if it's stale)
- `npm run e2e -w web`: Playwright smoke tests (CI runs them after the build)
- `npm run visuals:css -w web`: rebuild `public/lesson-visuals.css` (Basecoat plus the theme tokens, loaded inside visual frames); runs before `dev` and `build`
- `npm run favicon -w web`: rebuild `apps/web/app/favicon.ico` from `app/icon.svg` after changing the icon
- `npm run share -w web`: re-render the share images in `brand/` (GitHub social preview, X banner, square post) from the link preview card in `apps/web/lib/og.tsx`
- Add shadcn components from `apps/web`: `npx shadcn@latest add <name>` (they land in `packages/ui`)

## Vocabulary

A lesson is made of **bricks**, one per screen: `concept` bricks (theory) and question bricks (`choice`, `compare`, `hotspot`, `sort`, `order`, `match`, `blank`, `scenario`). Say "brick", not "step" or "exercise", in code, docs, and the skill.

## Rules

- Read the `learn-ui-guidelines` skill (`.claude/skills/learn-ui-guidelines/SKILL.md`) before any UI work: surfaces and dark-mode layers, sizes, typography, states, and the check-before-done list.
- The UI follows shadcn's Nova style (`aria-nova` in both `components.json` files; the `sm` button keeps 14px text, as Agendolo's does). Build from shadcn components and their shapes (`rounded-lg` buttons and inputs, `rounded-md` other controls, `rounded-lg` alerts, `rounded-xl` cards, `rounded-2xl` bordered windows with no fill, `shadow-xs`, 1px borders) instead of hand-rolled styles. Add missing pieces with `npx shadcn@latest add` rather than copying their classes.
- Player screens import UI only from `@workspace/ui/components/*`, never from `react-aria-components` or `@base-ui/react` directly. There are no exceptions. This keeps a future library switch cheap.
- Build with webpack (`next dev/build --webpack`, already in the scripts). React Aria's locale-trimming plugin doesn't support Turbopack.
- React Aria stores Arabic strings as `ar-AE`. Use that code in `apps/web/next.config.ts`; any other Arabic code silently strips them.
- Focus styles use `focus-visible:` classes; `tailwindcss-react-aria-components` makes them follow React Aria's keyboard detection. Don't remove that plugin from `packages/ui/src/styles/globals.css`.
- Use logical CSS (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`), never left/right, so right-to-left works.
- Lesson visuals are LLM-written HTML shown in a sandboxed iframe with Basecoat and no scripts. Never let lesson content run code.
- Lesson routes (`/l/*`, `/lessons/*`) send a Content-Security-Policy from `next.config.ts` that only allows same-origin resources; visual frames inherit it, so it's what stops a visual loading anything off-site when the publish-time checks miss something. The frame's sandbox is pinned by `packages/player/src/visuals.test.ts`; never add `allow-scripts`.
- Never commit secrets. Real values go in `.env.local` (git-ignored); document variable names in `.env.example`.

## Site and docs

- Shared names and copy (the lowercase name, install command, agent prompt, agent list) live in `apps/web/lib/site.ts`; the FAQ in `lib/faq.ts`.
- Agents get plain text: `/llms.txt`, `/llms-full.txt`, `/index.md`, `/docs/{page}.md`, and `/schema/lesson.schema.json` (`lib/llm.ts`). Requests that don't accept HTML (like `curl`) get Markdown for `/` and `/docs/*` through rewrites in `next.config.ts`.
- `mdast-util-to-markdown` is pinned to 2.1.2 (root `overrides` plus a direct dependency of `apps/web`): 2.2.0 overflows the stack inside Fumadocs. Try removing the pin when Fumadocs updates.
- `apps/web/.source/` is generated by `fumadocs-mdx` (on install and build); after changing `source.config.ts`, restart the dev server.
- Demos in the docs use `BrickDemo` from `@workspace/player`: one playable brick, shuffled with a seed so server and browser render the same.

## Publishing

- Storage goes through `LessonStore` (`apps/web/lib/publish/store.ts`): Upstash Redis when `UPSTASH_REDIS_REST_URL`/`TOKEN` (or Vercel's `KV_REST_API_URL`/`TOKEN`) are set, otherwise a local folder (`apps/web/.data/lessons`) in development.
- Lessons expire 24 hours after publishing; updates keep the expiry. Edit tokens are only stored hashed.
- `prepareLesson()` runs at publish time: KaTeX, Shiki, chart SVGs, and Tailwind utilities for the lesson's HTML. The result is stored with the lesson.
- Guide, example, and checker changes need no version bump: they go live on deploy through `sync` and `/api/validate`. Bump `LATEST_SKILL_VERSION` (`apps/web/lib/skill-version.ts`) and `SKILL_VERSION` (`packages/cli/src/cli.ts`) together only when the CLI or the installed `SKILL.md` changes; older installs are then told to run `npx skills add https://learn.ninja -g`. Raise `MIN_SKILL_VERSION` only when a guide relies on new CLI behavior: `sync` refuses to run below it.

## Storybook

- Build and review components in Storybook first, then use them in the app.
- Add a story for every new brick type or screen, with its states (the Bricks stories use a `state` control for question bricks: idle, wrong, correct, revealed).
- Stories use the example lessons from `examples/` via `packages/player/src/stories/fixtures.tsx`; formulas and code are prepared before Storybook starts.

## v1 scope reminders

No accounts (progress is kept in the browser only, per lesson page), lessons expire after 24 hours, no typed answers (word chips instead), no `number` bricks (multiple choice instead), no images (HTML, code, math, and chart visuals only). Multiple languages and right-to-left matter from day one.

## Keeping this file current

This file is the record of the repo's state for the next session. Keep it true as part of every change, in the same commit:

- When a change adds, moves, renames, or removes a package, route, command, script, env variable, or rule, update the matching section here (and `README.md` if it says the same thing).
- When a change makes anything under "Current state" untrue (spec or skill version, what works, check results, open questions), update that section and its date and commit.
- Before finishing a task, reread "Current state" and fix anything your change made stale. Don't record plans or work in progress, only what's true on the branch.
- Keep entries short and factual, in the style above. Put the reasoning in commit messages, not here.
