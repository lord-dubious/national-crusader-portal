import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { memo } from "react";

export const FeaturedArticle = memo(() => {
  const { toast } = useToast();
  const { data: featuredArticle, error: featuredError } = useQuery({
    queryKey: ["featured-article"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(name)
        `)
        .eq("status", "published")
        .eq("is_featured", true)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching featured article",
          description: error.message
        });
        throw error;
      }
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    meta: {
      errorHandler: (error: any) => {
        toast({
          variant: "destructive",
          title: "Error fetching featured article",
          description: error.message
        });
      }
    }
  });

  if (featuredError || !featuredArticle) return null;

  return (
    <article className="relative h-[50vh] md:h-[70vh] min-h-[400px] w-full overflow-hidden rounded-lg animate-fade-up">
      <img
        src={featuredArticle.featured_image || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"}
        alt={featuredArticle.title}
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
        {featuredArticle.category && (
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="inline-block rounded bg-accent px-3 py-1 text-sm font-medium text-white">
              {featuredArticle.category.name}
            </span>
            <span className="text-white/80 text-sm flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {new Date(featuredArticle.published_at).toLocaleDateString()}
            </span>
          </div>
        )}
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4 max-w-2xl">
          {featuredArticle.title}
        </h1>
        <p className="text-base md:text-lg text-gray-200 mb-4 md:mb-6 max-w-2xl line-clamp-2 md:line-clamp-3">
          {featuredArticle.excerpt}
        </p>
        <Button 
          className="group bg-accent hover:bg-accent/90"
          asChild
          size="sm"
        >
          <a href={`/article/${featuredArticle.slug}`}>
            Read More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </div>
    </article>
  );
});

FeaturedArticle.displayName = "FeaturedArticle";