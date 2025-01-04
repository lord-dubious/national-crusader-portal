import { CommandDialog, CommandInput, CommandList } from "@/components/ui/command";
import { SearchInput } from "./search/SearchInput";
import { SearchResults } from "./search/SearchResults";
import { useSearch } from "./search/useSearch";
import { useToast } from "@/hooks/use-toast";

export const HeaderSearch = () => {
  const { toast } = useToast();
  const {
    open,
    setOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading
  } = useSearch();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => setSearchQuery(""), 100);
    }
  };

  const handleError = () => {
    toast({
      variant: "destructive",
      title: "Search Error",
      description: "An error occurred while searching. Please try again."
    });
  };

  return (
    <>
      <SearchInput onOpenSearch={() => setOpen(true)} />

      <CommandDialog 
        open={open} 
        onOpenChange={handleOpenChange}
      >
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div className="bg-background border rounded-lg shadow-lg max-w-2xl w-full">
            <CommandInput 
              placeholder="Search articles..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-b"
            />
            <CommandList className="max-h-[500px] overflow-y-auto">
              <SearchResults 
                results={searchResults}
                isLoading={isLoading}
                searchQuery={searchQuery}
                onSelect={() => setOpen(false)}
              />
            </CommandList>
          </div>
        </div>
      </CommandDialog>
    </>
  );
};