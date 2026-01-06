import AxeBuilder from '@axe-core/playwright';
import { Page, expect } from '@playwright/test';

export interface AccessibilityTestOptions {
    /** Tags to include (e.g., 'wcag2a', 'wcag2aa', 'wcag21aa') */
    tags?: string[];
    /** Rules to exclude (e.g., 'color-contrast' for dark mode testing) */
    excludeRules?: string[];
    /** CSS selectors to exclude from testing */
    exclude?: string[];
    /** Specific region to test */
    include?: string[];
}

export async function checkAccessibility(page: Page, options: AccessibilityTestOptions = {}): Promise<void> {
    const { tags = ['wcag2a', 'wcag2aa', 'wcag21aa'], excludeRules = [], exclude = [], include } = options;

    let builder = new AxeBuilder({ page }).withTags(tags).disableRules(excludeRules);

    if (exclude.length > 0) {
        builder = builder.exclude(exclude);
    }

    if (include && include.length > 0) {
        builder = builder.include(include);
    }

    const results = await builder.analyze();

    // Format violations for readable error messages
    const violations = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map((n) => ({
            target: n.target,
            html: n.html.substring(0, 200),
            failureSummary: n.failureSummary,
        })),
    }));

    if (violations.length > 0) {
        console.log('Accessibility violations found:');
        console.log(JSON.stringify(violations, null, 2));
    }

    expect(results.violations, `${results.violations.length} accessibility violation(s) found`).toHaveLength(0);
}
