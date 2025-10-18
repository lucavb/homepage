import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
    test('should load and display all key sections', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await page.goto('/');

        await expect(page).toHaveTitle(/Luca Becker/);

        await expect(page.getByRole('heading', { name: /About Me/i, exact: true })).toBeVisible();
        await expect(page.getByRole('heading', { name: /Professional Experience/i })).toBeVisible();
        await expect(page.getByRole('heading', { name: /Featured Projects/i })).toBeVisible();
        await expect(page.getByRole('heading', { name: /Latest Blog Posts/i })).toBeVisible();
        await expect(page.getByRole('heading', { name: /Let's Work Together/i })).toBeVisible();

        expect(errors, `Console errors detected: ${errors.join(', ')}`).toHaveLength(0);
    });
});

test.describe('Blog', () => {
    test('should load blog index page', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await page.goto('/blog/');

        await expect(page).toHaveTitle(/Blog/);
        await expect(page.getByRole('heading', { name: /^Blog$/i, exact: true })).toBeVisible();

        const blogPosts = page.locator('article, .blog-post-card, a[href^="/blog/"]');
        await expect(blogPosts.first()).toBeVisible();

        expect(errors, `Console errors detected: ${errors.join(', ')}`).toHaveLength(0);
    });

    test('should load a blog post page', async ({ page }) => {
        await page.goto('/blog/');

        const firstPostLink = page
            .locator('a[href^="/blog/"]')
            .filter({ hasNotText: /^Blog$/ })
            .first();
        await firstPostLink.click();

        await page.waitForLoadState('networkidle');

        await expect(page.locator('article, .prose')).toBeVisible();
    });
});

test.describe('Projects', () => {
    test('should load projects page', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await page.goto('/projects/');

        await expect(page).toHaveTitle(/Projects/);
        await expect(page.getByRole('heading', { name: /Projects/i })).toBeVisible();

        expect(errors, `Console errors detected: ${errors.join(', ')}`).toHaveLength(0);
    });
});

test.describe('Impressum', () => {
    test('should load impressum page', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('console', (msg) => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        await page.goto('/impressum/');

        await expect(page).toHaveTitle(/Impressum/);
        await expect(page.getByRole('heading', { name: /Impressum/i })).toBeVisible();

        expect(errors, `Console errors detected: ${errors.join(', ')}`).toHaveLength(0);
    });
});

test.describe('Navigation', () => {
    test('should have working page navigation links', async ({ page }) => {
        await page.goto('/');

        await page.click('a[href="/blog"]');
        await expect(page).toHaveURL(/\/blog/);

        await page.goto('/');

        await page.click('a[href="/projects"]');
        await expect(page).toHaveURL(/\/projects/);
    });
});
