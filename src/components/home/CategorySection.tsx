import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";

export const CategorySection = ({ categorySlug }: { categorySlug: string }) => {
  const { toast } = useToast();
  const { data: articles, error } = useQuery({
    queryKey: ["category-articles", categorySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(name)
        `)
        .eq("status", "published")
        .eq("category.slug", categorySlug)
        .order("published_at", { ascending: false })
        .limit(3);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching articles",
          description: error.message
        });
        throw error;
      }
      return data;
    },
  });

  if (error) return null;
  if (!articles?.length) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">{articles[0]?.category?.name || categorySlug}</h2>
          <Button variant="ghost" asChild>
            <a href={`/category/${categorySlug}`} className="group">
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              category={article.category?.name || "Uncategorized"}
              title={article.title}
              excerpt={article.excerpt || ""}
              imageUrl={article.featured_image || ""}
              slug={article.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
};