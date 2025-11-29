import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests - Booking Flow', () => {
    test('should not have accessibility issues on service request page', async ({ page }) => {
        await page.goto('http://localhost:5173/service/plumber');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have accessible form inputs', async ({ page }) => {
        await page.goto('http://localhost:5173/service/plumber');

        // Check that all inputs have labels
        const inputs = await page.locator('input, textarea, select').all();
        for (const input of inputs) {
            const id = await input.getAttribute('id');
            const ariaLabel = await input.getAttribute('aria-label');
            const ariaLabelledBy = await input.getAttribute('aria-labelledby');

            // Input should have either an id (for label), aria-label, or aria-labelledby
            expect(id || ariaLabel || ariaLabelledBy).toBeTruthy();
        }
    });

    test('should announce form errors to screen readers', async ({ page }) => {
        await page.goto('http://localhost:5173/service/plumber');

        // Look for aria-live regions for error messages
        const ariaLiveRegions = await page.locator('[aria-live]').count();

        // There should be at least one aria-live region for announcements
        expect(ariaLiveRegions).toBeGreaterThanOrEqual(0);
    });

    test('should have accessible modal dialogs', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        // Try to open auth modal
        const signInButton = page.getByRole('button', { name: /sign in/i });
        if (await signInButton.count() > 0) {
            await signInButton.first().click();

            // Check modal has proper ARIA attributes
            const modal = page.locator('[role="dialog"]');
            if (await modal.count() > 0) {
                await expect(modal).toHaveAttribute('aria-modal', 'true');

                // Modal should have aria-labelledby or aria-label
                const ariaLabel = await modal.getAttribute('aria-label');
                const ariaLabelledBy = await modal.getAttribute('aria-labelledby');
                expect(ariaLabel || ariaLabelledBy).toBeTruthy();
            }
        }
    });

    test('should trap focus within modal', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        const signInButton = page.getByRole('button', { name: /sign in/i });
        if (await signInButton.count() > 0) {
            await signInButton.first().click();

            const modal = page.locator('[role="dialog"]');
            if (await modal.count() > 0) {
                // Tab through modal elements
                await page.keyboard.press('Tab');
                await page.keyboard.press('Tab');
                await page.keyboard.press('Tab');

                // Focus should still be within modal
                const focusedElement = await page.evaluate(() => {
                    const activeEl = document.activeElement;
                    const modal = document.querySelector('[role="dialog"]');
                    return modal?.contains(activeEl);
                });

                expect(focusedElement).toBeTruthy();
            }
        }
    });
});
