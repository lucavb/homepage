import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
    site: 'https://luca-becker.me',
    output: 'static',
    markdown: {
        syntaxHighlight: {
            excludeLangs: ['mermaid'],
        },
        rehypePlugins: [
            rehypeSlug,
            [
                rehypeAutolinkHeadings,
                {
                    behavior: 'append',
                    properties: {
                        className: ['heading-anchor'],
                        ariaLabel: 'Link to this heading',
                    },
                    content: {
                        type: 'element',
                        tagName: 'svg',
                        properties: {
                            width: 20,
                            height: 20,
                            viewBox: '0 0 16 16',
                            fill: 'currentColor',
                            xmlns: 'http://www.w3.org/2000/svg',
                            className: ['heading-anchor-icon'],
                        },
                        children: [
                            {
                                type: 'element',
                                tagName: 'path',
                                properties: {
                                    d: 'M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z',
                                },
                            },
                        ],
                    },
                },
            ],
        ],
    },
    integrations: [
        mdx(),
        tailwind({
            // Enable CSS purging
            config: {
                content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
                // Add purge safelist if needed
                safelist: [],
            },
        }),
        sitemap({
            changefreq: 'weekly',
            priority: 0.7,
            lastmod: new Date(),
        }),
        robotsTxt(),
    ],
    image: {
        // Configure image optimization
        service: {
            entrypoint: 'astro/assets/services/sharp',
            config: {
                limitInputPixels: false,
            },
        },
        // Enable experimental responsive images
        experimentalLayout: 'responsive',
    },
    vite: {
        build: {
            // Enable CSS code splitting for better caching
            cssCodeSplit: true,
            rollupOptions: {
                output: {
                    assetFileNames: 'assets/[name].[hash][extname]',
                    chunkFileNames: 'assets/[name].[hash].js',
                    entryFileNames: 'assets/[name].[hash].js',
                },
            },
        },
    },
});
