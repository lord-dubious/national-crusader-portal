import { z } from "zod";

export interface Article {
  id: number;
  title: string;
  content: string;
  category_id: number | null;
  status: string | null;
  author_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  slug: string;
  is_featured: boolean | null;
  category?: {
    id: number;
    name: string;
  };
  tags?: number[];
}

export const articleFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category_id: z.number().nullable(),
  status: z.string().nullable(),
  excerpt: z.string().nullable(),
  featured_image: z.string().nullable(),
  is_featured: z.boolean().nullable(),
  author_id: z.string().nullable(),
  tags: z.array(z.number()).nullable(),
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;