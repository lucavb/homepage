import { test, expect } from '@playwright/test';

test.describe('Interactive Features', () => {
    test('should toggle theme between light and dark mode', async ({ page }) => {
        await page.goto('/');

        const htmlElement = page.locator('html');
        const themeToggleButton = page.getByRole('button', { name: /Toggle theme/i });

        await themeToggleButton.hover();
        await page.getByRole('button', { name: 'Dark' }).waitFor({ state: 'visible' });

        await page.getByRole('button', { name: 'Dark' }).click();

        let theme = await htmlElement.getAttribute('class');
        expect(theme).toContain('dark');

        await themeToggleButton.hover();
        await page.getByRole('button', { name: 'Light' }).waitFor({ state: 'visible' });

        await page.getByRole('button', { name: 'Light' }).click();

        theme = await htmlElement.getAttribute('class');
        expect(theme).not.toContain('dark');

        await themeToggleButton.hover();
        await page.getByRole('button', { name: 'System' }).waitFor({ state: 'visible' });

        await page.getByRole('button', { name: 'System' }).click();

        const systemTheme = await htmlElement.getAttribute('class');
        expect(systemTheme).toBeDefined();
    });

    test('should reveal email address on click', async ({ page }) => {
        await page.goto('/');

        const emailSection = page.locator('text=[Click to reveal email]').locator('..');
        await expect(emailSection).toBeVisible();

        await emailSection.click();

        const emailLink = page.getByRole('link', { name: /hello@luca-becker.me/i });
        await expect(emailLink).toBeVisible();
        await expect(emailLink).toHaveAttribute('href', 'mailto:hello@luca-becker.me');
    });
});
