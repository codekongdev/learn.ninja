@AGENTS.md

# Learn

An LLM turns any input into one short, interactive lesson (Duolingo/Brilliant-style), and this app plays it from a shared link. "Learn" is a working name. Built mainly by one person with Claude Code; open-source-ready (license not chosen yet, so don't add one).

Planning doc (decisions, lesson spec, tech stack, test lessons): https://claude.ai/code/artifact/d4d46b87-0964-4396-bb26-70d0e1b1eb49

## Layout

- `apps/web`: Next.js 16 app: lesson pages now; publish API (route handlers) later
- `apps/storybook`: Storybook 10 (Vite) for the player and UI components; stories live next to components as `*.stories.tsx`
- `packages/ui`: shadcn/ui components on React Aria (`--base aria`), shared Tailwind styles and theme
- `packages/spec`: the lesson spec v0.2: Zod schema, exported JSON Schema, validation rules (single source of truth)
- `packages/player`: React components for every lesson screen and building block
- `packages/cli`: publish command used by the skill (stub until the publish API exists)
- `packages/eslint-config`, `packages/typescript-config`: shared configs
- `skill/`: the installable lesson skill (placeholder)
- `examples/`: the five test lessons as JSON, used as fixtures
- `spikes/`: throwaway test builds, git-ignored; never import from here

## Commands

- `npm run dev`: start the web app (webpack)
- `npm run check`: lint, type-check, and tests across all packages; run after every change
- `npm run build`: production build
- `npm run storybook`: Storybook at http://localhost:6006 (theme and language switches in the toolbar)
- `npm run schema -w @workspace/spec`: re-export `packages/spec/schema/lesson.schema.json` after changing the spec (a test fails if it's stale)
- Add shadcn components from `apps/web`: `npx shadcn@latest add <name>` (they land in `packages/ui`)

## Rules

- Player screens import UI only from `@workspace/ui/components/*`, never from `react-aria-components` or `@base-ui/react` directly. The drag-and-drop module in `packages/player` is the one exception. This keeps a future library switch cheap.
- Build with webpack (`next dev/build --webpack`, already in the scripts). React Aria's locale-trimming plugin doesn't support Turbopack.
- React Aria stores Arabic strings as `ar-AE`. Use that code in `apps/web/next.config.ts`; any other Arabic code silently strips them.
- Focus styles use `focus-visible:` classes; `tailwindcss-react-aria-components` makes them follow React Aria's keyboard detection. Don't remove that plugin from `packages/ui/src/styles/globals.css`.
- Use logical CSS (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`), never left/right, so right-to-left works.
- Lesson visuals are LLM-written HTML shown in a sandboxed iframe with Basecoat and no scripts. Never let lesson content run code.
- Never commit secrets. Real values go in `.env.local` (git-ignored); document variable names in `.env.example`.

## Storybook

- Build and review components in Storybook first, then use them in the app.
- Add a story for every new exercise type or screen, with its states (the Exercises stories use a `state` control: idle, wrong, correct, revealed).
- Stories use the example lessons from `examples/` via `packages/player/src/stories/fixtures.tsx`; formulas and code are prepared before Storybook starts.

## v1 scope reminders

No accounts, no saved progress, lessons expire after 24 hours, no typed answers (word chips instead), no `number` steps (multiple choice instead), no images. Multiple languages and right-to-left matter from day one.
