import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const BreakingNewsTicker = () => {
  const { data: breakingNews } = useQuery({
    queryKey: ["breaking-news"],
    queryFn: async () => {
      // First, get the breaking-news tag ID
      const { data: tagData, error: tagError } = await supabase
        .from("tags")
        .select("id")
        .eq("slug", "breaking-news")
        .single();

      if (tagError) {
        console.error("Error fetching breaking-news tag:", tagError);
        return [];
      }

      if (!tagData) {
        console.log("No breaking-news tag found");
        return [];
      }

      // Then fetch articles with this tag
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          slug,
          article_tags!inner (
            tag_id
          )
        `)
        .eq("status", "published")
        .eq("article_tags.tag_id", tagData.id);

      if (error) {
        console.error("Error fetching breaking news articles:", error);
        return [];
      }

      console.log("Breaking news articles found:", data);
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