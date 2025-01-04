import { CommandDialog, CommandInput, CommandList } from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { SearchInput } from "./search/SearchInput";
import { SearchResults } from "./search/SearchResults";
import { useSearch } from "./search/useSearch";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export const HeaderSearch = () => {
  const navigate = useNavigate();
  const { 
    open, 
    setOpen, 
    searchQuery, 
    setSearchQuery, 
    searchResults 
  } = useSearch();

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
      <SearchInput onOpenSearch={() => setOpen(true)} />

      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <VisuallyHidden>
          <h2>Search articles</h2>
        </VisuallyHidden>
        <CommandInput 
          placeholder="Search articles..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <SearchResults 
            results={searchResults}
            searchQuery={searchQuery}
            onSelect={handleSelect}
          />
        </CommandList>
      </CommandDialog>
    </>
  );
};