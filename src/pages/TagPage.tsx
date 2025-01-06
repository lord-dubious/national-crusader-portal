import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { useToast } from "@/hooks/use-toast";

const TagPage = () => {
  const { slug } = useParams();
  const { toast } = useToast();

  const { data: tag, isLoading: tagLoading } = useQuery({
    queryKey: ["tag", slug],
    queryFn: async () => {
      console.log("Fetching tag:", slug);
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load tag",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
  });

  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ["tag-articles", tag?.id],
    queryFn: async () => {
      console.log("Fetching articles for tag:", tag?.id);
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(name)
        `)
        .eq("status", "published")
        .in("id", (
          await supabase
            .from("article_tags")
            .select("article_id")
            .eq("tag_id", tag.id)
        ).data?.map(at => at.article_id) || [])
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
    enabled: !!tag?.id,
  });

  if (tagLoading || articlesLoading) {
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

  if (!tag) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">Tag not found</h1>
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
          <h1 className="text-4xl font-bold mb-8">Articles tagged with "{tag.name}"</h1>
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
                No articles found with this tag.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TagPage;