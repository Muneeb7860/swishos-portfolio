import { test, expect } from "@playwright/test";

/**
 * E2E: Landing page (/)
 * Tests the hero section, navigation, product showcase sections,
 * metrics, and footer of the SwishOS landing page.
 */
test.describe("Landing Page — SwishOS.io", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/SwishOS/);
  });

  test("renders the sticky nav with logo and CTAs", async ({ page }) => {
    const nav = page.locator("header");
    await expect(nav).toBeVisible();
    // Logo
    await expect(nav.getByText("SwishOS").first()).toBeVisible();
    // Nav links
    await expect(nav.getByRole("link", { name: /SwishOS/i }).first()).toBeVisible();
    // CTA buttons
    await expect(nav.getByRole("link", { name: /Validate Deal/i })).toBeVisible();
    await expect(nav.getByRole("link", { name: /Book a Demo/i })).toBeVisible();
  });

  test("hero section is visible with correct heading", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("distribution");
  });

  test("hero has two CTA buttons", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: /Validate Your Deal/i })).toBeVisible();
    await expect(main.getByRole("link", { name: /See the Platform/i })).toBeVisible();
  });

  test("dashboard mockup is rendered", async ({ page }) => {
    // The mock dashboard panel
    await expect(page.getByText("Order volume — this week")).toBeVisible();
    await expect(page.getByText("Rotterdam → Berlin")).toBeVisible();
  });

  test("SwishOS product section is visible", async ({ page }) => {
    const section = page.locator("#swishos");
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { level: 2 })).toContainText("SwishOS");
  });

  test("B2B OS section is visible", async ({ page }) => {
    const section = page.locator("#b2bos");
    await expect(section).toBeVisible();
    await expect(section.getByRole("heading", { level: 2 })).toContainText("B2B OS");
  });

  test("feature grid renders 6 cards", async ({ page }) => {
    // All 6 feature cards should be present
    const featureCards = page.locator("main section").filter({ hasText: "Why SwishOS" }).locator(".rounded-2xl");
    await expect(featureCards).toHaveCount(6);
  });

  test("metrics section shows 4 stats", async ({ page }) => {
    await expect(page.getByText("70%")).toBeVisible();
    await expect(page.getByText("<15min")).toBeVisible();
    await expect(page.getByText("2×")).toBeVisible();
    await expect(page.getByText("24/7")).toBeVisible();
  });

  test("How it works section has 4 steps", async ({ page }) => {
    const section = page.locator("#how");
    await expect(section).toBeVisible();
    await expect(section.getByText("01")).toBeVisible();
    await expect(section.getByText("04")).toBeVisible();
  });

  test("regions section shows EU and Middle East", async ({ page }) => {
    const section = page.locator("#regions");
    await expect(section).toBeVisible();
    await expect(section.getByText("European Union")).toBeVisible();
    await expect(section.getByText("Middle East")).toBeVisible();
  });

  test("CTA section has Deal Validator and contact links", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Open Deal Validator/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Submit Deal Proposal/i })).toBeVisible();
  });

  test("footer shows SwishOS brand and copyright", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("SwishOS");
    await expect(footer).toContainText("© 2026 SwishOS");
  });

  test("nav 'Validate Deal' link goes to /b2b", async ({ page }) => {
    await page.getByRole("link", { name: /Validate Deal/i }).first().click();
    await expect(page).toHaveURL(/\/b2b/);
  });

  test("hero 'Validate Your Deal' goes to /b2b", async ({ page }) => {
    await page.getByRole("link", { name: /Validate Your Deal/i }).click();
    await expect(page).toHaveURL(/\/b2b/);
  });

  test("'Book a Demo' goes to /contact", async ({ page }) => {
    await page.getByRole("link", { name: /Book a Demo/i }).first().click();
    await expect(page).toHaveURL(/\/contact/);
  });
});
