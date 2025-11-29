import { test, expect } from '@playwright/test';

test.describe('Provider Search', () => {
    test('should search providers by category', async ({ page }) => {
        await page.goto('/');

        // Select service category
        await page.click('text=Plumber');

        // Verify providers are displayed
        await expect(page.locator('.provider-card')).toHaveCount(3, { timeout: 5000 });
        await expect(page.locator('.provider-category:has-text("Plumber")')).toBeVisible();
    });

    test('should filter providers by location', async ({ page }) => {
        await page.goto('/providers');

        // Enter location
        await page.fill('input[name="location"]', 'Brooklyn, NY');
        await page.fill('input[name="radius"]', '10');
        await page.click('button:has-text("Search")');

        // Verify location-based results
        await expect(page.locator('.provider-card')).toHaveCountGreaterThan(0);
        await expect(page.locator('.distance-badge')).toBeVisible();
    });

    test('should sort providers by rating', async ({ page }) => {
        await page.goto('/providers?category=Electrician');

        // Sort by rating
        await page.selectOption('select[name="sort"]', 'rating');

        // Verify first provider has highest rating
        const ratings = await page.locator('.provider-rating').allTextContents();
        const ratingValues = ratings.map(r => parseFloat(r));
        expect(ratingValues[0]).toBeGreaterThanOrEqual(ratingValues[1]);
    });

    test('should display verified providers first', async ({ page }) => {
        await page.goto('/providers?category=Plumber');

        // Verify verified badge on first results
        const firstProvider = page.locator('.provider-card').first();
        await expect(firstProvider.locator('.verification-badge')).toBeVisible();
    });

    test('should show provider details on click', async ({ page }) => {
        await page.goto('/providers');

        // Click first provider
        await page.locator('.provider-card').first().click();

        // Verify provider details page
        await expect(page.locator('.provider-name')).toBeVisible();
        await expect(page.locator('.provider-bio')).toBeVisible();
        await expect(page.locator('.experience-years')).toBeVisible();
        await expect(page.locator('.service-radius')).toBeVisible();
        await expect(page.locator('.total-jobs')).toBeVisible();
    });
});
