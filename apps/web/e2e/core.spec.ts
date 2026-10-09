import { expect, test } from "@playwright/test";

// Core loop walkthrough in fallback mode: home → discover → dossier → ask →
// onboarding → settings save. No API needed; offline honesty is the point.
test("home renders ranked board", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Good evening, hunter." })).toBeVisible();
  await expect(page.getByText(/Live · connected|Offline · saved highlights/)).toBeVisible();
  await expect(page.getByText("Helios DePIN — Base").first()).toBeVisible();
});

test("discover early view filters", async ({ page }) => {
  await page.goto("/discover?view=early");
  await expect(page.getByText("rows")).toBeVisible();
  await expect(page.getByText("DreamCanvas AI — Solana").first()).toBeVisible();
});

test("dossier shows evidence and counters", async ({ page }) => {
  await page.goto("/entity/helios-depin");
  await expect(page.getByRole("heading", { name: "Helios DePIN — Base" })).toBeVisible();
  await expect(page.getByText("Why it might be weaker")).toBeVisible();
  await expect(page.getByText("Why am I seeing this?")).toBeVisible();
});

test("ask answers or states offline honestly", async ({ page }) => {
  await page.goto("/ask");
  await expect(page.getByText("Which new DeFi projects are showing strong ecosystem growth?")).toBeVisible();
  await page.getByLabel("Research question").fill("Why is Helios interesting?");
  await page.getByRole("button", { name: "Ask" }).click();
  await expect(page.getByText(/You're offline|Stub answer for/).first()).toBeVisible();
});

test("onboarding completes to done", async ({ page }) => {
  await page.goto("/onboarding");
  await page.getByText("Base", { exact: true }).click();
  await page.getByRole("button", { name: "Continue →" }).click();
  await page.getByText("DePIN", { exact: true }).click();
  await page.getByRole("button", { name: "Continue →" }).click();
  await page.getByRole("button", { name: "Continue →" }).click();
  await page.getByRole("button", { name: "Tune my feed" }).click();
  await expect(page.getByText("Feed tuned to you.")).toBeVisible();
});

test("settings save button cycles states", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("button", { name: "Save preferences" }).click();
  await expect(page.getByRole("button", { name: /Saved/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save preferences" })).toBeVisible({ timeout: 5000 });
});

