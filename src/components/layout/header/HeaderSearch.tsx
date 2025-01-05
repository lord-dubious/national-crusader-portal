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
        contentClassName="fixed left-[50%] top-[50%] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-4 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:bg-slate-900"
      >
        <CommandInput 
          placeholder="Search articles..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="border-none focus:ring-0"
        />
        <CommandList className="max-h-[400px] overflow-y-auto">
          <SearchResults 
            results={searchResults}
            isLoading={isLoading}
            searchQuery={searchQuery}
            onSelect={() => setOpen(false)}
          />
        </CommandList>
      </CommandDialog>
    </>
  );
};