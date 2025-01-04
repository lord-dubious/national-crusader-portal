import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category_name: string;
  author_username: string;
  similarity: number;
}

export const useSearch = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["article-search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      console.log("Searching for:", searchQuery);
      const { data, error } = await supabase
        .rpc('search_articles', {
          search_query: searchQuery
        });

      if (error) {
        console.error("Search error:", error);
        throw error;
      }

      console.log("Search results:", data);
      return data as SearchResult[];
    },
    enabled: searchQuery.length > 2,
  });

  return {
    open,
    setOpen,
    searchQuery,
    setSearchQuery,
    searchResults: searchResults || [],
    isLoading
  };
};