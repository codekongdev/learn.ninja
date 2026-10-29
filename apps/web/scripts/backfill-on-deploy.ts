// The tag backfill (backfill-tags.ts) as a build step: the web app's prebuild runs it after the
// migrations, so every production deploy brings stored lessons up to the current spec. It only
// writes in a production build (see deployBackfill); anywhere else it says why it skipped. It reads
// the real environment only, never .env.local. A database error fails the build.

import {
  backfillTags,
  deployBackfill,
  formatBackfill,
} from "../lib/explore/backfill"
import { getDb } from "../lib/publish/store"

const decision = deployBackfill(process.env)
if (!decision.run) {
  console.log(decision.reason)
} else {
  console.log(
    formatBackfill(await backfillTags(await getDb(), { write: true }))
  )
}
process.exit(0)
