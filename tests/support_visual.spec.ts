import { test, expect } from '@playwright/test';

test.describe('SwishOS Support Hub & Incident Triage E2E Tests', () => {
  
  test('Support page renders telemetry, connectors, and forms without visual errors', async ({ page }) => {
    await page.goto('http://localhost:3000/en/support');

    // 1. Verify Header & Badges
    await expect(page.locator('h1')).toContainText('Customer Support & Real-Time Feedback Hub');

    // 2. Verify Telemetry Metrics Grid
    await expect(page.getByText('P1 Escalation SLA Target')).toBeVisible();
    await expect(page.getByText('< 15 min')).toBeVisible();
    await expect(page.getByText('AI Triage Classifier Precision')).toBeVisible();
    await expect(page.getByText('98.2%')).toBeVisible();

    // 3. Verify Open-Source Connectors
    await expect(page.getByText('Supported Open-Source Integration Connectors')).toBeVisible();
    await expect(page.getByText('Chatwoot')).toBeVisible();
    await expect(page.getByText('FreeScout')).toBeVisible();

    // 4. Verify Floating AI Assistant Button
    await expect(page.getByText('💬 SwishOS AI Assistant')).toBeVisible();
  });

  test('Submitting Critical Security Incident triggers P1 15-min SLA triage', async ({ page }) => {
    await page.goto('http://localhost:3000/en/support');

    // Select Security Incident Category
    await page.getByRole('button', { name: 'Critical Security & Threat Incident' }).click();

    // Fill form
    await page.fill('input[name="name"]', 'Security Lead');
    await page.fill('input[name="email"]', 'sec-ops@company.com');
    await page.fill('input[name="subject"]', 'Adversarial bypass evaluation trace');
    await page.fill('textarea[name="message"]', 'Adversarial bypass trace detected on endpoint.');

    // Submit form
    await page.getByRole('button', { name: 'Submit Ticket & Get Instant Triage' }).click();

    // Verify P1 Critical SLA output display
    await expect(page.getByText('Ticket Submitted Successfully!')).toBeVisible();
    await expect(page.getByText('P1 - Critical (Security Incident)')).toBeVisible();
    await expect(page.getByText('15 Minutes')).toBeVisible();
  });

});
