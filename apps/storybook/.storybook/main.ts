import type { StorybookConfig } from "@storybook/react-vite"
import tailwindcss from "@tailwindcss/vite"

const config: StorybookConfig = {
  // Stories live next to the components they show.
  stories: ["../../../packages/*/src/**/*.stories.@(ts|tsx)"],
  framework: { name: "@storybook/react-vite", options: {} },
  // apps/web/public holds lesson-visuals.css, which HTML visuals load inside their sandbox.
  staticDirs: ["../../web/public"],
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()]
    return config
  },
}

export default config
