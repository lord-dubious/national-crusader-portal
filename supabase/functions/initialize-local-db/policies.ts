export const createPoliciesSQL = `
  -- Enable Row Level Security
  ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
  ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
  ALTER TABLE newspapers ENABLE ROW LEVEL SECURITY;

  -- Categories Policies
  CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
  CREATE POLICY "Categories are editable by authenticated users" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  CREATE POLICY "Categories are updatable by authenticated users" ON categories FOR UPDATE USING (auth.role() = 'authenticated');

  -- Tags Policies
  CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);
  CREATE POLICY "Tags are manageable by authenticated users" ON tags FOR ALL USING (auth.role() = 'authenticated');

  -- Articles Policies
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

  -- Article Tags Policies
  CREATE POLICY "Article tags are viewable by everyone" ON article_tags FOR SELECT USING (true);
  CREATE POLICY "Article tags are manageable by authenticated users" ON article_tags FOR ALL USING (auth.role() = 'authenticated');

  -- Profiles Policies
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

  -- Site Settings Policies
  CREATE POLICY "Site settings are viewable by everyone" ON site_settings FOR SELECT USING (true);
  CREATE POLICY "Site settings are manageable by admins" ON site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

  -- Social Links Policies
  CREATE POLICY "Social links are viewable by everyone" ON social_links FOR SELECT USING (true);

  -- Newspapers Policies
  CREATE POLICY "Newspapers are viewable by everyone" ON newspapers FOR SELECT USING (true);
  CREATE POLICY "Enable insert for authenticated users" ON newspapers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  CREATE POLICY "Enable update for authenticated users" ON newspapers FOR UPDATE USING (auth.uid() IS NOT NULL);
  CREATE POLICY "Enable delete for authenticated users" ON newspapers FOR DELETE USING (auth.uid() IS NOT NULL);
`;