import { test, expect } from '@playwright/test';

test.describe('Munich Modern routes', () => {
    test('opens and closes the full-screen mobile menu', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto('/');
        await page.getByRole('button', { name: 'Open menu' }).click();
        await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
        await page.getByRole('dialog', { name: 'Navigation' }).getByRole('button', { name: 'Close menu' }).click();
        await expect(page.locator('#mobile-sidebar')).toHaveAttribute('aria-hidden', 'true');
    });

    test('renders the branded not-found page', async ({ page }) => {
        await page.goto('/does-not-exist');
        await expect(page.getByRole('heading', { name: 'Page not found.' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Home' }).last()).toBeVisible();
    });

    test('keeps legal contact details protected', async ({ page }) => {
        await page.goto('/impressum');
        await expect(page.getByText('[Click to reveal email]')).toBeVisible();
        await expect(page.getByText('[Click to reveal]')).toBeVisible();
    });

    test('publishes the color-ring icon set and a versioned social preview', async ({ page }) => {
        await page.goto('/');

        await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/favicon.svg');
        await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
        await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/site.webmanifest');
        await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
            'content',
            /\/assets\/images\/og-image\.png\?v=20260715$/,
        );
    });
});
