import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
    test('uses the Munich homepage anchors', async ({ page }) => {
        await page.goto('/');
        const navLinks = [
            { name: 'Focus', hash: '#focus' },
            { name: 'Experience', hash: '#experience' },
            { name: 'Work', hash: '#work' },
            { name: 'Writing', hash: '#writing' },
            { name: 'Contact', hash: '#contact' },
        ];

        for (const { name, hash } of navLinks) {
            await page.locator('header nav').getByRole('link', { name }).click();
            await expect(page).toHaveURL(new RegExp(`.*${hash}$`));
        }
    });

    test('links to projects and writing from the homepage', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: 'All projects →' }).click();
        await expect(page).toHaveURL(/\/projects/);

        await page.goto('/');
        await page.getByRole('link', { name: 'All writing →' }).click();
        await expect(page).toHaveURL(/\/blog/);
    });

    test('takes the hero action to focus', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: /Get to know me/i }).click();
        await expect(page).toHaveURL(/#focus$/);
    });

    test('uses contextual inner-page navigation', async ({ page }) => {
        await page.goto('/projects');
        await page.locator('header nav').getByRole('link', { name: 'Writing' }).click();
        await expect(page).toHaveURL(/\/blog/);
    });
});
