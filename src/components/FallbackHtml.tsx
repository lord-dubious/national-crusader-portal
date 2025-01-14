import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const FallbackHtml = () => {
  const { data: articles } = useQuery({
    queryKey: ["fallback-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(name),
          author:profiles(username)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["fallback-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <header style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>National Crusader</h1>
        <nav style={{ marginTop: "10px" }}>
          {categories?.map((category) => (
            <a
              key={category.id}
              href={`/category/${category.slug}`}
              style={{ marginRight: "10px", color: "#000", textDecoration: "none" }}
            >
              {category.name}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Latest News</h2>
        {articles?.map((article) => (
          <article key={article.id} style={{ marginBottom: "30px", borderBottom: "1px solid #eee", paddingBottom: "20px" }}>
            {article.featured_image && (
              <img
                src={article.featured_image}
                alt={article.title}
                style={{ maxWidth: "100%", height: "auto", marginBottom: "10px" }}
              />
            )}
            <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>
              <a
                href={`/article/${article.slug}`}
                style={{ color: "#000", textDecoration: "none" }}
              >
                {article.title}
              </a>
            </h3>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "10px" }}>
              {article.category?.name} | By {article.author?.username}
            </p>
            <p style={{ fontSize: "16px", lineHeight: "1.5" }}>{article.excerpt}</p>
          </article>
        ))}
      </main>

      <footer style={{ marginTop: "40px", borderTop: "1px solid #ccc", paddingTop: "20px", color: "#666" }}>
        <p>© {new Date().getFullYear()} National Crusader. All rights reserved.</p>
      </footer>
    </div>
  );
};