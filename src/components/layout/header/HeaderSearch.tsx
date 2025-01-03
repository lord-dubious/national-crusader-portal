import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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
import elasticlunr from "elasticlunr";

export const HeaderSearch = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch articles to build search index
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

  // Build search index when articles are fetched
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

  // Perform search when query changes
  useEffect(() => {
    if (searchIndex && searchQuery.length >= 2) {
      const results = searchIndex.search(searchQuery, {
        fields: {
          title: {boost: 2},
          excerpt: {boost: 1}
        },
        expand: true
      });

      // Map results back to full article data
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

  const handleSelect = (item: any) => {
    setOpen(false);
    navigate(`/article/${item.slug}`);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => setSearchQuery(""), 100);
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

      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput 
          placeholder="Search articles..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>
            {searchQuery.length < 2 ? "Type at least 2 characters to search..." : "No results found."}
          </CommandEmpty>
          {searchResults && searchResults.length > 0 && (
            <CommandGroup heading="Articles">
              {searchResults.map((article: any) => (
                <CommandItem
                  key={article.slug}
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
                    <span>{article.category?.name || 'Uncategorized'}</span>
                    {article.author?.username && (
                      <>
                        <span>•</span>
                        <span>By {article.author.username}</span>
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