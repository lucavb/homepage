import { describe, it, expect, vi } from 'vitest';
import type { CollectionEntry } from 'astro:content';

vi.mock('astro:content', () => ({
    getCollection: vi.fn(),
}));

vi.mock('astro:assets', () => ({
    getImage: vi.fn(),
}));

import { getCollection } from 'astro:content';
import { getPublishedPosts, getAllPosts, selectRelatedPosts, formatPostDate } from '@lib/posts';

type BlogEntry = CollectionEntry<'blog'>;

const makePost = (id: string, publishDate: string, extra: Partial<CollectionEntry<'blog'>['data']> = {}): BlogEntry =>
    ({
        id,
        body: '',
        filePath: '',
        data: {
            title: id,
            description: `desc-${id}`,
            publishDate: new Date(publishDate),
            tags: [],
            ...extra,
        },
    }) as unknown as BlogEntry;

// Fabricated collection, effectively newest-first by publishDate.
const BLOG_POSTS = [
    makePost('g', '2026-08-01T10:00:00Z'),
    makePost('f', '2026-07-01T10:00:00Z', { tags: ['ai'] }),
    makePost('e', '2026-06-01T10:00:00Z', { tags: ['ai', 'web'] }),
    makePost('d', '2026-05-01T10:00:00Z', { draft: true }),
    makePost('c', '2026-04-01T10:00:00Z', { tags: ['infra'] }),
    makePost('b', '2026-03-01T10:00:00Z', { tags: ['web'] }),
    makePost('a', '2026-02-01T10:00:00Z', { draft: true }),
];

const byId = (posts: BlogEntry[]) => posts.map((post) => post.id);

describe('selectRelatedPosts', () => {
    it('tier 1 takes curated posts in posts order, capped at max', () => {
        const result = selectRelatedPosts(BLOG_POSTS, {
            currentId: 'c',
            relatedPostIds: ['g', 'b', 'e', 'f'],
        });
        expect(byId(result)).toEqual(['g', 'f', 'e']);
        expect(result).toHaveLength(3);
    });

    it('tier 1 does NOT exclude the current post when the author curates it', () => {
        const result = selectRelatedPosts(BLOG_POSTS, { currentId: 'g', relatedPostIds: ['g', 'f'], max: 2 });
        expect(byId(result)).toEqual(['g', 'f']);
    });

    it('tier 2 scores by tag overlap and fills up to max', () => {
        // current: f (tag 'ai'). Curated g and c leave one slot; e scores 1 ('ai'), b scores 0.
        const result = selectRelatedPosts(BLOG_POSTS, {
            currentId: 'f',
            relatedPostIds: ['g', 'c'],
            tags: ['ai'],
        });
        // final sort: g (2026-08), e (2026-06), c (2026-05)
        expect(byId(result)).toEqual(['g', 'e', 'c']);
    });

    it('tier 2 tie-breaks equal scores by publishDate desc', () => {
        // current: f. No curated ones. Tags 'web': e (2026-06) and b (2026-03) both score 1.
        const result = selectRelatedPosts(BLOG_POSTS, { currentId: 'f', tags: ['web'], max: 2 });
        expect(byId(result)).toEqual(['e', 'b']);
    });

    it('tier 2 only counts overlap above zero', () => {
        const unrelated = [
            makePost('g', '2026-08-01T10:00:00Z', { tags: ['unknown'] }),
            makePost('f', '2026-07-01T10:00:00Z', { tags: ['ai'] }),
            makePost('e', '2026-06-01T10:00:00Z', { tags: [] }),
        ];
        const result = selectRelatedPosts(unrelated, { currentId: 'f', tags: ['ai'] });
        // No other post shares 'ai', so tier 3 recency fills.
        expect(byId(result)).toEqual(['g', 'e']);
    });

    it('tier 3 fills remaining slots by publishDate desc, excluding the current post', () => {
        // Pure function: the array passed in is taken as-is (draft filtering happens upstream).
        const result = selectRelatedPosts(BLOG_POSTS, { currentId: 'g' });
        expect(byId(result)).toEqual(['f', 'e', 'd']);
        expect(result).toHaveLength(3);
    });

    it('never includes the current post via tiers 2/3 even with matching tags', () => {
        const result = selectRelatedPosts(BLOG_POSTS, { currentId: 'e', tags: ['ai', 'infra', 'web'] });
        expect(byId(result)).toEqual(['f', 'c', 'b']);
        expect(byId(result)).not.toContain('e');
    });

    it('sorts the final result newest-first across tiers', () => {
        // Curated post b is much older than the tier-2 tag match f and recency fill g.
        const result = selectRelatedPosts(BLOG_POSTS, {
            currentId: 'e',
            relatedPostIds: ['b'],
            tags: ['ai'],
        });
        expect(byId(result)).toEqual(['g', 'f', 'b']);
    });

    it('respects a custom max', () => {
        const result = selectRelatedPosts(BLOG_POSTS, { currentId: 'g', max: 2 });
        expect(byId(result)).toEqual(['f', 'e']);
        expect(result).toHaveLength(2);
    });

    it('returns empty when nothing applies (only the current post exists)', () => {
        const result = selectRelatedPosts([makePost('c', '2026-04-01T10:00:00Z')], {
            currentId: 'c',
            tags: ['infra'],
        });
        expect(result).toEqual([]);
    });
});

describe('getPublishedPosts', () => {
    it('excludes drafts and sorts newest-first', async () => {
        vi.mocked(getCollection).mockResolvedValue(BLOG_POSTS);
        const posts = await getPublishedPosts();
        expect(byId(posts)).toEqual(['g', 'f', 'e', 'c', 'b']);
        expect(byId(posts)).not.toContain('d');
        expect(byId(posts)).not.toContain('a');
    });
});

describe('getAllPosts', () => {
    it('keeps drafts and sorts newest-first', async () => {
        vi.mocked(getCollection).mockResolvedValue(BLOG_POSTS);
        const posts = await getAllPosts();
        expect(byId(posts)).toEqual(['g', 'f', 'e', 'd', 'c', 'b', 'a']);
    });
});

describe('formatPostDate', () => {
    it('formats as day-first long month', () => {
        expect(formatPostDate(new Date(Date.UTC(2026, 2, 5, 12, 0, 0)))).toBe('5 March 2026');
    });
});
