import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export const FeaturedArticle = () => {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: featuredArticles, error: featuredError } = useQuery({
    queryKey: ["featured-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          category:categories(name)
        `)
        .eq("status", "published")
        .eq("is_featured", true)
        .order("published_at", { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching featured articles",
          description: error.message
        });
        throw error;
      }
      return data;
    },
  });

  useEffect(() => {
    if (featuredArticles && featuredArticles.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((current) => 
          current === featuredArticles.length - 1 ? 0 : current + 1
        );
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [featuredArticles]);

  if (featuredError) return null;
  if (!featuredArticles || featuredArticles.length === 0) return null;

  const currentArticle = featuredArticles[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((current) => 
      current === 0 ? featuredArticles.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((current) => 
      current === featuredArticles.length - 1 ? 0 : current + 1
    );
  };

  return (
    <article className="relative h-[70vh] min-h-[600px] w-full overflow-hidden rounded-lg animate-fade-up group">
      <img
        src={currentArticle.featured_image || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80"}
        alt={currentArticle.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      
      {featuredArticles.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous article"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next article"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-8">
        {currentArticle.category && (
          <div className="flex items-center space-x-4 mb-4">
            <span className="inline-block rounded bg-accent px-3 py-1 text-sm font-medium text-white">
              {currentArticle.category.name}
            </span>
            <span className="text-white/80 text-sm flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {new Date(currentArticle.published_at).toLocaleDateString()}
            </span>
          </div>
        )}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-2xl">
          {currentArticle.title}
        </h1>
        <p className="text-lg text-gray-200 mb-6 max-w-2xl">
          {currentArticle.excerpt}
        </p>
        <Button 
          className="group bg-accent hover:bg-accent/90"
          asChild
        >
          <a href={`/article/${currentArticle.slug}`}>
            Read More
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Button>
      </div>
    </article>
  );
};