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

      console.log("Found breaking news tags:", tags);
      
      if (!tags?.length) {
        console.log("No breaking news tags found");
        return [];
      }
      
      const tagIds = tags.map(tag => tag.id);
      console.log("Tag IDs to search for:", tagIds);
      
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

  // Remove the conditional rendering to see if the component structure is correct
  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap">
        {breakingNews && breakingNews.length > 0 ? (
          breakingNews.map((article, index) => (
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
          ))
        ) : (
          <span className="inline-block mx-4">No breaking news at this time</span>
        )}
      </div>
    </div>
  );
};