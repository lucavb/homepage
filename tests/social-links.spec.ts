import { test, expect } from '@playwright/test';

test.describe('Social Links', () => {
    test('should have correct social media links in header', async ({ page }) => {
        await page.goto('/');

        const banner = page.locator('header, [role="banner"]').first();

        const githubLink = banner.getByRole('link', { name: /GitHub/i });
        await expect(githubLink).toHaveAttribute('href', 'https://github.com/lucavb');

        const linkedinLink = banner.getByRole('link', { name: /LinkedIn/i });
        await expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/lucabecker/');

        const emailLink = banner.getByRole('link', { name: /Email/i });
        await expect(emailLink).toHaveAttribute('href', 'mailto:hello@luca-becker.me');
    });

    test('should have correct social media links in footer', async ({ page }) => {
        await page.goto('/');

        const footer = page.locator('footer, [role="contentinfo"]');

        const githubLink = footer.getByRole('link', { name: /GitHub/i });
        await expect(githubLink).toHaveAttribute('href', 'https://github.com/lucavb');

        const linkedinLink = footer.getByRole('link', { name: /LinkedIn/i });
        await expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/lucabecker/');

        const emailLink = footer.getByRole('link', { name: /Email/i });
        await expect(emailLink).toHaveAttribute('href', 'mailto:hello@luca-becker.me');
    });

    test('should have Impressum link in footer', async ({ page }) => {
        await page.goto('/');

        const footer = page.locator('footer, [role="contentinfo"]');
        const impressumLink = footer.getByRole('link', { name: /Impressum/i });

        await expect(impressumLink).toHaveAttribute('href', '/impressum');
    });
});
