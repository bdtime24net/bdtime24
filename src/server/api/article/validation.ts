import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  urlToImage: z.array(z.string().url()).min(1, { message: 'At least one image URL is required' }),
  categoryId: z.string().min(1, { message: 'Category ID is required' }),
  tagId: z.string().min(1, { message: 'Tag ID is required' }),
});




// Define Zod validation schema for updating an article
export const updatePostSchema = z.object({
    id: z.string(),
    title: z.string().min(1, { message: "Title is required" }).optional(),
    slug: z.string().min(1, { message: "Slug is required" }).optional(),
    description: z.string().min(1, { message: "Description is required" }).optional(),
    urlToImage: z.array(z.string()).optional(),
    categoryId: z.string().optional(),
    tagId: z.string().optional(),
  });