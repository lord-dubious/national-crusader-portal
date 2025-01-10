import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArticleCard } from "@/components/ArticleCard";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";

export const TagPage = () => {
  const { slug } = useParams();
  const { toast } = useToast();

  const { data, error, isLoading } = useQuery({
    queryKey: ["tag-articles", slug],
    queryFn: async () => {
      console.log("Fetching articles for tag:", slug);
      
      // First fetch the tag
      const { data: tagData, error: tagError } = await supabase
        .from("tags")
        .select("id, name")
        .eq("slug", slug)
        .maybeSingle();

      if (tagError) {
        console.error("Tag fetch error:", tagError);
        toast({
          variant: "destructive",
          title: "Error fetching tag",
          description: tagError.message
        });
        return null;
      }

      if (!tagData) {
        console.log("No tag found for slug:", slug);
        return null;
      }

      console.log("Found tag:", tagData);

      // Then fetch the articles
      const { data: articlesData, error: articlesError } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          excerpt,
          featured_image,
          slug,
          category:categories(name),
          tags!article_tags(
            id:tags(id),
            name:tags(name),
            slug:tags(slug)
          )
        `)
        .eq("status", "published")
        .eq("tags.id", tagData.id)
        .order("published_at", { ascending: false });

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
      return { articles: articlesData, tag: tagData };
    },
    staleTime: 60 * 1000, // Cache for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  if (error) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-12 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-96" />
              ))}
            </div>
          </div>
        ) : data?.tag ? (
          <>
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#111111] dark:text-[#F1F1F1]">
              Articles tagged with "{data.tag.name}"
            </h1>
            {data.articles?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    category={article.category?.name || "Uncategorized"}
                    title={article.title}
                    excerpt={article.excerpt || ""}
                    imageUrl={article.featured_image || ""}
                    slug={article.slug}
                    tags={article.tags}
                  />
                ))}
              </div>
            ) : (
              <p className="text-lg text-muted-foreground">
                No articles found with this tag.
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Tag Not Found</h1>
            <p className="text-muted-foreground">
              The tag you're looking for doesn't exist.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TagPage;