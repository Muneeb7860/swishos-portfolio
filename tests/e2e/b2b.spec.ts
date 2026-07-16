import { test, expect } from "@playwright/test";

/**
 * E2E: Deal Validator (/b2b)
 * Tests the B2B ROI calculator:
 * - Page render and layout
 * - Input interactions
 * - ROI results generation
 * - "Lock Deal" button navigation
 */
test.describe("Deal Validator — /b2b", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/b2b");
    // Wait for the client-side hydration to complete
    await page.waitForLoadState("networkidle");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Deal Validator|SwishOS/);
  });

  test("renders the Deal Validator heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Deal Validator/i })).toBeVisible();
  });

  test("back link navigates to landing page", async ({ page }) => {
    await page.getByRole("link", { name: /Back to SwishOS/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("form has all required input fields", async ({ page }) => {
    await expect(page.locator("#dv-company")).toBeVisible();
    await expect(page.locator("#dv-sector")).toBeVisible();
    await expect(page.locator("#dv-volume")).toBeVisible();
    await expect(page.locator("#dv-basket")).toBeVisible();
    await expect(page.locator("#dv-current-time")).toBeVisible();
    await expect(page.locator("#dv-target-time")).toBeVisible();
  });

  test("awaiting-input state shows placeholder message", async ({ page }) => {
    // Clear monthly volume to trigger empty state
    await page.locator("#dv-volume").fill("");
    // The h4 text is "Awaiting Input Parameters" inside a role="status" div
    await expect(page.getByRole("heading", { name: /Awaiting Input Parameters/i })).toBeVisible({ timeout: 5000 });
  });

  test("entering volume and basket reveals ROI results", async ({ page }) => {
    // Fill in company
    await page.locator("#dv-company").fill("Test Groceries Ltd");
    // Fill monthly volume
    await page.locator("#dv-volume").fill("8000");
    // Fill avg basket
    await page.locator("#dv-basket").fill("55");
    // Distance
    await page.locator("#dv-distance").fill("12");

    // Results header should now appear
    await expect(page.getByText("Deal Validation Report")).toBeVisible({ timeout: 3000 });
    // Estimated savings
    await expect(page.getByText("Estimated Monthly Savings")).toBeVisible({ timeout: 3000 });
  });

  test("recommends SwishOS for low volume grocery sector", async ({ page }) => {
    await page.locator("#dv-sector").selectOption("supermarket");
    await page.locator("#dv-volume").fill("3000");
    await page.locator("#dv-basket").fill("45");

    // SwishOS recommendation appears in the recommended OS label
    await expect(page.getByText("Recommended OS License")).toBeVisible({ timeout: 3000 });
    await expect(page.getByText("SwishOS").first()).toBeVisible({ timeout: 3000 });
  });

  test("recommends B2B OS for distributor sector", async ({ page }) => {
    await page.locator("#dv-sector").selectOption("distributor");
    await page.locator("#dv-volume").fill("60000");
    await page.locator("#dv-basket").fill("180");

    // B2B OS recommendation
    await expect(page.getByText("Recommended OS License")).toBeVisible({ timeout: 3000 });
    await expect(page.getByText("B2B OS")).toBeVisible({ timeout: 3000 });
  });

  test("Lock Deal button is visible after results render", async ({ page }) => {
    await page.locator("#dv-volume").fill("5000");
    await page.locator("#dv-basket").fill("60");

    // The CTA button text is "Lock Pre-Approved Deal & Deploy Sandbox"
    const lockBtn = page.getByRole("button", { name: /Lock Pre-Approved Deal/i });
    await expect(lockBtn).toBeVisible({ timeout: 3000 });
  });

  test("Lock Deal button navigates to /contact with params", async ({ page }) => {
    await page.locator("#dv-company").fill("FreshMart");
    await page.locator("#dv-volume").fill("5000");
    await page.locator("#dv-basket").fill("60");

    // Click the lock deal button
    await page.getByRole("button", { name: /Lock Pre-Approved Deal/i }).click();

    // Should navigate to contact with URL params
    await expect(page).toHaveURL(/\/contact/, { timeout: 5000 });
  });
});
