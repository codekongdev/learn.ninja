import type { Decorator, Preview } from "@storybook/react-vite"
import * as React from "react"

import "katex/dist/katex.min.css"
import "@workspace/ui/globals.css"

// Toolbar switches: light/dark theme, and the player's own language (English, or Arabic right to left).
// Stories read the language from context.globals.ui.

const withTheme: Decorator = (Story, context) => {
  const dark = context.globals.theme === "dark"
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Story />
    </div>
  )
}

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
    ui: {
      description: "Player language",
      toolbar: {
        title: "Language",
        icon: "globe",
        items: [
          { value: "en", title: "English (left to right)" },
          { value: "ar", title: "Arabic (right to left)" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light", ui: "en" },
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true },
  },
}

export default preview
