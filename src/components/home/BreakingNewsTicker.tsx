import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const BreakingNewsTicker = () => {
  const { data: breakingNews } = useQuery({
    queryKey: ["breaking-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          slug,
          article_tags!inner(
            tag_id,
            tags!inner(
              id,
              slug
            )
          )
        `)
        .eq("status", "published")
        .eq("article_tags.tags.slug", "breaking-news")
        .order("published_at", { ascending: false });

      if (error) throw error;
      console.log("Breaking news data:", data);
      return data;
    },
  });

  if (!breakingNews?.length) return null;

  return (
    <div className="bg-accent text-accent-foreground py-2 overflow-hidden relative">
      <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite]">
        {breakingNews.map((article, index) => (
          <Link
            key={article.id}
            to={`/article/${article.slug}`}
            className="inline-block mx-4 hover:text-white transition-colors"
          >
            <span className="font-bold mr-2">BREAKING NEWS:</span>
            {article.title}
            {index < breakingNews.length - 1 && (
              <span className="mx-4">•</span>
            )}
          </Link>
        ))}
        {/* Duplicate the content for seamless loop */}
        {breakingNews.map((article, index) => (
          <Link
            key={`duplicate-${article.id}`}
            to={`/article/${article.slug}`}
            className="inline-block mx-4 hover:text-white transition-colors"
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