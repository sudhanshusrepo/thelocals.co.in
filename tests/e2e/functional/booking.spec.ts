import { test, expect } from '@playwright/test';

test.describe('Booking System', () => {
    test.beforeEach(async ({ page }) => {
        // Login as test client
        await page.goto('/login');
        await page.fill('input[name="email"]', 'client@example.com');
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/dashboard');
    });

    test('should create an AI-enhanced booking', async ({ page }) => {
        await page.goto('/services');
        await page.click('text=Plumber');

        // Fill booking details
        await page.fill('textarea[name="requirements"]', 'Fix leaking kitchen sink');
        await page.fill('input[name="location"]', 'New York, NY');

        // Submit for AI analysis
        await page.click('button:has-text("Get AI Estimate")');

        // Wait for AI checklist
        await expect(page.locator('.ai-checklist')).toBeVisible();
        await expect(page.locator('.estimated-cost')).toBeVisible();

        // Confirm booking
        await page.click('button:has-text("Confirm Booking")');
        await expect(page.locator('text=Booking created successfully')).toBeVisible();
    });

    test('should send live booking request to providers', async ({ page }) => {
        await page.goto('/bookings/new');

        // Select service category
        await page.selectOption('select[name="category"]', 'Electrician');
        await page.fill('textarea[name="description"]', 'Install ceiling fan');

        // Choose live booking
        await page.click('input[value="LIVE"]');
        await page.click('button:has-text("Find Providers Now")');

        // Verify live request sent
        await expect(page.locator('text=Searching for available providers')).toBeVisible();
        await expect(page.locator('.provider-countdown')).toBeVisible();
    });

    test('should verify booking with OTP', async ({ page }) => {
        // Navigate to active booking
        await page.goto('/bookings');
        await page.click('.booking-card:first-child');

        // Start service (provider would do this)
        await page.click('button:has-text("Start Service")');

        // Enter OTP
        const otpInput = page.locator('input[name="otp"]');
        await expect(otpInput).toBeVisible();
        await otpInput.fill('123456'); // Test OTP

        await page.click('button:has-text("Verify")');
        await expect(page.locator('text=Service started')).toBeVisible();
    });

    test('should complete booking and update status', async ({ page }) => {
        await page.goto('/bookings');

        // Find in-progress booking
        await page.click('.booking-card[data-status="IN_PROGRESS"]');

        // Complete booking
        await page.fill('input[name="finalCost"]', '150.00');
        await page.click('button:has-text("Complete Booking")');

        // Verify completion
        await expect(page.locator('text=Booking completed')).toBeVisible();
        await expect(page.locator('.status-badge:has-text("Completed")')).toBeVisible();
    });
});
