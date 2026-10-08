import { loader } from "fumadocs-core/source"

import { docs } from "@/.source/server"

/** The docs pages from the repo's docs/ folder, with their sidebar tree. */
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
})
