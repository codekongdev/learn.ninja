import { fileURLToPath } from "node:url"

import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      // The preparer is server-only; tests run on the server side too.
      "server-only": fileURLToPath(new URL("./test/empty.ts", import.meta.url)),
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: { include: ["lib/**/*.test.ts"] },
})
