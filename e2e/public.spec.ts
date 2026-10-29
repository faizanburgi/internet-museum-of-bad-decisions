import { expect, test } from "@playwright/test";

test("homepage and empty galleries render real museum navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /A museum for the things we probably shouldn’t have done/i })).toBeVisible();
  await page.getByRole("link", { name: "Browse Stories" }).first().click();
  await expect(page.getByRole("heading", { name: "The Museum" })).toBeVisible();
  await expect(page.getByText(/public exhibits/i)).toBeVisible();
});

test("storybook carousel rooms, art, and motion preferences work on desktop and mobile", async ({ page }) => {
  await page.goto("/");
  const verdict = page.locator(".verdict-note p[aria-live='polite']");
  const initialVerdict = await verdict.textContent();
  const button = page.getByRole("button", { name: /Get another Sir Regret verdict/ });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(verdict).not.toHaveText(initialVerdict || "");
  await expect(button).toBeVisible();
  await expect(page.locator('img[src*="sir-regret"]')).toHaveCount(0);

  const rooms = ["Curator’s pick", "Departments", "New arrivals", "Contribute"];
  for (const room of rooms) {
    const roomButton = page.getByRole("button", { name: `Go to ${room}` });
    await roomButton.click();
    await expect(roomButton).toHaveAttribute("aria-current", "step");
    const roomImages = page.locator('.storybook-room[aria-hidden="false"] img');
    if (await roomImages.count()) {
      await expect.poll(() => roomImages.evaluateAll((images) => images.every((image) => (image as HTMLImageElement).naturalWidth > 0))).toBeTruthy();
    }
  }
  await page.getByRole("button", { name: "Go to Welcome" }).click();
  const welcomeImages = page.locator('.storybook-room[aria-hidden="false"] img');
  await expect.poll(() => welcomeImages.evaluateAll((images) => images.length > 0 && images.every((image) => (image as HTMLImageElement).naturalWidth > 0))).toBeTruthy();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(button).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".carousel-track")).toHaveCSS("transition-duration", "0s");
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
