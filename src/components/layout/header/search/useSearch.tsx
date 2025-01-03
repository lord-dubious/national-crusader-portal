import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import elasticlunr from "elasticlunr";

export const useSearch = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
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
      const index = elasticlunr(function() {
        this.addField('title');
        this.addField('excerpt');
        this.setRef('slug');
      });

      articles.forEach((article) => {
        index.addDoc({
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          category_name: article.category?.name,
          author_username: article.author?.username,
        });
      });

      setSearchIndex(index);
    }
  }, [articles]);

  useEffect(() => {
    if (searchIndex && searchQuery.length >= 2) {
      const results = searchIndex.search(searchQuery, {
        fields: {
          title: {boost: 2},
          excerpt: {boost: 1}
        },
        expand: true
      });

      const fullResults = results.map((result: any) => {
        const article = articles?.find(a => a.slug === result.ref);
        return {
          ...article,
          score: result.score
        };
      });

      setSearchResults(fullResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchIndex, articles]);

  return {
    open,
    setOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
  };
};