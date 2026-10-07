# Learn

Turn anything you give your own LLM into one short, interactive lesson, and share it as a link. "Learn" is a working name.

## Getting started

Requires Node 24 (see `.nvmrc`) and npm.

```bash
npm install
npm run dev
```

The web app runs at http://localhost:3000, with the five test lessons on the home page.

```bash
npm run storybook
```

Storybook runs at http://localhost:6006, with every exercise type in every state.

## Checks

```bash
npm run check
```

Runs lint, type-checking, and tests across every package. CI runs the same checks plus a production build on every push.

## Structure

| Path | What it is |
| --- | --- |
| `apps/web` | Next.js app that plays lessons |
| `apps/storybook` | Storybook for the player and UI components |
| `packages/ui` | shadcn/ui components on React Aria, shared styles |
| `packages/spec` | The lesson spec (v0.2) |
| `packages/player` | Lesson screens and building blocks |
| `packages/cli` | Publish command (coming later) |
| `skill/` | The installable lesson skill (coming later) |
| `examples/` | Test lessons |
