import { expect, test } from "@playwright/test";

test("homepage and empty galleries render real museum navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /THE INTERNET MUSEUM OF BAD DECISIONS/i })).toBeVisible();
  await page.getByRole("link", { name: "The Museum" }).first().click();
  await expect(page.getByRole("heading", { name: "The Museum" })).toBeVisible();
  await expect(page.getByText(/public exhibits/i)).toBeVisible();
});

test("submission form validates required fields and explains offline archives", async ({ page }) => {
  await page.goto("/submit");
  await expect(page.getByLabel("What happened? *")).toBeVisible();
  await page.getByLabel("What happened? *").fill("I spent twenty minutes looking for my glasses while wearing them.");
  await page.getByLabel("Museum department *").selectOption("miscellaneous-regrets");
  await page.getByLabel(/I confirm this story/).check();
  await page.getByRole("button", { name: /Submit for curation/ }).click();
  await expect(page.locator("p.error[role=alert]")).toContainText(/archives are not connected yet/i);
});

test("museum departments and missing exhibit routes resolve correctly", async ({ page, request }) => {
  await page.goto("/gallery/academic-miscalculations");
  await expect(page.getByRole("heading", { name: "The Academic Miscalculations Wing" })).toBeVisible();
  expect((await page.request.get("/gallery/not-a-department")).status()).toBe(404);
  expect((await page.request.get("/exhibit/not-a-real-exhibit")).status()).toBe(404);
  expect((await request.get("/api/og/not-a-real-exhibit")).status()).toBe(404);
  expect((await request.get("/api/certificate/not-a-real-exhibit")).status()).toBe(404);
});
