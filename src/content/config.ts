import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
    type: 'content',
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

export const collections = {
    blog: blogCollection,
};
