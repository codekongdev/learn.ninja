// Names, links, and copy shared by the home page, the docs, and the agent-facing files.

export const SITE = {
  /** Always lowercase, including at the start of a sentence. */
  name: "learn.ninja",
  url: "https://learn.ninja",
  tagline: "Interactive learning with your agent",
  description:
    "Give your AI agent an article, notes, docs, a transcript, or code. It writes one short, interactive lesson and gives you a link to share. Free, no account.",
  repo: "https://github.com/Uxcel-Team/learn",
  maker: "@cmicpace",
  makerUrl: "https://x.com/cmicpace",
}

export const INSTALL_COMMAND = "npx skills add https://learn.ninja -g"

/** What "Copy prompt for agent" copies. */
export const AGENT_PROMPT = `Install the learn.ninja skill with \`${INSTALL_COMMAND}\`, then read ${SITE.url}/docs and make me a lesson about `

/** Agents shown on the home page. Logos live in public/agents/ (see its README). */
export const AGENTS = [
  { name: "Claude Code", logo: "claudecode" },
  { name: "Codex", logo: "codex" },
  { name: "Cursor", logo: "cursor" },
  { name: "Gemini CLI", logo: "geminicli" },
  { name: "GitHub Copilot", logo: "copilot" },
  { name: "Windsurf", logo: "windsurf" },
  { name: "Cline", logo: "cline" },
  { name: "Roo Code", logo: "roocode" },
  { name: "Kiro", logo: "kiro" },
  { name: "Goose", logo: "goose" },
  { name: "Amp", logo: "amp" },
  { name: "OpenCode", logo: "opencode" },
  { name: "Antigravity", logo: "antigravity" },
  { name: "Junie", logo: "junie" },
] as const

/** Where the docs pages live in the repo, for "Edit on GitHub". */
export const DOCS_EDIT_BASE = `${SITE.repo}/edit/main/docs/`
