import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { Link } from "react-router-dom";

export const CategorySection = ({ categorySlug }: { categorySlug: string }) => {
  const { toast } = useToast();

  const { data: articles, error, isLoading } = useQuery({
    queryKey: ["category-articles", categorySlug],
    queryFn: async () => {
      console.log("Fetching articles for category:", categorySlug);
      
      // First fetch the category
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id, name")
        .eq("slug", categorySlug)
        .maybeSingle();

      if (categoryError) {
        console.error("Category fetch error:", categoryError);
        toast({
          variant: "destructive",
          title: "Error fetching category",
          description: categoryError.message
        });
        return null;
      }

      if (!categoryData) {
        console.log("No category found for slug:", categorySlug);
        return null;
      }

      console.log("Found category:", categoryData);

      // Then fetch the articles
      const { data: articlesData, error: articlesError } = await supabase
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
      
      if (articlesError) {
        console.error("Articles fetch error:", articlesError);
        toast({
          variant: "destructive",
          title: "Error fetching articles",
          description: articlesError.message
        });
        return null;
      }

      console.log("Fetched articles:", articlesData);
      return { articles: articlesData, category: categoryData };
    },
    staleTime: 60 * 1000, // Cache for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  if (isLoading) {
    return (
      <section className="py-16 first:pt-0 last:pb-0">
        <div className="relative bg-[#F1F1F1] dark:bg-[#222222] shadow-lg rounded-xl p-8 overflow-hidden animate-pulse">
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-[#E1E1E1] dark:bg-[#333333] rounded w-1/4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-[#E1E1E1] dark:bg-[#333333] rounded" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !articles?.articles?.length) return null;

  return (
    <section className="py-16 first:pt-0 last:pb-0 animate-fade-up">
      <div className="relative bg-[#F6F6F7] dark:bg-[#222222] shadow-lg rounded-xl p-12 overflow-hidden border border-[#E1E1E1] dark:border-[#333333]">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#222222] dark:text-[#F1F1F1]">
              {articles.category.name}
            </h2>
            <div className="h-1 w-24 bg-accent rounded hidden sm:block" />
          </div>
          <Button variant="ghost" size="sm" asChild className="group hover:text-accent">
            <Link to={`/category/${categorySlug}`}>
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.articles.map((article) => (
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
