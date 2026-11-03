# learn.ninja

Give your AI agent an article, notes, docs, a transcript, or code. It writes one short, interactive lesson, Duolingo- or Brilliant-style, and gives you a link to share. Free, no account. Live at https://learn.ninja.

A lesson is made of **katas**, one per screen: `concept` katas teach, and question katas (`choice`, `compare`, `hotspot`, `sort`, `order`, `match`, `blank`, `scenario`) check what stuck, with instant feedback from the ninja. Lessons are written in any language, right-to-left included, and play on phones.

This repository is the whole thing: the website, the lesson player, the lesson format, the `learn` command, and the skill agents install.

## Make a lesson

Install the skill in your agent (Claude Code, Codex, Cursor, Gemini CLI, and [more](https://learn.ninja/docs)), then ask it to make a lesson from anything:

```bash
npx skills add https://learn.ninja -g
```

Chat apps (Claude, ChatGPT) connect to the MCP server at `https://learn.ninja/mcp` instead. The [docs](https://learn.ninja/docs) cover both.

## Run it locally

You need Node 24 (see `.nvmrc`) and npm. Nothing else: no database, no accounts, no keys.

```bash
npm install
npm run dev
```

The web app runs at http://localhost:3000: the home page, the docs at `/docs`, and the test lessons at `/lessons/{slug}`. Lessons you publish locally are kept in [PGlite](https://pglite.dev) (Postgres in WebAssembly) under `apps/web/.data/pglite`, rate limits are counted in memory, and sign-in codes and feedback are printed to the server console. `.env.example` lists the variables a hosted deployment uses; none of them are needed here.

To publish to your local server from an agent, set `LEARN_API_URL=http://localhost:3000` before running the skill.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the web app (webpack) |
| `npm run check` | Lint, type-check, and tests across every package. Run it after every change; CI runs it too, plus a production build |
| `npm run build` | Production build |
| `npm run storybook` | Storybook at http://localhost:6006, with every kata type in every state |
| `npm run skill:build -w @workspace/cli` | Rebuild `skills/learn` (bundled CLI, schema, examples) after changing the spec, the CLI, or the examples |
| `npm run schema -w @workspace/spec` | Re-export `packages/spec/schema/lesson.schema.json` after changing the spec |
| `npm run map -w @workspace/player` | Rebuild the map visual's country shapes from Natural Earth |
| `npm run bento -w web` | Redraw the home page's lesson visuals after changing `apps/web/lib/bento-visuals.ts` |
| `npm run favicon -w web` | Rebuild the favicon from `apps/web/app/icon.svg` |
| `npm run share -w web` | Re-render the share images in `brand/` |

A test fails when a generated file is stale, so `npm run check` tells you which of these to run.

## Structure

| Path | What it is |
| --- | --- |
| `apps/web` | Next.js app: home page, docs, lesson player pages, publish API, MCP server |
| `apps/storybook` | Storybook for the player and UI components |
| `docs/` | The docs pages, as Markdown and MDX |
| `packages/spec` | The lesson format: Zod schema, JSON Schema, and the checker's rules |
| `packages/player` | The lesson screens and every kata |
| `packages/ui` | shadcn/ui components on React Aria, shared styles |
| `packages/db` | The Postgres schema (Drizzle) and its migrations |
| `packages/cli` | The `learn` command: sync, validate, and publish lessons |
| `skills/learn` | The installable lesson skill and its teaching guide |
| `examples/` | Test lessons, used as fixtures |

## Contributing

Translations, sounds, visuals, a better teaching guide, and docs fixes are all welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for where we want help and what needs a proposal first. The docs live in [`docs/`](docs): edit a page, run `npm run dev`, and open http://localhost:3000/docs to see it.

Found a security issue? See [SECURITY.md](SECURITY.md). Everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

The code is [Apache-2.0](LICENSE). The example lessons in `examples/` and the docs in `docs/` are [CC-BY-4.0](LICENSE-CONTENT). The learn.ninja name, the logo, the files in `brand/`, and the ninja character are trademarks of Uxcel Inc; see [TRADEMARK.md](TRADEMARK.md) for what forks may and may not do with them.
