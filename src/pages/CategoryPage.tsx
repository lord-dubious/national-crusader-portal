import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { useToast } from "@/hooks/use-toast";

const CategoryPage = () => {
  const { slug } = useParams();
  const { toast } = useToast();

  const { data: category, isLoading: categoryLoading, error: categoryError } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load category",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
  });

  const { data: articles, isLoading: articlesLoading, error: articlesError } = useQuery({
    queryKey: ["category-articles", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(name)
        `)
        .eq("category_id", category?.id)
        .eq("status", "published")
        .order("published_at", { ascending: false });
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load articles",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
    enabled: !!category?.id,
  });

  if (categoryLoading || articlesLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (categoryError || articlesError || !category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Category not found</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">{category.name}</h1>
          {category.description && (
            <p className="text-lg text-muted-foreground mb-8">{category.description}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles?.map((article) => (
              <ArticleCard
                key={article.id}
                category={article.category?.name || "Uncategorized"}
                title={article.title}
                excerpt={article.excerpt || ""}
                imageUrl={article.featured_image || ""}
                slug={article.slug}
              />
            ))}
            {articles?.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground">
                No articles found in this category.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;