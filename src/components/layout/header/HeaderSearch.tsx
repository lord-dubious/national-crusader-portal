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
      if (!searchQuery) return { articles: [], newspapers: [] };

      const [articlesResponse, newspapersResponse] = await Promise.all([
        supabase
          .from("articles")
          .select(`
            id,
            title,
            slug,
            status,
            category:categories(name)
          `)
          .or(`title.ilike.%${searchQuery}%, content.ilike.%${searchQuery}%`)
          .eq('status', 'published')
          .limit(5),
        
        supabase
          .from("newspapers")
          .select("*")
          .or(`title.ilike.%${searchQuery}%`)
          .eq('status', 'published')
          .limit(5)
      ]);

      if (articlesResponse.error) {
        toast({
          variant: "destructive",
          title: "Error searching articles",
          description: articlesResponse.error.message
        });
        throw articlesResponse.error;
      }

      if (newspapersResponse.error) {
        toast({
          variant: "destructive",
          title: "Error searching newspapers",
          description: newspapersResponse.error.message
        });
        throw newspapersResponse.error;
      }

      return {
        articles: articlesResponse.data,
        newspapers: newspapersResponse.data
      };
    },
    enabled: searchQuery.length > 0,
  });

  const handleSelect = (type: 'article' | 'newspaper', item: any) => {
    setOpen(false);
    if (type === 'article') {
      navigate(`/articles/${item.slug}`);
    } else {
      // Open newspaper in new tab since it's a PDF
      window.open(item.pdf_url, '_blank');
    }
  };

  return (
    <>
      <div className="hidden md:flex relative w-40">
        <Input
          type="search"
          placeholder="Search..."
          className="w-full bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm"
          onClick={() => setOpen(true)}
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-foreground/50" />
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden text-primary-foreground"
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
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{article.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {article.category?.name || 'Uncategorized'}
                    </div>
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