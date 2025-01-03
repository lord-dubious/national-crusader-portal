import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";

export const HeaderSearch = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];

      console.log("Searching for:", searchQuery);
      
      const { data, error } = await supabase
        .rpc('search_articles', { search_query: searchQuery });

      if (error) {
        console.error("Search error:", error);
        toast({
          variant: "destructive",
          title: "Error performing search",
          description: error.message
        });
        throw error;
      }

      console.log("Search results:", data);
      return data || [];
    },
    enabled: searchQuery.length >= 2,
    staleTime: 1000 * 60, // Cache for 1 minute
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  });

  const handleSelect = (item: any) => {
    setOpen(false);
    navigate(`/article/${item.slug}`);
  };

  return (
    <>
      <div className="hidden md:flex relative w-40">
        <Input
          type="search"
          placeholder="Search..."
          className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
          onClick={() => setOpen(true)}
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden text-white hover:text-accent"
        onClick={() => setOpen(true)}
      >
        <Search className="h-5 w-5" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search articles..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            {isLoading ? "Searching..." : "No results found."}
          </CommandEmpty>
          {searchResults && searchResults.length > 0 && (
            <CommandGroup heading="Articles">
              {searchResults.map((article: any) => (
                <CommandItem
                  key={article.id}
                  onSelect={() => handleSelect(article)}
                  className="flex flex-col items-start gap-1"
                >
                  <div className="font-medium">{article.title}</div>
                  {article.excerpt && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {article.excerpt}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{article.category_name || 'Uncategorized'}</span>
                    {article.author_username && (
                      <>
                        <span>•</span>
                        <span>By {article.author_username}</span>
                      </>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};