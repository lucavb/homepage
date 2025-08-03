import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    site: 'https://luca-becker.me',
    output: 'static',
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
