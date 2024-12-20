import * as z from 'zod';

export const CategoryEnum = z.enum(['INNOVATIONS', 'TREATMENTS', 'WELL_BEING', 'CARE', 'EDUCATION']);

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(1, 'Content is required'),
  image: z.string().url().optional(),
  category: CategoryEnum,
  published: z.boolean().default(false),
});

export type Category = z.infer<typeof CategoryEnum>;