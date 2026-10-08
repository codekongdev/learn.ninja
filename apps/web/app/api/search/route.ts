import { createFromSource } from "fumadocs-core/search/server"

import { source } from "@/lib/source"

// Full-text search over the docs, for the search dialog.
export const { GET } = createFromSource(source, { language: "english" })
