import rss from '@astrojs/rss';
import { info } from '@data';
import { getPublishedPosts } from '@lib/posts';
import { absolutizeUrl } from '@lib/meta';

export async function GET() {
    const publishedPosts = await getPublishedPosts();

    return rss({
        title: `${info.name} — Writing`,
        description: info.blogDescription,
        site: info.baseUrl,
        items: publishedPosts.map((post) => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.publishDate,
            link: absolutizeUrl(`/blog/${post.id}/`),
            categories: post.data.tags || [],
        })),
        customData: `<language>en-us</language>`,
    });
}
