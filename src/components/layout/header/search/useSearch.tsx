import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SearchResult {
  slug: string;
  title: string;
  excerpt?: string;
  category_name?: string;
  author_username?: string;
}

export const useSearch = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { toast } = useToast();

  // Only fetch search results when we have a query
  const { isLoading } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return [];
      }

      const { data, error } = await supabase
        .rpc('search_articles', { search_query: searchQuery });

      if (error) {
        console.error("Error searching articles:", error);
        toast({
          variant: "destructive",
          title: "Error searching articles",
          description: error.message
        });
        return [];
      }

      setSearchResults(data || []);
      return data;
    },
    enabled: searchQuery.length >= 2,
  });

  return {
    open,
    setOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading
  };
};