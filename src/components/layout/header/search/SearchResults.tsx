import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Loader2 } from "lucide-react";

interface SearchResult {
  slug: string;
  title: string;
  excerpt?: string;
  category_name?: string;
  author_username?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  onSelect: (item: SearchResult) => void;
  isLoading: boolean;
}

export const SearchResults = ({ 
  results, 
  searchQuery, 
  onSelect,
  isLoading 
}: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <CommandEmpty>
        {searchQuery.length < 2 
          ? "Type at least 2 characters to search..." 
          : "No results found."
        }
      </CommandEmpty>
      {results && results.length > 0 && (
        <CommandGroup heading="Articles">
          {results.map((article) => (
            <CommandItem
              key={article.slug}
              onSelect={() => onSelect(article)}
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
    </>
  );
};