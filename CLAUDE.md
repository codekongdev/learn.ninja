@AGENTS.md

# Learn

An LLM turns any input into one short, interactive lesson (Duolingo/Brilliant-style), and this app plays it from a shared link. "Learn" is a working name. Built mainly by one person with Claude Code; open-source-ready (license not chosen yet, so don't add one).

Planning doc (decisions, lesson spec, tech stack, test lessons): https://claude.ai/code/artifact/d4d46b87-0964-4396-bb26-70d0e1b1eb49

## Layout

- `apps/web`: Next.js 16 app: bundled test lessons at `/lessons/{slug}`, published lessons at `/l/{slug}-{id}`, and the publish API (`POST /api/lessons`, `PUT /api/lessons/{id}`) in `lib/publish/`
- `apps/storybook`: Storybook 10 (Vite) for the player and UI components; stories live next to components as `*.stories.tsx`
- `packages/ui`: shadcn/ui components on React Aria (`--base aria`), shared Tailwind styles and theme
- `packages/spec`: the lesson spec v0.2: Zod schema, exported JSON Schema, validation rules (single source of truth)
- `packages/player`: React components for every lesson screen and building block
- `packages/cli`: the `learn` command (validate, publish, schema) the skill runs; bundled into `skills/learn/scripts/learn.mjs`
- `packages/eslint-config`, `packages/typescript-config`: shared configs
- `skills/learn/`: the installable skill (`npx skills add Uxcel-Team/learn --skill learn -g`): SKILL.md, teaching guide, format reference, and generated copies of the schema, examples, and bundled CLI
- `examples/`: the five test lessons as JSON, used as fixtures
- `spikes/`: throwaway test builds, git-ignored; never import from here

## Commands

- `npm run dev`: start the web app (webpack)
- `npm run check`: lint, type-check, and tests across all packages; run after every change
- `npm run build`: production build
- `npm run storybook`: Storybook at http://localhost:6006 (theme and language switches in the toolbar)
- `npm run skill:build -w @workspace/cli`: rebuild `skills/learn` (bundled CLI, schema, examples) after changing the spec, CLI, or examples; a test fails if it's stale
- `npm run schema -w @workspace/spec`: re-export `packages/spec/schema/lesson.schema.json` after changing the spec (a test fails if it's stale)
- Add shadcn components from `apps/web`: `npx shadcn@latest add <name>` (they land in `packages/ui`)

## Rules

- Read the `learn-ui-guidelines` skill (`.claude/skills/learn-ui-guidelines/SKILL.md`) before any UI work: surfaces and dark-mode layers, sizes, typography, states, and the check-before-done list.
- The UI follows shadcn's Vega style (`aria-vega` in both `components.json` files). Build from shadcn components and their shapes (`rounded-md` controls, `rounded-lg` alerts, `rounded-xl` cards, `shadow-xs`, 1px borders) instead of hand-rolled styles. Add missing pieces with `npx shadcn@latest add` rather than copying their classes.
- Player screens import UI only from `@workspace/ui/components/*`, never from `react-aria-components` or `@base-ui/react` directly. The drag-and-drop module in `packages/player` is the one exception. This keeps a future library switch cheap.
- Build with webpack (`next dev/build --webpack`, already in the scripts). React Aria's locale-trimming plugin doesn't support Turbopack.
- React Aria stores Arabic strings as `ar-AE`. Use that code in `apps/web/next.config.ts`; any other Arabic code silently strips them.
- Focus styles use `focus-visible:` classes; `tailwindcss-react-aria-components` makes them follow React Aria's keyboard detection. Don't remove that plugin from `packages/ui/src/styles/globals.css`.
- Use logical CSS (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`), never left/right, so right-to-left works.
- Lesson visuals are LLM-written HTML shown in a sandboxed iframe with Basecoat and no scripts. Never let lesson content run code.
- Never commit secrets. Real values go in `.env.local` (git-ignored); document variable names in `.env.example`.

## Publishing

- Storage goes through `LessonStore` (`apps/web/lib/publish/store.ts`): Upstash Redis when `UPSTASH_REDIS_REST_URL`/`TOKEN` (or Vercel's `KV_REST_API_URL`/`TOKEN`) are set, otherwise a local folder (`apps/web/.data/lessons`) in development.
- Lessons expire 24 hours after publishing; updates keep the expiry. Edit tokens are only stored hashed.
- `prepareLesson()` runs at publish time: KaTeX, Shiki, and Tailwind utilities for the lesson's HTML. The result is stored with the lesson.
- Bump `LATEST_SKILL_VERSION` (`apps/web/lib/publish/handlers.ts`) and `SKILL_VERSION` (`packages/cli/src/cli.ts`) together when the skill changes; older skills are told to update.

## Storybook

- Build and review components in Storybook first, then use them in the app.
- Add a story for every new exercise type or screen, with its states (the Exercises stories use a `state` control: idle, wrong, correct, revealed).
- Stories use the example lessons from `examples/` via `packages/player/src/stories/fixtures.tsx`; formulas and code are prepared before Storybook starts.

## v1 scope reminders

No accounts, no saved progress, lessons expire after 24 hours, no typed answers (word chips instead), no `number` steps (multiple choice instead), no images. Multiple languages and right-to-left matter from day one.
