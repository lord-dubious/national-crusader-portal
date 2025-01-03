import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface SearchResult {
  slug: string;
  title: string;
  excerpt?: string;
  category?: { name: string };
  author?: { username: string };
}

interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  onSelect: (item: SearchResult) => void;
}

export const SearchResults = ({ results, searchQuery, onSelect }: SearchResultsProps) => {
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
    </>
  );
};