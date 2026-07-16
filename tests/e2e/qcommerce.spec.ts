import { test, expect } from "@playwright/test";

/**
 * E2E: SwishOS Q-Commerce Showcase (/qcommerce)
 * Tests the live mobile-framed product grid:
 * - Page load and layout
 * - Product grid renders
 * - Search / category filter
 * - Add to cart and cart bar (floating div)
 * - Cart sheet opening
 * - Checkout flow and dispatch stepper
 */
test.describe("SwishOS Q-Commerce — /qcommerce", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/qcommerce");
    // Wait for isMounted client-side render
    await page.waitForLoadState("networkidle");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/SwishOS Q-Commerce|SwishOS/);
  });

  test("renders the info panel heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /SwishOS Mobile/i })).toBeVisible();
  });

  test("back link is present and goes to /", async ({ page }) => {
    await page.getByRole("link", { name: /Back to SwishOS/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("mobile phone shell renders with status bar time", async ({ page }) => {
    // The status bar renders "09:41" in a span inside the phone frame
    // Wait for the isMounted flag (ProductGrid is client-only)
    const statusTime = page.locator("span").filter({ hasText: "09:41" });
    await expect(statusTime).toBeVisible({ timeout: 5000 });
  });

  test("product grid renders at least 6 products", async ({ page }) => {
    // Product cards are Card components inside the 2-col grid
    // Each card has an img and a price span
    const productCards = page.locator(".grid.grid-cols-2 .rounded-xl");
    await expect(productCards.first()).toBeVisible({ timeout: 5000 });
    const count = await productCards.count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test("search input filters products", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Search fresh groceries/i);
    await expect(searchInput).toBeVisible({ timeout: 5000 });
    await searchInput.fill("eggs");
    // Either we get a matching result or the "No products" message
    const result = page.locator("text=/No products|Egg/i");
    await expect(result.first()).toBeVisible({ timeout: 2000 });
  });

  test("add to cart button works and shows floating cart bar", async ({ page }) => {
    // The add buttons are h-7 w-7 Button with Plus icon — located inside product cards
    // More robust: find the emerald green '+' buttons with aria size="sm"
    const addBtn = page.locator('.grid.grid-cols-2 button').first();
    await expect(addBtn).toBeVisible({ timeout: 5000 });
    await addBtn.click();

    // "View Basket" appears in a floating div (h4 inside the overlay div)
    await expect(page.getByText("View Basket")).toBeVisible({ timeout: 3000 });
  });

  test("cart bar opens cart sheet when clicked", async ({ page }) => {
    // Add an item first
    const addBtn = page.locator('.grid.grid-cols-2 button').first();
    await expect(addBtn).toBeVisible({ timeout: 5000 });
    await addBtn.click();

    // The "View Basket" h4 is inside a clickable div (not a button)
    const cartBar = page.locator("div").filter({ hasText: "View Basket" }).last();
    await expect(cartBar).toBeVisible({ timeout: 2000 });
    await cartBar.click();

    // Cart sheet should open with the "Swish Cart" title
    await expect(page.getByText("Swish Cart")).toBeVisible({ timeout: 3000 });
  });

  test("checkout triggers order tracking view", async ({ page }) => {
    // Add an item
    const addBtn = page.locator('.grid.grid-cols-2 button').first();
    await expect(addBtn).toBeVisible({ timeout: 5000 });
    await addBtn.click();

    // Open cart bar
    const cartBar = page.locator("div").filter({ hasText: "View Basket" }).last();
    await cartBar.click();

    // Click the place order button inside the sheet
    const placeOrderBtn = page.getByRole("button", { name: /Confirm & Place Order|Place Order/i });
    await expect(placeOrderBtn).toBeVisible({ timeout: 3000 });
    await placeOrderBtn.click();

    // Tracking view should appear
    await expect(page.getByText("SwishOS Delivery Active")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Live Delivery Steps")).toBeVisible({ timeout: 5000 });
  });

  test("reset order button returns to browsing state", async ({ page }) => {
    // Full flow: add → cart → checkout → reset
    const addBtn = page.locator('.grid.grid-cols-2 button').first();
    await expect(addBtn).toBeVisible({ timeout: 5000 });
    await addBtn.click();

    const cartBar = page.locator("div").filter({ hasText: "View Basket" }).last();
    await cartBar.click();

    await page.getByRole("button", { name: /Confirm & Place Order|Place Order/i }).click();
    await expect(page.getByText("SwishOS Delivery Active")).toBeVisible({ timeout: 5000 });

    // Reset
    await page.getByRole("button", { name: /Reset and Browse Again/i }).click();

    // Status bar should reappear (back to browsing state)
    await expect(page.locator("span").filter({ hasText: "09:41" })).toBeVisible({ timeout: 3000 });
  });
});
