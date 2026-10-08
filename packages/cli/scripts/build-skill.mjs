/* global console */
// Assembles skills/learn for distribution (`npx skills add https://learn.ninja`, served by apps/web):
// bundles the CLI into one dependency-free file, copies in the JSON Schema and example lessons, and
// writes topics/index.md from the frontmatter of each topic pack (skills/learn/topics/{name}/guide.md).
// Run: npm run skill:build -w @workspace/cli (a test fails if skills/learn is out of date).
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { build } from "esbuild"

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..")
const skill = join(root, "skills/learn")
const script = join(skill, "scripts/learn.mjs")

await build({
  entryPoints: [join(root, "packages/cli/src/index.ts")],
  outfile: script,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  minify: true,
  legalComments: "none",
  banner: {
    js: "#!/usr/bin/env node\n// Lesson checker and publisher, bundled from packages/cli. Don't edit; run `npm run skill:build -w @workspace/cli`.",
  },
  logLevel: "warning",
})
chmodSync(script, 0o755)

mkdirSync(join(skill, "schema"), { recursive: true })
copyFileSync(
  join(root, "packages/spec/schema/lesson.schema.json"),
  join(skill, "schema/lesson.schema.json")
)

rmSync(join(skill, "examples"), { recursive: true, force: true })
mkdirSync(join(skill, "examples"))
for (const f of readdirSync(join(root, "examples")).filter((f) =>
  f.endsWith(".json")
)) {
  copyFileSync(join(root, "examples", f), join(skill, "examples", f))
}

// Topic packs: subject-specific guidance, written by hand. The index is what the agent reads to pick one.
const packs = readdirSync(join(skill, "topics"), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => {
    const file = `topics/${e.name}/guide.md`
    const text = readFileSync(join(skill, file), "utf8")
    const field = (key) =>
      new RegExp(`^${key}: *(.*)$`, "m")
        .exec(text.split("\n---")[0])?.[1]
        ?.trim()
    const pack = {
      name: field("name"),
      description: field("description"),
      examples: (field("examples") ?? "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      file,
    }
    if (pack.name !== e.name)
      throw new Error(`${file}: "name" must be "${e.name}", the folder's name`)
    if (!pack.description) throw new Error(`${file}: add a "description"`)
    for (const x of pack.examples)
      if (!existsSync(join(skill, "examples", `${x}.json`)))
        throw new Error(`${file}: no example lesson examples/${x}.json`)
    return pack
  })
  .sort((a, b) => a.name.localeCompare(b.name))

writeFileSync(
  join(skill, "topics/index.md"),
  `# Topic packs

Extra guidance for particular subjects. Each pack adds to \`reference/teaching-guide.md\` and never replaces it: where they disagree, the teaching guide and SKILL.md win.

Read the pack that fits the lesson's subject (two at most: a lesson on prices and numbers in French could use \`languages\` and \`math\`). If none fits, don't read any: the teaching guide covers every subject.

<!-- Generated from each pack's frontmatter by \`npm run skill:build -w @workspace/cli\`. Don't edit. -->

| Pack | Use it when | Guide | Example lessons |
| --- | --- | --- | --- |
${packs
  .map(
    (p) =>
      `| \`${p.name}\` | ${p.description} | \`${p.file}\` | ${p.examples.map((x) => `\`examples/${x}.json\``).join(", ") || "None yet"} |`
  )
  .join("\n")}
`
)
console.log("Built skills/learn")
