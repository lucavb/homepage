import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { satteri, satteriHeadingIdsPlugin } from '@astrojs/markdown-satteri';
import { autolinkHeadingsPlugin } from './src/markdown/autolink-headings.ts';

// https://astro.build/config
export default defineConfig({
    site: 'https://luca-becker.me',
    output: 'static',
    cacheDir: './.astro/cache',
    compressHTML: true,
    markdown: {
        syntaxHighlight: {
            excludeLangs: ['mermaid'],
        },
        shikiConfig: {
            themes: {
                light: 'github-light',
                dark: 'github-dark',
            },
        },
        processor: satteri({
            hastPlugins: [satteriHeadingIdsPlugin(), autolinkHeadingsPlugin()],
        }),
    },
    integrations: [
        mdx(),
        sitemap({
            changefreq: 'weekly',
            priority: 0.7,
            lastmod: new Date(),
        }),
        robotsTxt(),
    ],
    image: {
        service: {
            entrypoint: 'astro/assets/services/sharp',
            config: {
                limitInputPixels: false,
            },
        },
        layout: 'constrained',
        responsiveStyles: true,
    },
    vite: {
        plugins: [tailwindcss()],
        environments: {
            client: {
                build: {
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
        },
    },
});
