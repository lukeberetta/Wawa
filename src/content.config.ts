import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Journal — the "Letters" essays from the NEW/ content tree.
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
    // 'press' = external media coverage; 'essay' = Wawa's own writing
    category: z.enum(['press', 'essay']).default('essay'),
    publication: z.string().optional(),
    link: z.string().optional(),
  }),
});

export const collections = { journal };
