import { test, expect, Page, ConsoleMessage } from '@playwright/test';

const ANALYTICS_URL = 'https://t.sunbury.xyz/**';

/**
 * Starts console error collection and stubs third-party analytics.
 *
 * The live Umami endpoint answers some browsers with a 403 and a `text/plain`
 * body; the browser then refuses to execute it under `nosniff` and reports a
 * console error. That is a property of the analytics host, not of this site,
 * and because the tag is `async` it also raced the assertion below. Stubbing
 * it keeps "no console errors" a claim about our own code only.
 *
 * Must be called before navigating.
 */
async function preparePage(page: Page) {
    const errors: string[] = [];
    page.on('pageerror', (error: Error) => errors.push(error.message));
    page.on('console', (msg: ConsoleMessage) => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });
    await page.route(ANALYTICS_URL, (route) =>
        route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* stubbed in tests */' }),
    );
    return errors;
}

test.describe('Homepage', () => {
    test('should load and display all key sections', async ({ page }) => {
        const errors = await preparePage(page);

        await page.goto('/');

        await expect(page).toHaveTitle(/Luca Becker/);

        await expect(page.getByRole('heading', { name: /What I work on/i })).toBeVisible();
        await expect(page.getByRole('heading', { name: /^Experience$/i })).toBeVisible();
        await expect(page.getByRole('heading', { name: /Selected projects/i })).toBeVisible();
        await expect(page.getByRole('heading', { name: /Recent writing/i })).toBeVisible();
        await expect(page.getByRole('heading', { name: /Let’s talk/i })).toBeVisible();

        expect(errors, `Console errors detected: ${errors.join(', ')}`).toHaveLength(0);
    });
});

test.describe('Blog', () => {
    test('should load blog index page', async ({ page }) => {
        const errors = await preparePage(page);

        await page.goto('/blog/');

        await expect(page).toHaveTitle(/Writing/);
        await expect(page.getByRole('heading', { name: /^Writing$/i, exact: true })).toBeVisible();

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

        await expect(page.locator('.prose').first()).toBeVisible();
    });
});

test.describe('Projects', () => {
    test('should load projects page', async ({ page }) => {
        const errors = await preparePage(page);

        await page.goto('/projects/');

        await expect(page).toHaveTitle(/Projects/);
        await expect(page.getByRole('heading', { name: /Projects/i })).toBeVisible();

        expect(errors, `Console errors detected: ${errors.join(', ')}`).toHaveLength(0);
    });
});

test.describe('Impressum', () => {
    test('should load impressum page', async ({ page }) => {
        const errors = await preparePage(page);

        await page.goto('/impressum/');

        await expect(page).toHaveTitle(/Impressum/);
        await expect(page.getByRole('heading', { name: /Impressum/i })).toBeVisible();

        expect(errors, `Console errors detected: ${errors.join(', ')}`).toHaveLength(0);
    });
});
