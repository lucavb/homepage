import { test, expect } from '@playwright/test';
import { checkAccessibility } from './utils/accessibility';

test.describe('Accessibility', () => {
    test.describe('Homepage', () => {
        test('should have no WCAG 2.1 AA violations', async ({ page }) => {
            await page.goto('/');
            await page.waitForLoadState('networkidle');

            await checkAccessibility(page);
        });

        test('should have no violations in navigation', async ({ page }) => {
            await page.goto('/');

            await checkAccessibility(page, {
                include: ['nav', 'header'],
            });
        });
    });

    test.describe('Blog', () => {
        test('blog index should have no accessibility violations', async ({ page }) => {
            await page.goto('/blog/');
            await page.waitForLoadState('networkidle');

            await checkAccessibility(page);
        });

        test('blog post should have no accessibility violations', async ({ page }) => {
            await page.goto('/blog/');

            // Navigate to first blog post
            const firstPostLink = page
                .locator('a[href^="/blog/"]')
                .filter({ hasNotText: /^Blog$/ })
                .first();
            await firstPostLink.click();
            await page.waitForLoadState('networkidle');

            await checkAccessibility(page);
        });
    });

    test.describe('Projects', () => {
        test('projects page should have no accessibility violations', async ({ page }) => {
            await page.goto('/projects/');
            await page.waitForLoadState('networkidle');

            await checkAccessibility(page);
        });
    });

    test.describe('Dark Mode', () => {
        test('should have no violations in dark mode', async ({ page }) => {
            await page.goto('/');

            // Enable dark mode
            const themeToggle = page.getByRole('button', { name: /Toggle theme/i });
            await themeToggle.hover();
            await page.getByRole('button', { name: 'Dark' }).click();

            // Wait for theme transition
            await page.waitForTimeout(300);

            await checkAccessibility(page);
        });
    });

    test.describe('Interactive Elements', () => {
        test('all interactive elements should be keyboard accessible', async ({ page }) => {
            await page.goto('/');

            // Check that buttons have accessible names
            const buttons = page.getByRole('button');
            const buttonCount = await buttons.count();
            for (let i = 0; i < Math.min(buttonCount, 10); i++) {
                const button = buttons.nth(i);
                const name = (await button.getAttribute('aria-label')) || (await button.textContent());
                expect(name).toBeTruthy();
            }

            // Run full aXe check
            await checkAccessibility(page);
        });
    });
});
