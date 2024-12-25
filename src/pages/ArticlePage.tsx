import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: article, isError } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(name)
        `)
        .eq("slug", slug)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching article:", error);
        throw error;
      }
      
      if (!data) {
        toast({
          variant: "destructive",
          title: "Article not found",
          description: "The requested article could not be found."
        });
        navigate("/");
        return null;
      }
      
      return data;
    },
  });

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-red-500">Error loading article</h1>
            <p>There was an error loading the article. Please try again later.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return null; // Will redirect via the queryFn
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <article className="container mx-auto px-4 py-8">
          {article.featured_image && (
            <div className="relative h-[50vh] mb-8 rounded-lg overflow-hidden">
              <img
                src={article.featured_image}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <span>{article.category?.name}</span>
                <span className="mx-2">•</span>
                <time>
                  {article.published_at &&
                    format(new Date(article.published_at), "MMMM d, yyyy")}
                </time>
              </div>
            </div>
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content || "" }}
            />
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ArticlePage;