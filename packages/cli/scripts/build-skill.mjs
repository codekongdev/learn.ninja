/* global console */
// Assembles skills/learn for distribution (`npx skills add https://learn.ninja`, served by apps/web):
// bundles the CLI into one dependency-free file, copies in the JSON Schema and example lessons, and
// writes subjects/index.md from the frontmatter of each subject (skills/learn/subjects/{name}/guide.md).
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
import { createHash } from "node:crypto"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { build } from "esbuild"

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..")
const skill = join(root, "skills/learn")
const script = join(skill, "scripts/learn.mjs")

/** A short content hash of a subject guide, to notice changes without a version bump. */
const hashGuide = (text) =>
  createHash("sha256").update(text).digest("hex").slice(0, 16)

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

// Subjects: subject-specific guidance, written by hand. The index is what the agent reads to pick one.
// Each subject has its own version (frontmatter `version`, semver) and a CHANGELOG.md, so improvements
// can be tracked. subjects/versions.json records each guide's version and content hash from the last
// build; a guide that changed without a version bump fails the build.
const versionsFile = join(skill, "subjects/versions.json")
const previous = existsSync(versionsFile)
  ? JSON.parse(readFileSync(versionsFile, "utf8"))
  : {}
const subjects = readdirSync(join(skill, "subjects"), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => {
    const file = `subjects/${e.name}/guide.md`
    const text = readFileSync(join(skill, file), "utf8")
    const field = (key) =>
      new RegExp(`^${key}: *(.*)$`, "m")
        .exec(text.split("\n---")[0])?.[1]
        ?.trim()
    const subject = {
      name: field("name"),
      description: field("description"),
      examples: (field("examples") ?? "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      version: field("version"),
      hash: hashGuide(text),
      file,
    }
    if (subject.name !== e.name)
      throw new Error(`${file}: "name" must be "${e.name}", the folder's name`)
    if (!subject.description) throw new Error(`${file}: add a "description"`)
    for (const x of subject.examples)
      if (!existsSync(join(skill, "examples", `${x}.json`)))
        throw new Error(`${file}: no example lesson examples/${x}.json`)
    if (!/^\d+\.\d+\.\d+$/.test(subject.version ?? ""))
      throw new Error(`${file}: add a "version" like 1.0.0`)
    const last = previous[e.name]
    if (last && last.hash !== subject.hash && last.version === subject.version)
      throw new Error(
        `${file} changed but is still version ${last.version}: bump "version" and describe the change in subjects/${e.name}/CHANGELOG.md`
      )
    const changelog = join(skill, `subjects/${e.name}/CHANGELOG.md`)
    if (
      !existsSync(changelog) ||
      !readFileSync(changelog, "utf8").includes(`## ${subject.version}`)
    )
      throw new Error(
        `subjects/${e.name}/CHANGELOG.md: add a "## ${subject.version}" entry`
      )
    return subject
  })
  .sort((a, b) => a.name.localeCompare(b.name))

writeFileSync(
  versionsFile,
  JSON.stringify(
    Object.fromEntries(
      subjects.map((s) => [s.name, { version: s.version, hash: s.hash }])
    ),
    null,
    2
  ) + "\n"
)

writeFileSync(
  join(skill, "subjects/index.md"),
  `# Subjects

Extra guidance for particular subjects. Each guide adds to \`reference/teaching-guide.md\` and never replaces it: where they disagree, the teaching guide and SKILL.md win.

Read the subject that fits the lesson (two at most: a lesson on prices and numbers in French could use \`languages\` and \`math\`). If none fits, don't read any: the teaching guide covers every subject.

<!-- Generated from each subject's frontmatter by \`npm run skill:build -w @workspace/cli\`. Don't edit. -->

| Subject | Use it when | Guide | Version | Example lessons |
| --- | --- | --- | --- | --- |
${subjects
  .map(
    (p) =>
      `| \`${p.name}\` | ${p.description} | \`${p.file}\` | ${p.version} | ${p.examples.map((x) => `\`examples/${x}.json\``).join(", ") || "None yet"} |`
  )
  .join("\n")}
`
)
console.log("Built skills/learn")
