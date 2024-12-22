export interface Article {
  id: number;
  title: string;
  status: 'draft' | 'published';
  created_at: string;
  category: {
    name: string;
  } | null;
  author: {
    email: string;
  } | null;
}

export interface ArticleRowProps {
  article: Article;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}