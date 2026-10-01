import { describe, it, expect } from 'vitest';
import { buildMeta, absolutizeUrl, DEFAULT_OG_IMAGE, OG_IMAGE_VERSION } from '@lib/meta';
import { info } from '@data';

const publishDate = new Date(Date.UTC(2026, 2, 5, 12, 0, 0));

describe('absolutizeUrl', () => {
    it('passes through absolute http(s) URLs unchanged', () => {
        expect(absolutizeUrl('https://example.com/img.jpg')).toBe('https://example.com/img.jpg');
        expect(absolutizeUrl('http://example.com/x')).toBe('http://example.com/x');
    });

    it('resolves relative paths against info.baseUrl', () => {
        expect(absolutizeUrl('/blog/foo/')).toBe(`${info.baseUrl}/blog/foo/`);
    });
});

describe('buildMeta: pageTitle', () => {
    it('uses a title that already starts with info.name as-is', () => {
        expect(buildMeta({ title: `${info.name} — Principal Consultant`, path: '/' }).pageTitle).toBe(
            `${info.name} — Principal Consultant`,
        );
    });

    it('suffixes other titles with info.name', () => {
        expect(buildMeta({ title: 'Writing', path: '/blog/' }).pageTitle).toBe(`Writing | ${info.name}`);
    });

    it('falls back to info.name for an empty title', () => {
        expect(buildMeta({ path: '/' }).pageTitle).toBe(info.name);
    });
});

describe('buildMeta: og image resolution', () => {
    it('defaults to the absolutized, versioned og image', () => {
        const { absoluteImageUrl } = buildMeta({ path: '/' });
        expect(absoluteImageUrl).toBe(`${info.baseUrl}${DEFAULT_OG_IMAGE}?v=${OG_IMAGE_VERSION}`);
    });

    it('passes an explicit ogImage through absolutized without a version param', () => {
        const { absoluteImageUrl } = buildMeta({ path: '/', ogImage: '/_astro/hero.CWfnfBCC_29qxrv.png' });
        expect(absoluteImageUrl).toBe(`${info.baseUrl}/_astro/hero.CWfnfBCC_29qxrv.png`);
        expect(absoluteImageUrl).not.toContain('?v=');
    });
});

describe('buildMeta: structuredData', () => {
    it('builds an Article with the date fields when isArticle and publishDate are set', () => {
        const result = buildMeta({
            title: 'Some Article',
            description: 'Some description',
            path: '/blog/some-article/',
            isArticle: true,
            publishDate,
            tags: ['ai', 'web'],
        });
        const structuredData = result.structuredData as Record<string, unknown>;
        expect(structuredData['@type']).toBe('Article');
        expect(structuredData.datePublished).toBe(publishDate.toISOString());
        expect(structuredData.dateModified).toBe(publishDate.toISOString());
        expect(structuredData.headline).toBe('Some Article');
        expect(structuredData.keywords).toBe('ai, web');
        expect(structuredData.name).toBe(`Some Article | ${info.name}`);
    });

    it('builds a WebPage without the date fields when isArticle is false', () => {
        const result = buildMeta({
            title: 'Home',
            path: '/',
            publishDate,
            tags: ['ai'],
        });
        const structuredData = result.structuredData as Record<string, unknown>;
        expect(structuredData['@type']).toBe('WebPage');
        expect(structuredData.datePublished).toBeUndefined();
        expect(structuredData.dateModified).toBeUndefined();
        expect(structuredData.headline).toBeUndefined();
        expect(structuredData.keywords).toBeUndefined();
    });
});

describe('buildMeta: currentUrl', () => {
    it('resolves the page path against info.baseUrl', () => {
        expect(buildMeta({ path: '/blog/foo/' }).currentUrl).toBe(`${info.baseUrl}/blog/foo/`);
    });
});
