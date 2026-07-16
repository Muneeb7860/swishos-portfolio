import { test, expect } from "@playwright/test";

/**
 * E2E: Global navigation flow
 * Tests cross-route navigation, 404 handling, and
 * site-wide consistent elements (title template, dark bg).
 */
test.describe("Global Navigation & Routing", () => {
  const routes = [
    { path: "/",           title: /SwishOS/,              h1: /distribution/i },
    { path: "/b2b",        title: /Deal Validator|SwishOS/, h1: /Deal Validator/i },
    { path: "/qcommerce",  title: /SwishOS Q-Commerce/,   h1: /SwishOS Mobile/i },
    { path: "/contact",    title: /Contact|SwishOS/,       h1: /Deal|Proposal|Contact/i },
  ];

  for (const { path, title, h1 } of routes) {
    test(`${path} loads with correct title`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(title);
    });

    test(`${path} has a visible main heading`, async ({ page }) => {
      await page.goto(path);
      if (path === "/contact") {
        // Contact form is inside Suspense — wait for networkidle, then look for CardTitle text
        await page.waitForLoadState("networkidle");
        await expect(page.getByText(/Submit Deal Proposal|Deal Proposal Submitted/i).first()).toBeVisible({ timeout: 8000 });
      } else {
        const heading = page.getByRole("heading", { level: 1 });
        await expect(heading).toBeVisible({ timeout: 8000 });
      }
    });
  }

  test("unknown route renders custom 404 page", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    await expect(page.getByText("404")).toBeVisible({ timeout: 3000 });
    await expect(page.getByText("Page not found")).toBeVisible();
  });

  test("404 page 'Back to SwishOS' navigates home", async ({ page }) => {
    await page.goto("/nonexistent-path-xyz");
    await page.getByRole("link", { name: /Back to SwishOS/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("404 page 'Open Deal Validator' navigates to /b2b", async ({ page }) => {
    await page.goto("/nonexistent-path-xyz");
    await page.getByRole("link", { name: /Open Deal Validator/i }).click();
    await expect(page).toHaveURL(/\/b2b/);
  });

  test("/qcommerce 'Live Interactive Demo' link goes to /qcommerce", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Live Interactive Demo/i }).click();
    await expect(page).toHaveURL(/\/qcommerce/);
  });

  test("/b2b 'Estimate Licensing ROI' link goes to /b2b", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Estimate Licensing ROI/i }).click();
    await expect(page).toHaveURL(/\/b2b/);
  });

  test("sitemap.xml is accessible", async ({ page }) => {
    const response = await page.request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("swishos.io");
    expect(body).toContain("/b2b");
    expect(body).toContain("/qcommerce");
    expect(body).toContain("/contact");
  });

  test("robots.txt is accessible", async ({ page }) => {
    const response = await page.request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("User-agent: *");
    expect(body).toContain("swishos.io/sitemap.xml");
  });
});
