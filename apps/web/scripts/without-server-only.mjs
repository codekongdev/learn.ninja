// Node hooks that stand in for the `server-only` package, so a script can draw what the web app
// only draws on the server (`npm run bento`): `node --import tsx --import ./scripts/without-server-only.mjs`.
import { register } from "node:module"

register(
  `data:text/javascript,${encodeURIComponent(`
    export async function resolve(specifier, context, next) {
      if (specifier === "server-only")
        return { url: "data:text/javascript,", shortCircuit: true }
      return next(specifier, context)
    }
  `)}`
)
