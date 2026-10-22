import { AGENTS } from "./site"

// Where a lesson was made: the app or agent that published it, stored as it named itself (an MCP
// client's `clientInfo.name`, or the agent the CLI ran in) and matched to one of the home page's
// logos when a card shows it. Stored raw so a logo added later lights up older lessons too.

export type Agent = (typeof AGENTS)[number]

/** The longest origin stored; longer names are cut. */
const MAX_ORIGIN = 64

/** An origin as it's stored: trimmed, printable, at most 64 characters; null when there's nothing. */
export function cleanOrigin(raw: string | null | undefined): string | null {
  // eslint-disable-next-line no-control-regex
  const text = raw?.replace(/[\u0000-\u001f\u007f]/g, "").trim()
  return text ? text.slice(0, MAX_ORIGIN) : null
}

/** Matches `words` only where no letter or digit touches them (`\b` would count `_` as a letter). */
const word = (words: string) =>
  new RegExp(`(?<![a-z0-9])(?:${words})(?![a-z0-9])`)

/**
 * Which logo each agent's names match in the lowercased origin (`claude-code`, `Claude Code`,
 * `claude-code_2-1-304_agent`). VS Code names itself as an MCP client, and its agent there is Copilot.
 */
const PATTERNS: [RegExp, Agent["logo"]][] = [
  [word("claude[ _-]?code"), "claudecode"],
  [word("codex"), "codex"],
  [word("cursor"), "cursor"],
  [word("gemini"), "geminicli"],
  [word("copilot|visual studio code|vscode"), "copilot"],
  [word("windsurf"), "windsurf"],
  // Before Cline: Roo Code once named itself Roo Cline.
  [word("roo[ _-]?code|roo[ _-]?cline"), "roocode"],
  [word("cline"), "cline"],
  [word("kiro"), "kiro"],
  [word("goose"), "goose"],
  [word("amp"), "amp"],
  [word("opencode"), "opencode"],
  [word("antigravity"), "antigravity"],
  [word("junie"), "junie"],
]

/** The home page agent an origin matches, or null (no origin, or one without a logo yet). */
export function agentOf(origin: string | null | undefined): Agent | null {
  if (!origin) return null
  const text = origin.toLowerCase()
  const logo = PATTERNS.find(([pattern]) => pattern.test(text))?.[1]
  return AGENTS.find((a) => a.logo === logo) ?? null
}
