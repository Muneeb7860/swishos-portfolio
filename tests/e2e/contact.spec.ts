import { test, expect } from "@playwright/test";

/**
 * E2E: Contact / Deal Proposal form (/contact)
 * Tests form rendering, validation, and field interactions.
 * Also tests URL param pre-population from the Deal Validator.
 */
test.describe("Contact / Deal Proposal — /contact", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    // Wait for client-side Suspense to resolve
    await page.waitForLoadState("networkidle");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Contact|SwishOS/);
  });

  test("back link returns to landing page", async ({ page }) => {
    await page.getByRole("link", { name: /Back to SwishOS/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("form renders all required fields", async ({ page }) => {
    // Wait for Suspense to resolve and form to be in DOM
    await page.waitForSelector('input[name="name"]', { state: "visible", timeout: 8000 });
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="company"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test("submit with empty form shows validation errors", async ({ page }) => {
    // Wait for form to be visible
    await page.waitForSelector('input[name="name"]', { state: "visible", timeout: 8000 });
    await page.getByRole("button", { name: /Send|Submit|Locked|Proposal/i }).click();

    // Should show at least one validation error (Zod / HTML required)
    // Zod errors appear as small text below the inputs
    const errors = page.locator("p.text-rose-400, p.text-red-400, [class*='error'], [class*='rose']");
    await expect(errors.first()).toBeVisible({ timeout: 3000 });
  });

  test("filling valid data enables submission", async ({ page }) => {
    await page.waitForSelector('input[name="name"]', { state: "visible", timeout: 8000 });

    await page.fill('input[name="name"]', "Ahmad Al-Rashid");
    await page.fill('input[name="company"]', "Gulf Fresh Foods");
    await page.fill('input[name="email"]', "ahmad@gulffresh.ae");

    // Submit button should be enabled and clickable
    const submitBtn = page.getByRole("button", { name: /Send|Submit|Locked|Proposal|Lock/i });
    await expect(submitBtn).toBeEnabled();
    await expect(submitBtn).toBeVisible();
  });

  test("URL search params pre-populate company and message fields", async ({ page }) => {
    await page.goto("/contact?company=FreshMart+EU&app=swishos&savings=12000&score=97&volume=8000");
    await page.waitForLoadState("networkidle");
    await page.waitForSelector('input[name="company"]', { state: "visible", timeout: 8000 });

    const companyInput = page.locator('input[name="company"]');
    await expect(companyInput).toHaveValue("FreshMart EU", { timeout: 5000 });

    const messageArea = page.locator('textarea[name="message"]');
    await expect(messageArea).toContainText("SwishOS", { timeout: 5000 });
  });

  test("footer shows SwishOS copyright", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toContainText("© 2026 SwishOS");
  });
});
