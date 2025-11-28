import { test, expect } from '@playwright/test';

test.describe('Profile Management', () => {
    test('should allow a user to update their profile', async ({ page }) => {
        await page.goto('/profile');
        await page.fill('input[name="name"]', 'Updated Name');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Profile updated')).toBeVisible();
    });
});
