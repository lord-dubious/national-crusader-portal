import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const BreakingNewsTicker = () => {
  const navigate = useNavigate();

  const { data: breakingNews } = useQuery({
    queryKey: ["breaking-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          slug,
          article_tags (
            tags (
              slug
            )
          )
        `)
        .eq('status', 'published')
        .eq('article_tags.tags.slug', 'breaking-news')
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (!breakingNews?.length) return null;

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {breakingNews.map((article, index) => (
          <button
            key={article.id}
            onClick={() => navigate(`/article/${article.slug}`)}
            className={cn(
              "px-4 font-semibold hover:underline cursor-pointer",
              index !== 0 && "border-l border-red-400"
            )}
          >
            BREAKING: {article.title}
          </button>
        ))}
      </div>
    </div>
  );
};