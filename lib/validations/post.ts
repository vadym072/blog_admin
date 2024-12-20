import * as z from 'zod';

export const CategoryEnum = z.enum(['INNOVATIONS', 'TREATMENTS', 'WELL_BEING', 'CARE', 'EDUCATION']);

export const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  image: z.string().optional(),
  category: z.enum(["WELL_BEING", "TREATMENTS", "INNOVATIONS", "CARE", "EDUCATION"]),
  published: z.boolean(),
});

export type Category = z.infer<typeof CategoryEnum>;