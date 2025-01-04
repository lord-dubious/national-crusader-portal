import { CommandDialog, CommandInput, CommandList } from "@/components/ui/command";
import { SearchInput } from "./search/SearchInput";
import { useState } from "react";
import { DialogTitle } from "@/components/ui/dialog";

export const HeaderSearch = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        <DialogTitle className="sr-only">Search articles</DialogTitle>
        <CommandInput 
          placeholder="Search articles..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <div className="py-6 text-center text-sm text-muted-foreground">
            Search functionality is currently disabled
          </div>
        </CommandList>
      </CommandDialog>
    </>
  );
};