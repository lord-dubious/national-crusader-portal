import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp } from "lucide-react";

export const TrendingSection = () => {
  const { toast } = useToast();
  const { data: trendingArticles, error } = useQuery({
    queryKey: ["trending-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
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
  });

  if (error) return null;
  if (!trendingArticles?.length) return null;

  return (
    <section className="bg-muted py-12 animate-fade-up">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-accent mr-2" />
          <h2 className="text-2xl font-bold">Trending Now</h2>
          <div className="h-1 bg-accent flex-grow ml-4 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingArticles.map((article, i) => (
            <a 
              key={article.id}
              href={`/article/${article.slug}`}
              className="flex items-start space-x-4 group cursor-pointer"
            >
              <span className="text-3xl font-bold text-accent">0{i + 1}</span>
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">
                  {article.category?.name || "Uncategorized"}
                </span>
                <h3 className="font-medium group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};