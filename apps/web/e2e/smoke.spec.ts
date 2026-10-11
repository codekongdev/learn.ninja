import { readFileSync } from "node:fs"
import path from "node:path"

import { expect, test } from "@playwright/test"

// The paths a visitor, a learner, and an agent take, end to end.

const example = readFileSync(
  path.join(process.cwd(), "../../examples/compound-interest.json"),
  "utf8"
)

test("the home page explains the product", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Vibe learn"
  )
  await expect(
    page.getByRole("button", { name: "Copy prompt for agent" }).first()
  ).toBeVisible()
})

test("agents get Markdown instead of HTML", async ({ request }) => {
  const res = await request.get("/", { headers: { accept: "text/plain" } })
  expect(res.ok()).toBe(true)
  expect(await res.text()).toMatch(/^# learn\.ninja/)
})

test("a bundled lesson plays", async ({ page }) => {
  await page.goto("/lessons/compound-interest")
  await page.getByRole("button", { name: "Start lesson" }).click()
  await page.getByText("$1,700").click()
  await page.getByRole("button", { name: "Check answer" }).click()
  await expect(
    page.getByText("Not quite, and that's fine").first()
  ).toBeVisible()
  await page.getByRole("button", { name: "Continue" }).click()
  await expect(
    page.getByRole("heading", { name: "Interest on interest" })
  ).toBeVisible()
})

test("a published lesson opens at its link, and a dead link is a 404", async ({
  page,
  request,
}) => {
  const res = await request.post("/api/lessons", {
    headers: { "content-type": "application/json" },
    data: example,
  })
  expect(res.status()).toBe(201)
  const body = (await res.json()) as { url: string; editToken: string }
  expect(body.editToken).toBeTruthy()

  const opened = await page.goto(body.url)
  expect(opened?.status()).toBe(200)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "How compound interest works"
  )
  await expect(page.getByRole("button", { name: "Start lesson" })).toBeVisible()

  const dead = await page.goto("/l/nothing-here-zzzzzzzz")
  expect(dead?.status()).toBe(404)
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "isn't available"
  )
})
