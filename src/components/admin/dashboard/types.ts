export interface Article {
  id: number;
  title: string;
  status: 'draft' | 'published' | 'archived' | 'hidden';
  created_at: string;
  category: {
    name: string;
  } | null;
  author: {
    email: string;
  } | null;
  author_id: string | null;
  category_id: number | null;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  is_featured: boolean;
  published_at: string | null;
  slug: string;
  updated_at: string;
}

export interface ArticleRowProps {
  article: Article;
  onEdit: (id: number) => void;
  onArchive: (id: number) => void;
  onHide: (id: number) => void;
  onDelete: (id: number) => void;
}