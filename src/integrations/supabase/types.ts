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
      admin_users: {
        Row: {
          created_at: string | null
          email: string
        }
        Insert: {
          created_at?: string | null
          email: string
        }
        Update: {
          created_at?: string | null
          email?: string
        }
        Relationships: []
      }
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
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string
          role: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
        Relationships: []
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