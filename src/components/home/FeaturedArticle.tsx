import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export const FeaturedArticle = () => {
  const { toast } = useToast();
  const { data: featuredArticle, error } = useQuery({
    queryKey: ["featured-article"],
    queryFn: async () => {
      console.log("Fetching featured article");
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          excerpt,
          featured_image,
          slug,
          published_at,
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
    staleTime: 60 * 1000, // Cache for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  if (error || !featuredArticle) return null;

  return (
    <article className="relative h-[70vh] min-h-[600px] w-full overflow-hidden rounded-lg animate-fade-up">
      <img
        src={featuredArticle.featured_image || "/placeholder.svg"}
        alt={featuredArticle.title}
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        {featuredArticle.category && (
          <div className="flex items-center space-x-4 mb-4">
            <span className="inline-block rounded bg-accent px-3 py-1 text-sm font-medium text-white">
              {featuredArticle.category.name}
            </span>
            <span className="text-white/80 text-sm flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {new Date(featuredArticle.published_at || "").toLocaleDateString()}
            </span>
          </div>
        )}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-2xl">
          {featuredArticle.title}
        </h1>
        <p className="text-lg text-gray-200 mb-6 max-w-2xl">
          {featuredArticle.excerpt}
        </p>
        <Button 
          className="group bg-accent hover:bg-accent/90"
          asChild
        >
          <Link to={`/article/${featuredArticle.slug}`}>
            Read More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </article>
  );
};