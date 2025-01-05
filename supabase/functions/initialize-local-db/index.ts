import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { dbUrl } = await req.json()
    
    if (!dbUrl) {
      return new Response(
        JSON.stringify({ error: 'Database URL is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Connect to the local database
    const client = new Client(dbUrl);
    await client.connect();
    console.log("Connected to local database");

    // Create tables
    await client.queryArray(`
      -- Enable necessary extensions
      CREATE EXTENSION IF NOT EXISTS "pg_trgm";

      -- Categories Table
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        description TEXT
      );

      -- Tags Table
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Profiles Table
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL,
        role TEXT DEFAULT 'viewer',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Articles Table
      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        featured_image TEXT,
        category_id INTEGER REFERENCES categories(id),
        author_id UUID REFERENCES profiles(id),
        status TEXT DEFAULT 'draft',
        published_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_featured BOOLEAN DEFAULT false,
        excerpt TEXT
      );

      -- Article Tags Junction Table
      CREATE TABLE IF NOT EXISTS article_tags (
        article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
        tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (article_id, tag_id)
      );

      -- Site Settings Table
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY,
        logo_type TEXT NOT NULL,
        logo_text TEXT,
        logo_text_color TEXT,
        logo_image_url TEXT,
        logo_font_family TEXT,
        logo_font_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Social Links Table
      CREATE TABLE IF NOT EXISTS social_links (
        id SERIAL PRIMARY KEY,
        platform TEXT NOT NULL,
        url TEXT NOT NULL,
        icon TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Newspapers Table
      CREATE TABLE IF NOT EXISTS newspapers (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        pdf_url TEXT NOT NULL,
        status TEXT DEFAULT 'published',
        published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create search_articles function
      CREATE OR REPLACE FUNCTION search_articles(search_query text)
      RETURNS TABLE(
        id integer,
        title text,
        slug text,
        excerpt text,
        category_name text,
        author_username text,
        similarity double precision
      )
      LANGUAGE plpgsql
      AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          a.id,
          a.title,
          a.slug,
          a.excerpt,
          c.name as category_name,
          p.username as author_username,
          GREATEST(
            CASE 
              WHEN lower(a.title) LIKE '%' || lower(search_query) || '%' THEN 1.0
              ELSE similarity(lower(a.title), lower(search_query)) * 2.0
            END,
            CASE 
              WHEN lower(coalesce(a.excerpt, '')) LIKE '%' || lower(search_query) || '%' THEN 0.8
              ELSE similarity(lower(coalesce(a.excerpt, '')), lower(search_query)) * 1.5
            END,
            CASE 
              WHEN lower(coalesce(a.content, '')) LIKE '%' || lower(search_query) || '%' THEN 0.6
              ELSE similarity(lower(coalesce(a.content, '')), lower(search_query))
            END
          )::double precision as similarity
        FROM articles a
        LEFT JOIN categories c ON a.category_id = c.id
        LEFT JOIN profiles p ON a.author_id = p.id
        WHERE a.status = 'published'
        AND (
          lower(a.title) LIKE '%' || lower(search_query) || '%'
          OR lower(coalesce(a.excerpt, '')) LIKE '%' || lower(search_query) || '%'
          OR lower(coalesce(a.content, '')) LIKE '%' || lower(search_query) || '%'
          OR similarity(lower(a.title), lower(search_query)) > 0.1
          OR similarity(lower(coalesce(a.excerpt, '')), lower(search_query)) > 0.1
          OR similarity(lower(coalesce(a.content, '')), lower(search_query)) > 0.1
        )
        ORDER BY similarity DESC
        LIMIT 10;
      END;
      $$;

      -- Create handle_new_user function and trigger
      CREATE OR REPLACE FUNCTION handle_new_user()
      RETURNS trigger
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      BEGIN
        INSERT INTO public.profiles (id, email, role)
        VALUES (
          NEW.id,
          NEW.email,
          CASE 
            WHEN NEW.email = 'admin@nationalcrusader.com' THEN 'admin'
            ELSE 'viewer'
          END
        );
        RETURN NEW;
      END;
      $$;

      -- Enable Row Level Security
      ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
      ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
      ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
      ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
      ALTER TABLE newspapers ENABLE ROW LEVEL SECURITY;

      -- Create RLS Policies
      -- Categories
      CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
      CREATE POLICY "Categories are editable by authenticated users" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      CREATE POLICY "Categories are updatable by authenticated users" ON categories FOR UPDATE USING (auth.role() = 'authenticated');

      -- Tags
      CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);
      CREATE POLICY "Tags are manageable by authenticated users" ON tags FOR ALL USING (auth.role() = 'authenticated');

      -- Articles
      CREATE POLICY "Enable read access for all users" ON articles FOR SELECT USING (
        CASE
          WHEN status = 'published' THEN true
          WHEN auth.uid() IS NOT NULL AND auth.uid() = author_id THEN true
          ELSE false
        END
      );
      CREATE POLICY "Enable insert for authenticated users" ON articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      CREATE POLICY "Enable update for article authors" ON articles FOR UPDATE USING (auth.uid() = author_id);
      CREATE POLICY "Enable delete for article authors" ON articles FOR DELETE USING (auth.uid() = author_id);
      CREATE POLICY "Enable admin update for all articles" ON articles FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
      );
      CREATE POLICY "Enable admin delete for all articles" ON articles FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
      );

      -- Article Tags
      CREATE POLICY "Article tags are viewable by everyone" ON article_tags FOR SELECT USING (true);
      CREATE POLICY "Article tags are manageable by authenticated users" ON article_tags FOR ALL USING (auth.role() = 'authenticated');

      -- Profiles
      CREATE POLICY "Enable read access for all users" ON profiles FOR SELECT USING (true);
      CREATE POLICY "Enable insert for authentication" ON profiles FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
      CREATE POLICY "Enable controlled updates" ON profiles FOR UPDATE USING (
        CASE
          WHEN auth.uid() = id THEN true
          WHEN role = 'admin' THEN true
          ELSE false
        END
      );
      CREATE POLICY "Enable controlled deletes" ON profiles FOR DELETE USING (
        CASE
          WHEN auth.uid() = id THEN true
          WHEN role = 'admin' THEN true
          ELSE false
        END
      );

      -- Site Settings
      CREATE POLICY "Site settings are viewable by everyone" ON site_settings FOR SELECT USING (true);
      CREATE POLICY "Site settings are manageable by admins" ON site_settings FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
      );

      -- Social Links
      CREATE POLICY "Social links are viewable by everyone" ON social_links FOR SELECT USING (true);

      -- Newspapers
      CREATE POLICY "Newspapers are viewable by everyone" ON newspapers FOR SELECT USING (true);
      CREATE POLICY "Enable insert for authenticated users" ON newspapers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
      CREATE POLICY "Enable update for authenticated users" ON newspapers FOR UPDATE USING (auth.uid() IS NOT NULL);
      CREATE POLICY "Enable delete for authenticated users" ON newspapers FOR DELETE USING (auth.uid() IS NOT NULL);
    `);

    console.log("Created database tables, functions, and policies");

    // Create storage buckets (this would need to be handled differently for local setup)
    console.log("Note: Storage buckets need to be created manually in local Supabase instance:");
    console.log("1. Create 'media' bucket (public)");
    console.log("2. Create 'pdf_newspapers' bucket (public)");
    console.log("3. Create 'db_backups' bucket (private)");

    await client.end();

    return new Response(
      JSON.stringify({ 
        message: 'Database initialized successfully',
        note: 'Remember to create the storage buckets manually in your local Supabase instance'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})