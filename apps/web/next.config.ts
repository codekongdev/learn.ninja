import type { NextConfig } from "next"
import optimizeLocales from "@react-aria/optimize-locales-plugin"

// Languages whose built-in React Aria strings we ship. React Aria stores Arabic as ar-AE:
// listing another Arabic code (e.g. ar-EG) silently strips the Arabic strings.
const LOCALES = ["en-US", "ar-AE"]

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/player", "@workspace/spec"],
  // prepareLesson() reads Tailwind's own stylesheets at runtime to compile each lesson's visuals CSS,
  // so they must ship with the server functions that publish and render lessons.
  outputFileTracingIncludes: {
    "/api/lessons": ["../../node_modules/tailwindcss/*.css", "../../node_modules/tailwindcss/package.json"],
    "/api/lessons/[id]": ["../../node_modules/tailwindcss/*.css", "../../node_modules/tailwindcss/package.json"],
    "/lessons/[slug]": ["../../node_modules/tailwindcss/*.css", "../../node_modules/tailwindcss/package.json"],
  },
  // Builds use webpack (next dev/build --webpack): the locale plugin doesn't support Turbopack.
  webpack(config, { isServer }) {
    if (!isServer) {
      config.plugins.push(optimizeLocales.webpack({ locales: LOCALES }))
    }
    return config
  },
}

export default nextConfig
