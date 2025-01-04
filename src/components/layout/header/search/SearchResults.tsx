import { CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface SearchResult {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category_name: string;
  author_username: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  searchQuery: string;
  onSelect?: () => void;
}

export const SearchResults = ({ results, isLoading, searchQuery, onSelect }: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
        Searching...
      </div>
    );
  }

  if (!searchQuery) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        Start typing to search articles...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <CommandEmpty>
        No articles found for "{searchQuery}"
      </CommandEmpty>
    );
  }

  return (
    <CommandGroup heading="Articles">
      {results.map((result) => (
        <Link 
          key={result.id} 
          to={`/article/${result.slug}`}
          onClick={onSelect}
        >
          <CommandItem className="cursor-pointer">
            <div className="flex flex-col gap-1 w-full">
              <span className="font-medium text-foreground dark:text-white">
                {result.title}
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">
                  {result.category_name || "Uncategorized"}
                </span>
                {result.author_username && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      By {result.author_username}
                    </span>
                  </>
                )}
              </div>
            </div>
          </CommandItem>
        </Link>
      ))}
    </CommandGroup>
  );
};