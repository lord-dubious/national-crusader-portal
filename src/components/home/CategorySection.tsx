import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { Link } from "react-router-dom";

export const CategorySection = ({ categorySlug }: { categorySlug: string }) => {
  const { toast } = useToast();
  const { data: articles, error } = useQuery({
    queryKey: ["category-articles", categorySlug],
    queryFn: async () => {
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();

      if (!categoryData) return [];

      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          excerpt,
          featured_image,
          slug,
          category:categories(name, slug)
        `)
        .eq("status", "published")
        .eq("category_id", categoryData.id)
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
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (error) return null;
  if (!articles?.length) return null;

  return (
    <section className="py-12 first:pt-0 last:pb-0 animate-fade-up">
      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{articles[0]?.category?.name}</h2>
            <div className="h-1 w-24 bg-accent rounded hidden sm:block" />
          </div>
          <Button variant="ghost" size="sm" asChild className="group">
            <Link to={`/category/${articles[0]?.category?.slug}`}>
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
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