import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export const TrendingSection = () => {
  const { toast } = useToast();
  const { data: trendingArticles, error } = useQuery({
    queryKey: ["trending-articles"],
    queryFn: async () => {
      console.log("Fetching trending articles");
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          slug,
          category:categories(name)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(4);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching trending articles",
          description: error.message
        });
        throw error;
      }
      return data;
    },
    staleTime: 60 * 1000, // Cache for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  if (error) return null;
  if (!trendingArticles?.length) return null;

  return (
    <section className="bg-muted rounded-xl py-12 px-6 animate-fade-up">
      <div className="container mx-auto">
        <div className="flex items-center mb-8">
          <TrendingUp className="h-6 w-6 text-accent mr-2" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Trending Now</h2>
          <div className="h-1 bg-accent flex-grow ml-4 rounded hidden sm:block" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingArticles.map((article, i) => (
            <Link 
              key={article.id}
              to={`/article/${article.slug}`}
              className="group cursor-pointer hover:bg-background/50 p-4 rounded-lg transition-colors"
            >
              <span className="text-4xl font-bold text-accent mb-2 block">0{i + 1}</span>
              <div>
                <span className="text-sm text-muted-foreground mb-2 block">
                  {article.category?.name || "Uncategorized"}
                </span>
                <h3 className="font-medium group-hover:text-accent transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};