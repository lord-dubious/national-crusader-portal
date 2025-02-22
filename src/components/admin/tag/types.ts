export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface TagFormValues {
  name: string;
}