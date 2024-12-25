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

      console.log("Searching for:", searchQuery);

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
          .storage
          .from('pdf_newspapers')
          .list()
      ]);

      if (articlesResponse.error) {
        console.error("Articles search error:", articlesResponse.error);
        toast({
          variant: "destructive",
          title: "Error searching articles",
          description: articlesResponse.error.message
        });
        throw articlesResponse.error;
      }

      const filteredNewspapers = newspapersResponse.data?.filter(file => 
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];

      console.log("Search results:", {
        articles: articlesResponse.data,
        newspapers: filteredNewspapers
      });

      return {
        articles: articlesResponse.data || [],
        newspapers: filteredNewspapers
      };
    },
    enabled: searchQuery.length > 0,
  });

  const handleSelect = (type: 'article' | 'newspaper', item: any) => {
    setOpen(false);
    if (type === 'article') {
      navigate(`/article/${item.slug}`);
    } else {
      // Get the public URL for the PDF and open it in a new tab
      const pdfUrl = supabase.storage
        .from('pdf_newspapers')
        .getPublicUrl(item.name).data.publicUrl;
      window.open(pdfUrl, '_blank');
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
                  <div className="font-medium">{newspaper.name}</div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};