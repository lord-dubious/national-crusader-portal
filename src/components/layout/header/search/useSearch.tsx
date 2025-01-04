import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
// Import elasticlunr as a module
import * as elasticlunr from "elasticlunr";

interface SearchResult {
  slug: string;
  title: string;
  excerpt?: string;
  category?: { name: string };
  author?: { username: string };
}

export const useSearch = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { toast } = useToast();

  const { data: articles } = useQuery({
    queryKey: ["articles-for-search"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          slug,
          excerpt,
          category:categories(name),
          author:profiles(username)
        `)
        .eq('status', 'published');

      if (error) {
        console.error("Error fetching articles:", error);
        toast({
          variant: "destructive",
          title: "Error fetching articles",
          description: error.message
        });
        return [];
      }

      return data || [];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    if (articles) {
      try {
        // Create a new search index
        const index = elasticlunr(function(this: any) {
          this.addField('title');
          this.addField('excerpt');
          this.setRef('slug');
        });

        // Add documents to the index
        articles.forEach((article) => {
          index.addDoc({
            slug: article.slug,
            title: article.title,
            excerpt: article.excerpt || '',
          });
        });

        setSearchIndex(index);
      } catch (error) {
        console.error("Error creating search index:", error);
        toast({
          variant: "destructive",
          title: "Error creating search index",
          description: "Please try again later"
        });
      }
    }
  }, [articles, toast]);

  useEffect(() => {
    if (searchIndex && searchQuery.length >= 2) {
      try {
        const results = searchIndex.search(searchQuery, {
          fields: {
            title: { boost: 2 },
            excerpt: { boost: 1 }
          },
          expand: true
        });

        const fullResults = results
          .map((result: any) => {
            const article = articles?.find(a => a.slug === result.ref);
            return article ? {
              ...article,
              score: result.score
            } : null;
          })
          .filter(Boolean) as SearchResult[];

        setSearchResults(fullResults);
      } catch (error) {
        console.error("Error performing search:", error);
        toast({
          variant: "destructive",
          title: "Error performing search",
          description: "Please try again"
        });
      }
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchIndex, articles, toast]);

  return {
    open,
    setOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
  };
};