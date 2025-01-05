export const createFunctionsSQL = `
  -- Enable necessary extensions
  CREATE EXTENSION IF NOT EXISTS "pg_trgm";

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

  -- Create the trigger
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
`;