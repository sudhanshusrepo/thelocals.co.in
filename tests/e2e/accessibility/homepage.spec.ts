import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests - Homepage', () => {
    test('should not have any automatically detectable accessibility issues on homepage', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should have proper heading hierarchy', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBeGreaterThanOrEqual(1);

        // Check that there's only one h1
        expect(h1Count).toBeLessThanOrEqual(1);
    });

    test('should have alt text for all images', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        const images = await page.locator('img').all();
        for (const img of images) {
            const alt = await img.getAttribute('alt');
            expect(alt).toBeTruthy();
        }
    });

    test('should have proper ARIA labels for interactive elements', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        const buttons = await page.locator('button').all();
        for (const button of buttons) {
            const ariaLabel = await button.getAttribute('aria-label');
            const text = await button.textContent();

            // Either button should have text content or aria-label
            expect(ariaLabel || text?.trim()).toBeTruthy();
        }
    });

    test('should be keyboard navigable', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        // Tab through interactive elements
        await page.keyboard.press('Tab');
        const firstFocusedElement = await page.evaluate(() => document.activeElement?.tagName);
        expect(firstFocusedElement).toBeTruthy();

        // Ensure focus is visible
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
    });

    test('should have sufficient color contrast', async ({ page }) => {
        await page.goto('http://localhost:5173/');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2aa'])
            .include('body')
            .analyze();

        const colorContrastViolations = accessibilityScanResults.violations.filter(
            v => v.id === 'color-contrast'
        );

        expect(colorContrastViolations).toEqual([]);
    });
});
