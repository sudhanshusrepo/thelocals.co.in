import { test, expect } from '@playwright/test';

test.describe('Performance Checks', () => {
    test('should load the homepage within acceptable limits', async ({ page }) => {
        const start = Date.now();
        await page.goto('/');
        const end = Date.now();
        const duration = end - start;
        console.log(`Homepage load time: ${duration}ms`);
        expect(duration).toBeLessThan(3000); // Expect load time < 3s

        // Check LCP
        const lcp = await page.evaluate(() => {
            return new Promise((resolve) => {
                new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    resolve(lastEntry.startTime);
                }).observe({ type: 'largest-contentful-paint', buffered: true });
            });
        });
        console.log(`LCP: ${lcp}ms`);
        expect(lcp).toBeLessThan(2500);
    });
});
