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
  tags?: { id: number; name: string }[];
}

export type ArticleFormValues = Omit<Article, 'id' | 'created_at' | 'updated_at' | 'published_at' | 'slug'> & {
  tag_ids?: number[];
};