import { info } from '@data';

export const DEFAULT_OG_IMAGE = '/assets/images/og-image.png';
export const OG_IMAGE_VERSION = '20260715';

export function absolutizeUrl(url: string): string {
    return url.startsWith('http') ? url : new URL(url, info.baseUrl).toString();
}

export function buildMeta(opts: {
    title?: string;
    description?: string;
    path: string;
    ogImage?: string;
    publishDate?: Date;
    tags?: string[];
    isArticle?: boolean;
    author?: string;
}): { pageTitle: string; currentUrl: string; absoluteImageUrl: string; structuredData: object } {
    const {
        title = '',
        description = '',
        path,
        ogImage = DEFAULT_OG_IMAGE,
        publishDate,
        tags = [],
        isArticle = false,
        author = info.name,
    } = opts;

    const currentUrl = new URL(path, info.baseUrl).toString();
    const resolvedOgImageUrl = ogImage === DEFAULT_OG_IMAGE ? `${ogImage}?v=${OG_IMAGE_VERSION}` : ogImage;
    const absoluteImageUrl = absolutizeUrl(resolvedOgImageUrl);

    const pageTitle = title ? (title.startsWith(info.name) ? title : `${title} | ${info.name}`) : info.name;

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
            url: info.baseUrl,
            jobTitle: info.jobDescription,
            sameAs: [info.socialMedia.github, info.socialMedia.linkedin],
        },
        publisher: {
            '@type': 'Person',
            name: info.name,
            url: info.baseUrl,
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

    return { pageTitle, currentUrl, absoluteImageUrl, structuredData };
}
