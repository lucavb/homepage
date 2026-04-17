import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        publishDate: z.date(),
        tags: z.array(z.string()).optional(),
        draft: z.boolean().default(false),
        thumbnail: z.string().optional(),
        heroImagePath: z.string().optional(),
        relatedPosts: z.array(z.string()).optional(),
    }),
});

export const collections = { blog };
