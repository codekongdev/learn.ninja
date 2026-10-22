import { describe, expect, it } from "vitest"

import { agentOf, cleanOrigin } from "./origin"

describe("agentOf", () => {
  const logo = (origin: string | null) => agentOf(origin)?.logo ?? null

  it("matches the names agents and MCP clients give themselves", () => {
    expect(logo("claude-code_2-1-304_agent")).toBe("claudecode")
    expect(logo("Claude Code")).toBe("claudecode")
    expect(logo("codex-mcp-client")).toBe("codex")
    expect(logo("cursor-vscode")).toBe("cursor")
    expect(logo("gemini-cli")).toBe("geminicli")
    expect(logo("Visual Studio Code")).toBe("copilot")
    expect(logo("Roo Cline")).toBe("roocode")
    expect(logo("Cline")).toBe("cline")
    expect(logo("amp")).toBe("amp")
  })

  it("shows nothing for apps without a logo, unknown names, or none", () => {
    expect(logo("claude-ai")).toBeNull()
    expect(logo("openai-mcp")).toBeNull()
    expect(logo("example-app")).toBeNull()
    expect(logo("node")).toBeNull()
    expect(logo(null)).toBeNull()
  })
})

describe("cleanOrigin", () => {
  it("trims, drops control characters, and caps the length", () => {
    expect(cleanOrigin("  cursor\n")).toBe("cursor")
    expect(cleanOrigin("a\u0000b")).toBe("ab")
    expect(cleanOrigin("x".repeat(100))).toHaveLength(64)
    expect(cleanOrigin("   ")).toBeNull()
    expect(cleanOrigin(null)).toBeNull()
  })
})
