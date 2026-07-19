import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Mobile (375px)', width: 375, height: 667 },
  { name: 'Tablet (768px)', width: 768, height: 1024 },
  { name: 'Desktop (1440px)', width: 1440, height: 900 },
];

const routes = [
  '/en',
  '/ar',
  '/en/support',
  '/ar/support',
  '/en/contact',
  '/en/pricing',
  '/en/features',
  '/en/roi',
  '/en/vision',
];

for (const viewport of viewports) {
  test.describe(`Visual Viewport Suite: ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of routes) {
      test(`Render ${route} on ${viewport.name}`, async ({ page }) => {
        await page.goto(`http://localhost:3000${route}`);
        
        // Assert header brand image is visible
        await expect(page.locator('header')).toBeVisible();
        
        // Assert footer copyright is visible
        await expect(page.locator('footer')).toBeVisible();

        // Specific page element assertions
        if (route.includes('/support')) {
          await expect(page.locator('h1')).toContainText(/Support|مركز دعم/i);
          await expect(page.getByText(/P1 Escalation|SLA|مستهدف/i).first()).toBeVisible();
          await expect(page.getByText(/SwishOS|مساعد/i).first()).toBeVisible();
        }
      });
    }
  });
}
