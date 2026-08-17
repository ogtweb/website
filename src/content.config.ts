import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z
        .object({
          contentType: z.enum(['navigation', 'entry']),
          date: z.coerce.date().optional(),
          tags: z.array(z.string()).default([]),
          platform: z.enum(['tryhackme']).optional(),
        })
        .superRefine((data, context) => {
          if (data.contentType === 'navigation' && data.date) {
            context.addIssue({
              code: 'custom',
              path: ['date'],
              message: 'Navigation pages cannot have publication dates.',
            });
          }
        }),
    }),
  }),
};
