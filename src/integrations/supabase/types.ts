export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          author_id: string | null
          category_id: number | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: number
          is_featured: boolean | null
          published_at: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category_id?: number | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: number
          is_featured?: boolean | null
          published_at?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category_id?: number | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: number
          is_featured?: boolean | null
          published_at?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
      }
      categories: {
        Row: {
          description: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
          slug?: string
        }
      }
      social_links: {
        Row: {
          created_at: string | null
          icon: string
          id: number
          is_active: boolean | null
          platform: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          icon: string
          id?: number
          is_active?: boolean | null
          platform: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          icon?: string
          id?: number
          is_active?: boolean | null
          platform?: string
          updated_at?: string | null
          url?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}