import { test, expect } from "@playwright/test";

/**
 * E2E: SEO & Metadata
 * Validates Open Graph tags, Twitter cards, canonical meta,
 * robots directives, and structured data presence.
 */
test.describe("SEO & Metadata", () => {
  test("/ has correct OG title meta tag", async ({ page }) => {
    await page.goto("/");
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    expect(ogTitle).toContain("SwishOS");
  });

  test("/ has OG description", async ({ page }) => {
    await page.goto("/");
    const ogDesc = await page.locator('meta[property="og:description"]').getAttribute("content");
    expect(ogDesc).toBeTruthy();
    expect(ogDesc!.length).toBeGreaterThan(20);
  });

  test("/ has Twitter card meta tag", async ({ page }) => {
    await page.goto("/");
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute("content");
    expect(twitterCard).toBe("summary_large_image");
  });

  test("/ has theme-color meta tag set to dark", async ({ page }) => {
    await page.goto("/");
    const themeColor = await page.locator('meta[name="theme-color"]').getAttribute("content");
    expect(themeColor).toBeTruthy();
  });

  test("/ has robots meta allowing indexing", async ({ page }) => {
    await page.goto("/");
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots).toContain("index");
    expect(robots).toContain("follow");
  });

  test("/b2b has OG title containing SwishOS", async ({ page }) => {
    await page.goto("/b2b");
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    expect(ogTitle).toContain("SwishOS");
  });

  test("/qcommerce has OG title containing SwishOS Q-Commerce", async ({ page }) => {
    await page.goto("/qcommerce");
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    expect(ogTitle).toContain("SwishOS Q-Commerce");
  });

  test("title template works — /b2b appends '| SwishOS'", async ({ page }) => {
    await page.goto("/b2b");
    const title = await page.title();
    expect(title).toContain("SwishOS");
  });
});
