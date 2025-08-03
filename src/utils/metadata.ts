import { info } from '@data';

export interface MetadataOptions {
    title?: string;
    description?: string;
    ogImageUrl?: string;
    publishDate?: Date;
    tags?: string[];
    isArticle?: boolean;
    author?: string;
    url?: string;
}

export function generateMetadata(options: MetadataOptions) {
    const {
        title = '',
        description = '',
        ogImageUrl = '/assets/images/og-image.jpg',
        publishDate,
        tags = [],
        isArticle = false,
        author = info.name,
        url = '/',
    } = options;

    const siteUrl = info.baseUrl;
    const currentUrl = new URL(url, siteUrl).toString();
    const absoluteImageUrl = ogImageUrl.startsWith('http') ? ogImageUrl : new URL(ogImageUrl, siteUrl).toString();

    const pageTitle = title ? `${title} | ${info.name}` : info.name;

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': isArticle ? 'Article' : 'WebPage',
        name: pageTitle,
        description: description,
        url: currentUrl,
        image: absoluteImageUrl,
        author: {
            '@type': 'Person',
            name: author,
            url: siteUrl,
            jobTitle: info.jobDescription,
            sameAs: [info.socialMedia.github, info.socialMedia.linkedin],
        },
        publisher: {
            '@type': 'Person',
            name: info.name,
            url: siteUrl,
        },
        ...(isArticle && publishDate
            ? {
                  datePublished: publishDate.toISOString(),
                  dateModified: publishDate.toISOString(),
                  headline: title,
                  keywords: tags.join(', '),
              }
            : {}),
    };

    return {
        pageTitle,
        description,
        currentUrl,
        absoluteImageUrl,
        structuredData,
        publishDate,
        tags,
        isArticle,
        author,
    };
}

export function generateBlogMetadata(blogPost: {
    title: string;
    description: string;
    thumbnail?: string;
    publishDate: Date;
    tags: string[];
    slug: string;
}) {
    return generateMetadata({
        title: blogPost.title,
        description: blogPost.description,
        ogImageUrl: blogPost.thumbnail || '/assets/images/og-image.jpg',
        publishDate: blogPost.publishDate,
        tags: blogPost.tags,
        isArticle: true,
        url: `/blog/${blogPost.slug}`,
    });
}
