import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

const MAX_RELATED_POSTS = 3;
const DEFAULT_OG_IMAGE = '/assets/images/og-image.png';

const byPublishDateDesc = (a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>): number =>
    b.data.publishDate.getTime() - a.data.publishDate.getTime();

export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
    const all = await getCollection('blog');
    return all.filter((post) => post.data.draft !== true).sort(byPublishDateDesc);
}

export async function getAllPosts(): Promise<CollectionEntry<'blog'>[]> {
    const all = await getCollection('blog');
    return [...all].sort(byPublishDateDesc);
}

const getTagScore = (postTags: string[] | undefined, currentTags: string[] | undefined): number => {
    if (!postTags || !currentTags || postTags.length === 0 || currentTags.length === 0) {
        return 0;
    }
    const overlap = postTags.filter((tag) => currentTags.includes(tag)).length;
    return overlap;
};

export function selectRelatedPosts(
    posts: CollectionEntry<'blog'>[],
    opts: { currentId: string; relatedPostIds?: string[]; tags?: string[]; max?: number },
): CollectionEntry<'blog'>[] {
    const { currentId, relatedPostIds, tags } = opts;
    const max = opts.max ?? MAX_RELATED_POSTS;
    const currentPost = posts.find((post) => post.id === currentId);
    const pool = currentPost ? posts.filter((post) => post.id !== currentId) : posts;

    const relatedPosts: CollectionEntry<'blog'>[] = [];

    // Tier 1: curated picks. The author's explicit choice — currentId is not excluded.
    if (relatedPostIds && relatedPostIds.length > 0) {
        relatedPosts.push(...posts.filter((post) => relatedPostIds.includes(post.id)).slice(0, max));
    }

    // Tier 2: tag overlap, best score first, publishDate desc as tie-break.
    if (relatedPosts.length < max && tags && tags.length > 0) {
        const tagBasedPosts = pool
            .filter((post) => !relatedPosts.some((rp) => rp.id === post.id))
            .map((post) => ({
                post,
                score: getTagScore(post.data.tags, tags),
            }))
            .filter(({ score }) => score > 0)
            .sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score;
                }
                return byPublishDateDesc(a.post, b.post);
            })
            .slice(0, max - relatedPosts.length)
            .map(({ post }) => post);

        relatedPosts.push(...tagBasedPosts);
    }

    // Tier 3: recency fill.
    if (relatedPosts.length < max) {
        const recentPosts = pool
            .filter((post) => !relatedPosts.some((rp) => rp.id === post.id))
            .sort(byPublishDateDesc)
            .slice(0, max - relatedPosts.length);

        relatedPosts.push(...recentPosts);
    }

    return relatedPosts.sort(byPublishDateDesc);
}

const isImageModule = (module: unknown): module is { default: ImageMetadata } => {
    return typeof module === 'object' && module !== null && 'default' in module;
};

export async function resolveOgImage(entry: CollectionEntry<'blog'>): Promise<string> {
    if (entry.data.thumbnail) {
        return entry.data.thumbnail;
    }

    if (!entry.data.heroImagePath) {
        return DEFAULT_OG_IMAGE;
    }

    try {
        const heroImages = import.meta.glob('../assets/images/blog/**/hero.{jpg,jpeg,png,webp}');
        const heroImageModule = await heroImages[`../assets/images/blog/${entry.data.heroImagePath}`]();

        if (isImageModule(heroImageModule)) {
            const optimizedOgImage = await getImage({
                src: heroImageModule.default,
                width: 1200,
                height: 630,
                format: 'jpg',
                quality: 85,
            });

            return optimizedOgImage.src;
        }
    } catch (error) {
        console.warn(`Could not load hero image for og:image:`, error);
    }

    return DEFAULT_OG_IMAGE;
}

export function formatPostDate(date: Date): string {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}
