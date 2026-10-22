// Gives every account without a handle a random one ("quiet-kitsune"), for accounts made before
// handles were assigned at sign-up. Dry run by default; `--write` applies:
//   npm run handles:backfill -w web
//   npm run handles:backfill -w web -- --write
// Reads the database the app would: DATABASE_URL (the environment or apps/web/.env.local), else
// the local PGlite.

import { DATABASE_LINE } from "./env"
import { backfillHandles } from "../lib/auth/handles"
import { getDb } from "../lib/publish/store"

const write = process.argv.includes("--write")
console.log(`${DATABASE_LINE}\n`)
const given = await backfillHandles(await getDb(), { write })
for (const { id, handle } of given) console.log(`${id} → @${handle}`)
console.log(
  `\n${given.length} ${given.length === 1 ? "account" : "accounts"} without a handle${
    write ? ", now given one" : "; run with --write to give them these"
  }.`
)
// PGlite keeps the process alive once opened; the work is done, so leave.
process.exit(0)
