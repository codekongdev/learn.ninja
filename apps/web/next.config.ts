import type { NextConfig } from "next"
import optimizeLocales from "@react-aria/optimize-locales-plugin"
import { createMDX } from "fumadocs-mdx/next"

// Languages whose built-in React Aria strings we ship. React Aria stores Arabic as ar-AE:
// listing another Arabic code (e.g. ar-EG) silently strips the Arabic strings.
const LOCALES = ["en-US", "ar-AE"]

// Requests that don't accept HTML (curl, agents) get Markdown for the home page and docs.
// The router's own RSC requests don't ask for HTML either, so they're left out.
const NOT_HTML = {
  has: [
    { type: "header" as const, key: "accept", value: "^(?!.*text/html).*$" },
  ],
  missing: [{ type: "header" as const, key: "rsc" }],
}

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/player", "@workspace/spec"],
  // prepareLesson() reads Tailwind's own stylesheets at runtime to compile each lesson's visuals CSS,
  // so they must ship with the server functions that publish and render lessons.
  outputFileTracingIncludes: {
    "/api/lessons": [
      "../../node_modules/tailwindcss/*.css",
      "../../node_modules/tailwindcss/package.json",
    ],
    "/api/lessons/[id]": [
      "../../node_modules/tailwindcss/*.css",
      "../../node_modules/tailwindcss/package.json",
    ],
    "/lessons/[slug]": [
      "../../node_modules/tailwindcss/*.css",
      "../../node_modules/tailwindcss/package.json",
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", ...NOT_HTML, destination: "/index.md" },
        { source: "/docs", ...NOT_HTML, destination: "/llm" },
        // Not /docs/{page}.md: that's already Markdown (see afterFiles).
        {
          source: "/docs/:path((?!.*\\.md$).+)",
          ...NOT_HTML,
          destination: "/llm/:path",
        },
      ],
      afterFiles: [
        { source: "/docs.md", destination: "/llm" },
        { source: "/docs/:path*.md", destination: "/llm/:path*" },
      ],
      fallback: [],
    }
  },
  async headers() {
    return ["/", "/docs", "/docs/:path*"].map((source) => ({
      source,
      headers: [{ key: "Vary", value: "Accept" }],
    }))
  },
  async redirects() {
    return [
      { source: "/create", destination: "/docs/quick-start", permanent: false },
    ]
  },
  // Builds use webpack (next dev/build --webpack): the locale plugin doesn't support Turbopack.
  webpack(config, { isServer }) {
    if (!isServer) {
      config.plugins.push(optimizeLocales.webpack({ locales: LOCALES }))
    }
    return config
  },
}

export default createMDX()(nextConfig)
