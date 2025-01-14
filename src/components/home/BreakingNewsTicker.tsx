import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const BreakingNewsTicker = () => {
  const { data: breakingNews } = useQuery({
    queryKey: ["breaking-news"],
    queryFn: async () => {
      console.log("Fetching breaking news articles");
      const { data: tags } = await supabase
        .from("tags")
        .select("id")
        .or('slug.eq.breaking-news,slug.eq.breaking-news-1');

      if (!tags?.length) return [];
      
      const tagIds = tags.map(tag => tag.id);
      
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          slug,
          article_tags!inner(
            tag_id
          )
        `)
        .eq("status", "published")
        .in('article_tags.tag_id', tagIds)
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Error fetching breaking news:", error);
        throw error;
      }
      
      console.log("Breaking news articles:", data);
      return data;
    },
  });

  if (!breakingNews?.length) return null;

  return (
    <div className="bg-accent text-accent-foreground py-2 overflow-hidden">
      <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap">
        {breakingNews.map((article, index) => (
          <Link
            key={article.id}
            to={`/article/${article.slug}`}
            className="inline-block mx-4"
          >
            <span className="font-bold mr-2">BREAKING NEWS:</span>
            {article.title}
            {index < breakingNews.length - 1 && (
              <span className="mx-4">•</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};