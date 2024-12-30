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

  const { data: searchResults } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return { articles: [], newspapers: [] };

      console.log("Searching for:", searchQuery);

      // Search articles with improved content search
      const articlesResponse = await supabase
        .from("articles")
        .select(`
          id,
          title,
          slug,
          status,
          excerpt,
          content,
          category:categories(name)
        `)
        .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
        .eq('status', 'published')
        .limit(5);

      if (articlesResponse.error) {
        console.error("Articles search error:", articlesResponse.error);
        toast({
          variant: "destructive",
          title: "Error searching articles",
          description: articlesResponse.error.message
        });
        throw articlesResponse.error;
      }

      // Search newspapers
      const newspapersResponse = await supabase
        .from("newspapers")
        .select("*")
        .or(`title.ilike.%${searchQuery}%,pdf_url.ilike.%${searchQuery}%`)
        .eq('status', 'published')
        .limit(5);

      if (newspapersResponse.error) {
        console.error("Newspapers search error:", newspapersResponse.error);
        toast({
          variant: "destructive",
          title: "Error searching newspapers",
          description: newspapersResponse.error.message
        });
        throw newspapersResponse.error;
      }

      console.log("Search results:", {
        articles: articlesResponse.data,
        newspapers: newspapersResponse.data
      });

      return {
        articles: articlesResponse.data || [],
        newspapers: newspapersResponse.data || []
      };
    },
    enabled: searchQuery.length >= 2,
  });

  const handleSelect = (type: 'article' | 'newspaper', item: any) => {
    setOpen(false);
    if (type === 'article') {
      navigate(`/article/${item.slug}`);
    } else {
      const pdfUrl = supabase.storage
        .from('pdf_newspapers')
        .getPublicUrl(item.pdf_url).data.publicUrl;
      window.open(pdfUrl, '_blank');
    }
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
          placeholder="Search articles and newspapers..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {searchResults?.articles && searchResults.articles.length > 0 && (
            <CommandGroup heading="Articles">
              {searchResults.articles.map((article) => (
                <CommandItem
                  key={article.id}
                  onSelect={() => handleSelect('article', article)}
                  className="flex flex-col items-start gap-1"
                >
                  <div className="font-medium">{article.title}</div>
                  {article.excerpt && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {article.excerpt}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {article.category?.name || 'Uncategorized'}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {searchResults?.newspapers && searchResults.newspapers.length > 0 && (
            <CommandGroup heading="Newspapers">
              {searchResults.newspapers.map((newspaper) => (
                <CommandItem
                  key={newspaper.id}
                  onSelect={() => handleSelect('newspaper', newspaper)}
                  className="flex items-center justify-between"
                >
                  <div className="font-medium">{newspaper.title}</div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};
