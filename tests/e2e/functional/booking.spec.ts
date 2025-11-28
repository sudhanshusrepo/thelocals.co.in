import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
    test('should allow a client to book a service', async ({ page }) => {
        await page.goto('/services');
        await page.click('text=Cleaning Service');
        await page.click('text=Book Now');
        await page.fill('input[name="date"]', '2023-12-25');
        await page.click('button[type="submit"]');
        await expect(page.locator('.success-message')).toBeVisible();
    });
});
