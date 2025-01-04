import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Fuse from 'fuse.js';

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
  const [fuse, setFuse] = useState<Fuse<any> | null>(null);
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
        // Configure Fuse instance with search options
        const fuseInstance = new Fuse(articles, {
          keys: [
            { name: 'title', weight: 2 },
            { name: 'excerpt', weight: 1 }
          ],
          threshold: 0.3,
          includeScore: true
        });
        setFuse(fuseInstance);
      } catch (error) {
        console.error("Error creating search instance:", error);
        toast({
          variant: "destructive",
          title: "Error creating search index",
          description: "Please try again later"
        });
      }
    }
  }, [articles, toast]);

  useEffect(() => {
    if (fuse && searchQuery.length >= 2) {
      try {
        const results = fuse.search(searchQuery);
        const formattedResults = results.map(result => result.item) as SearchResult[];
        setSearchResults(formattedResults);
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
  }, [searchQuery, fuse, toast]);

  return {
    open,
    setOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
  };
};