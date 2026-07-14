import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { info } from '../data/info';

export async function GET() {
    const posts = await getCollection('blog');

    // Filter out draft posts and sort by publish date (newest first)
    const publishedPosts = posts
        .filter((post) => !post.data.draft)
        .sort((a, b) => new Date(b.data.publishDate).getTime() - new Date(a.data.publishDate).getTime());

    return rss({
        title: `${info.name} — Writing`,
        description: 'Notes on AI-assisted development, infrastructure, and software engineering.',
        site: info.baseUrl,
        items: publishedPosts.map((post) => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.publishDate,
            link: `${info.baseUrl}/blog/${post.id}/`,
            categories: post.data.tags || [],
        })),
        customData: `<language>en-us</language>`,
    });
}
