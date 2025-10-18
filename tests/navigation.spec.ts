import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
    test('should have working page navigation links', async ({ page }) => {
        await page.goto('/');

        await page.click('a[href="/blog"]');
        await expect(page).toHaveURL(/\/blog/);

        await page.goto('/');

        await page.click('a[href="/projects"]');
        await expect(page).toHaveURL(/\/projects/);
    });

    test('should navigate using anchor hash links in header', async ({ page }) => {
        await page.goto('/');

        const navLinks = [
            { name: 'About', hash: '#about' },
            { name: 'Experience', hash: '#experience' },
            { name: 'Projects', hash: '#projects' },
            { name: 'Blog', hash: '#blog' },
            { name: 'Contact', hash: '#contact' },
        ];

        for (const { name, hash } of navLinks) {
            await page.getByRole('navigation').getByRole('link', { name }).click();
            await expect(page).toHaveURL(new RegExp(`.*${hash}$`));
        }
    });

    test('should navigate using "View All" links', async ({ page }) => {
        await page.goto('/');

        await page.getByRole('link', { name: /View All Projects/i }).click();
        await expect(page).toHaveURL(/\/projects/);

        await page.goto('/');

        await page.getByRole('link', { name: /View All Posts/i }).click();
        await expect(page).toHaveURL(/\/blog/);
    });

    test('should navigate using hero CTA buttons', async ({ page }) => {
        await page.goto('/');

        await page.getByRole('link', { name: /View My Work/i }).click();
        await expect(page).toHaveURL(/#projects/);

        await page.goto('/');

        await page.getByRole('link', { name: /Let's Connect/i }).click();
        await expect(page).toHaveURL(/#contact/);
    });
});
