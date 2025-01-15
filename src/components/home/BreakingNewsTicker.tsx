import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";

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
          published_at,
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

      if (error) {
        console.error("Error fetching breaking news:", error);
        throw error;
      }
      console.log("Breaking news data:", data);
      return data;
    },
    staleTime: 30000, // Refresh every 30 seconds
  });

  if (!breakingNews?.length) {
    console.log("No breaking news available");
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-50 w-full bg-red-600 text-white py-3 shadow-md">
      <div className="container mx-auto px-4 flex items-center">
        <div className="flex-shrink-0 flex items-center mr-4">
          <AlertCircle className="w-5 h-5 mr-2 animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-sm">Breaking News</span>
        </div>
        <div className="overflow-hidden relative flex-1">
          <div className="animate-[marquee_30s_linear_infinite] whitespace-nowrap">
            {breakingNews.map((article, index) => (
              <Link
                key={article.id}
                to={`/article/${article.slug}`}
                className="inline-block hover:underline text-white"
              >
                <span className="mx-4">
                  {article.title}
                  {article.published_at && (
                    <span className="ml-2 text-white/60 text-sm">
                      • {new Date(article.published_at).toLocaleTimeString()}
                    </span>
                  )}
                </span>
                {index < breakingNews.length - 1 && (
                  <span className="mx-2 text-white/60">|</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};